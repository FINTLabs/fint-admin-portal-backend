package no.fint.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ComponentConfiguration {
    private String name;
    private Integer port;
    private String path;
    private String assetPath;
}
