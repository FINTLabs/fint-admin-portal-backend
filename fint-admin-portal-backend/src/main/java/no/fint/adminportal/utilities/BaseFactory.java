package no.fint.adminportal.utilities;

public class BaseFactory {

    private static final String ORGANIZATION_BASE = "ou=organisasjoner,%s";
    private static final String COMPONENT_BASE = "ou=felleskomponenter,%s";

    public static String getOrganizationBase(String base) {
        return String.format(ORGANIZATION_BASE, base);
    }

    public static String getComponentBase(String base) {
        return String.format(COMPONENT_BASE, base);
    }
}