package no.fint.portal.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ComponentConfiguration {
    private String dn;
    private String name;
    private String displayName;
    private String path;
    private String assetPath;
    private List<ComponentClass> classes;
    private boolean isInProduction;
    private boolean isInBeta;
    private boolean isInPlayWithFint;
    private boolean core;
}
