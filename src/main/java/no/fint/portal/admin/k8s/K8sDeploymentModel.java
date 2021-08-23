package no.fint.portal.admin.k8s;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class K8sDeploymentModel {
    private String orgId;
    @Builder.Default
    private List<K8sComponentModel> components = new ArrayList<>();
}
