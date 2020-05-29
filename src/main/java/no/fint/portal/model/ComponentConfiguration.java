package no.fint.portal.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ComponentConfiguration {
    private String name;
    private String path;
    private String assetPath;
    private List<String> classes;
    private boolean isInProduction;
    private boolean isInBeta;
    private boolean isInPlayWithFint;
}
