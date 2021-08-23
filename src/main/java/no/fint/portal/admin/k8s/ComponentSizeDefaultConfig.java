package no.fint.portal.admin.k8s;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "fint.k8s.size.default")
public class ComponentSizeDefaultConfig  {
    private ComponentSizes.Size small;
    private ComponentSizes.Size large;
    private ComponentSizes.Size medium;

    public ComponentSizes getComponentSizes() {
        return ComponentSizes
                .builder()
                .small(small)
                .medium(medium)
                .large(large)
                .build();
    }
}
