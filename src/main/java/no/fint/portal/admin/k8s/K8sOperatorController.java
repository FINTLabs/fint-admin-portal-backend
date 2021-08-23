package no.fint.portal.admin.k8s;

import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/k8s/deployments")
public class K8sOperatorController {
    private final OrganisationService organisationService;
    private final ComponentService componentService;
    private final K8sOperatorService k8sOperatorService;

    public K8sOperatorController(OrganisationService organisationService, ComponentService componentService, K8sOperatorService k8sOperatorService) {
        this.organisationService = organisationService;
        this.componentService = componentService;
        this.k8sOperatorService = k8sOperatorService;
    }

    @GetMapping
    public ResponseEntity<List<K8sDeploymentModel>> getK8sDeployments() {
        List<Organisation> organisations = organisationService.getOrganisations();
        List<Component> components = componentService.getComponents();

        List<K8sDeploymentModel> deployments = organisations.stream()
                .filter(organisation -> organisation.getComponents().size() > 0)
                .map(k8sOperatorService.buildOrganisationK8sDeploymentModel(components)).collect(Collectors.toList());

        return ResponseEntity.ok(deployments);
    }


}
