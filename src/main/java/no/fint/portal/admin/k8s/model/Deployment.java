package no.fint.portal.admin.k8s.model;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class Deployment {
    private String orgId;
    @Builder.Default
    private List<DeploymentConfiguration> components = new ArrayList<>();
}
