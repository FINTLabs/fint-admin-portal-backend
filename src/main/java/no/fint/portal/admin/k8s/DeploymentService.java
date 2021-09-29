package no.fint.portal.admin.k8s;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.admin.k8s.model.*;
import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DeploymentService {

    private final ComponentSizeDefaultConfig componentSizeDefaultConfig;
    private final OrganisationService organisationService;
    private final ComponentService componentService;

    public DeploymentService(ComponentSizeDefaultConfig componentSizeDefaultConfig, OrganisationService organisationService, ComponentService componentService) {
        this.componentSizeDefaultConfig = componentSizeDefaultConfig;
        this.organisationService = organisationService;
        this.componentService = componentService;
    }

    public List<Deployment> getOrganisationDeployments(String environment) {
        List<Organisation> organisations = organisationService.getOrganisations();
        List<Component> components = componentService.getComponents();

        return organisations.stream()
                .filter(hasComponents())
                .filter(Organisation::isCustomer)
                .map(buildOrganisationDeployments(components, environment))
                .collect(Collectors.toList());
    }

    private Predicate<Organisation> hasComponents() {
        return organisation -> organisation.getComponents().size() > 0;
    }

    private Function<Organisation, Deployment> buildOrganisationDeployments(List<Component> components, String environment) {
        return organisation -> {
            Deployment deployment = Deployment.builder()
                    .orgId(organisation
                            .getPrimaryAssetId())
                    .build();

            addDeploymentConfiguration(components, environment, organisation, deployment);

            return deployment;
        };
    }

    private void addDeploymentConfiguration(List<Component> components, String environment, Organisation organisation, Deployment deployment) {
        components.stream()
                .filter(Component::isCore)
                .filter(hasComponent(organisation))
                .forEach(component -> {
                    Optional<List<ComponentConfiguration>> componentConfigurations = ComponentConfiguration.deserialize(component.getComponentConsumerConfiguration());
                    componentConfigurations.ifPresent(configurations ->
                            configurations
                                    .stream()
                                    .filter(byEnvironment(environment))
                                    .map(toDeploymentConfiguration(organisation, component))
                                    .forEach(deploymentConfiguration -> deployment.getComponents().add(deploymentConfiguration))
                    );
                });
    }

    private Predicate<Component> hasComponent(Organisation organisation) {
        return component -> component.getOrganisations().contains(organisation.getDn());
    }

    private Predicate<ComponentConfiguration> byEnvironment(String environment) {
        return componentConfiguration -> componentConfiguration.getEnvironment().equals(environment);
    }

    private Function<ComponentConfiguration, DeploymentConfiguration> toDeploymentConfiguration(Organisation organisation, Component component) {
        return componentConfiguration -> DeploymentConfiguration.builder()
                .path(component.getBasePath())
                .cacheDisabledFor(componentConfiguration.getCacheDisabledFor())
                .name(component.getName())
                .image(componentConfiguration.getImage())
                .size(getSize(organisation, componentConfiguration))
                .build();
    }

    private Size getSize(Organisation organisation, ComponentConfiguration component) {

        ComponentSizes componentSizes = component.getSizes();
        if (StringUtils.hasText(organisation.getK8sSize())) {
            return componentSizes.getSize(organisation.getK8sSize()).orElseGet(componentSizeDefaultConfig::getSmall);
        }
        return componentSizeDefaultConfig.getSmall();
    }
}
