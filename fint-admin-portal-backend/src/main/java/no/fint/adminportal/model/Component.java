package no.fint.adminportal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.DnAttribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

import javax.naming.Name;


@Data
@JsonIgnoreProperties(ignoreUnknown = true, value = {"dn"})
@Entry(objectClasses = {"organizationalUnit", "top", "fintComponent"})
public class Component implements LdapEntry{

    @Id
    private Name dn;

    @Attribute(name = "ou")
    private String technicalName;

    @Attribute(name = "fintCompDisplayName")
    private String displayName;

    @Attribute(name = "description")
    private String description;
}
