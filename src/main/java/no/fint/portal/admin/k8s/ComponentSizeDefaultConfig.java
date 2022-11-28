package no.fint.portal.admin.k8s;

import lombok.Data;
import no.fint.portal.admin.k8s.model.ComponentSizes;
import no.fint.portal.admin.k8s.model.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "fint.k8s.size.default")
public class ComponentSizeDefaultConfig  {
    private Size small;
    private Size large;
    private Size medium;

    public ComponentSizes getComponentSizes() {
        return ComponentSizes
                .builder()
                .small(small)
                .medium(medium)
                .large(large)
                .build();
    }
}
