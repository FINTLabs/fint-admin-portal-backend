package no.fint.portal.admin.k8s.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DeploymentConfiguration {
    private String name;
    private String path;
    private String image;
    private List<String> cacheDisabledFor;
    private Size size;
}
