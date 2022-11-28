package no.fint.portal.admin.k8s;

import no.fint.portal.admin.k8s.model.Deployment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api/k8s/deployments/{environment}")
public class DeploymentController {
    private final DeploymentService k8SDeploymentService;

    public DeploymentController(DeploymentService k8SDeploymentService) {
        this.k8SDeploymentService = k8SDeploymentService;
    }

    @GetMapping("consumer")
    public ResponseEntity<List<Deployment>> getK8sDeployments(@PathVariable String environment) {
        return ResponseEntity.ok(k8SDeploymentService.getOrganisationDeployments(environment));
    }


}
