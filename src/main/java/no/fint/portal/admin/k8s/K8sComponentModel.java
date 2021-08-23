package no.fint.portal.admin.k8s;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class K8sComponentModel {
    private String componentName;
    private String componentPath;
    private String componentImage;
    private ComponentSizes.Size size;
}
