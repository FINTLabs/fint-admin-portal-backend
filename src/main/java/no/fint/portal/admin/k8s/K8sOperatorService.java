package no.fint.portal.admin.k8s;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.component.Component;
import no.fint.portal.model.organisation.Organisation;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.function.Function;

@Slf4j
@Service
public class K8sOperatorService {

    private final ComponentSizeDefaultConfig componentSizeDefaultConfig;

    public K8sOperatorService(ComponentSizeDefaultConfig componentSizeDefaultConfig) {
        this.componentSizeDefaultConfig = componentSizeDefaultConfig;
    }

    public Function<Organisation, K8sDeploymentModel> buildOrganisationK8sDeploymentModel(List<Component> components) {
        return organisation -> {
            K8sDeploymentModel k8sDeploymentModel = K8sDeploymentModel.builder()
                    .orgId(organisation
                            .getPrimaryAssetId())
                    .build();

            components.stream()
                    .filter(Component::isCore)
                    .filter(component -> component.getOrganisations().contains(organisation.getDn()))
                    .forEach(component -> k8sDeploymentModel.getComponents().add(K8sComponentModel.builder()
                            .componentImage(component.getDockerImage())
                            .size(getSize(organisation, component))
                            .componentName(component.getName()).componentPath(component.getBasePath())
                            .build()));

            return k8sDeploymentModel;
        };
    }

    private ComponentSizes.Size getSize(Organisation organisation, Component component) {

        ComponentSizes componentSizes = ComponentSizes.deserialize(component.getComponentSizes()).orElseGet(componentSizeDefaultConfig::getComponentSizes);
        if (StringUtils.hasText(organisation.getK8sSize())) {
            return componentSizes.getSize(organisation.getK8sSize()).orElseGet(componentSizeDefaultConfig::getSmall);
        }
        return componentSizeDefaultConfig.getSmall();
    }
}
