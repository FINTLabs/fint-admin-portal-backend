package no.fint.portal.admin.controller;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class K8sDeploymentSource {
    private List<String> orgId;
    private String componentName;
    private String componentPath;
    private String componentImage;
    private String componentResourceSize;
}
