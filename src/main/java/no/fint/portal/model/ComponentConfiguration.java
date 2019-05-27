package no.fint.portal.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ComponentConfiguration {
    private String name;
    private String path;
    private String assetPath;
    private boolean isInProduction;
    private boolean isInBeta;
    private boolean isInPlayWithFint;
}
