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

    @Value("${fint.ldap.contact-base}")
    private String contactBase;

    public void setOrganisationDn(Organisation organisation) {

        Name dnById = ldapService.getDnById(organisation.getOrgId(), organisationBase, Organisation.class);
        Name dn;

        if (dnById == null) {
            dn = LdapNameBuilder.newInstance(organisationBase)
                    .add("ou", UUID.randomUUID().toString())
                    .build();
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

    public void setContactDn(Contact contact) {

        Name orgDn = ldapService.getDnById(contact.getOrgId(), organisationBase, Organisation.class);
        Name dn = LdapNameBuilder.newInstance(orgDn)
                .add("cn", contact.getNin())
                .build();
        contact.setDn(dn);
    }

    public String getOrganisationDnById(String id) {
        return LdapNameBuilder.newInstance(organisationBase)
                .add("ou", id)
                .build().toString();
    }

}
