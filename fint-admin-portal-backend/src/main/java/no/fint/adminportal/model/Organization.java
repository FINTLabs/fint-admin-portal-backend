package no.fint.adminportal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.DnAttribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

import javax.naming.Name;


@Data
@JsonIgnoreProperties(ignoreUnknown = true, value = {"dn", "ou"})
@Entry(objectClasses = {"organizationalUnit", "top", "fintOrg"})
public class Organization implements LdapEntry{

    @Id
    private Name dn;

    @DnAttribute(value = "ou", index = 2)
    private String ou;

    @Attribute(name = "fintOrgNumber")
    private String orgNumber;

    @Attribute(name = "fintOrgId")
    private String orgId;

    @Attribute(name = "fintOrgDisplayName")
    private String displayName;

}
