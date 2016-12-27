package no.fint.adminportal.service;

import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.Contact;
import no.fint.adminportal.model.Organisation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Service;

import javax.naming.Name;
import java.util.UUID;

@Service
public class DnService {

    @Autowired
    LdapService ldapService;

    @Value("${fint.ldap.organisation-base}")
    private String organisationBase;

    @Value("${fint.ldap.component-base}")
    private String componentBase;

    public void setOrganisationDn(Organisation organisation) {

        Name dnById = ldapService.getDnById(organisation.getOrgId(), organisationBase, Organisation.class);
        Name dn;
        String uuid = UUID.randomUUID().toString();

        if (dnById == null) {
            dn = LdapNameBuilder.newInstance(organisationBase)
                    .add("ou", uuid)
                    .build();
            organisation.setUuid(uuid);
        } else {
            dn = dnById;
        }
        organisation.setDn(dn);
    }

    public void setComponentDn(Component component) {

        Name dnById = ldapService.getDnById(component.getTechnicalName(), componentBase, Component.class);
        Name dn;

        if (dnById == null) {
            dn = LdapNameBuilder.newInstance(componentBase)
                    .add("ou", UUID.randomUUID().toString())
                    .build();
        } else {
            dn = dnById;
        }
        component.setDn(dn);
    }

    public void setContactDn(Contact contact, String orgUUID) {

        //Name orgDn = ldapService.getDnById(contact.getOrgId(), organisationBase, Organisation.class);
        Name dn = LdapNameBuilder.newInstance(getOrganisationDnByUUID(orgUUID))
                .add("cn", contact.getNin())
                .build();
        contact.setDn(dn);
    }

    public String getContactDn(String orgUUID, String nin) {
        return LdapNameBuilder.newInstance(getOrganisationDnByUUID(orgUUID))
                .add("cn", nin)
                .build().toString();
    }

    public String getOrganisationDnByUUID(String uuid) {
        return LdapNameBuilder.newInstance(organisationBase)
                .add("ou", uuid)
                .build().toString();
    }

}
