package no.fint.portal.admin.k8s;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class K8sComponentModel {
    private String componentName;
    private String componentPath;
    private String componentImage;
    private List<String> cacheDisabledFor;
    private ComponentSizes.Size size;
}
