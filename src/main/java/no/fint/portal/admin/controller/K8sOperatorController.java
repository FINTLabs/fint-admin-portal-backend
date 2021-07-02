package no.fint.portal.admin.controller;

import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/k8s/deployments")
public class K8sOperatorController {
    private final OrganisationService organisationService;
    private final ComponentService componentService;

    public K8sOperatorController(OrganisationService organisationService, ComponentService componentService) {
        this.organisationService = organisationService;
        this.componentService = componentService;
    }

    @GetMapping
    public ResponseEntity<List<K8sDeploymentSource>> getK8sDeployments() {
        List<Component> components = componentService.getComponents();
        List<K8sDeploymentSource> arrayListStream = components
                .stream()
                .filter(Component::isCore)
                .map(c ->
                        K8sDeploymentSource.builder()
                                .orgId(c.getOrganisations())
                                .componentName(c.getName())
                                .componentPath(c.getBasePath())
                                .componentImage("fintlabsacr.azurecr.io/kulturtanken:build.21")
                                .componentResourceSize("small")
                                .build()
                )
                .collect(Collectors.toList());

        return ResponseEntity.ok(arrayListStream);
    }
}
