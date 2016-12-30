package no.fint.adminportal.service;

import no.fint.adminportal.model.*;
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

  public void setOrganisationInternals(Organisation organisation) {
    Organisation organisationFromLdap = ldapService.getEntryById(organisation.getOrgId(), organisationBase, Organisation.class);
    setInternals(organisation, organisationFromLdap);
  }

  private void setInternals(LdapEntry ldapEntry, LdapEntry ldapEntryFromLdap) {
    Name dn;
    String uuid = UUID.randomUUID().toString();

    if (ldapEntryFromLdap == null) {
      dn = LdapNameBuilder.newInstance(getBase(ldapEntry))
        .add("ou", uuid)
        .build();
      ldapEntry.setUuid(uuid);
      ldapEntry.setDn(dn);
    } else {
      ldapEntry.setDn(LdapNameBuilder.newInstance(ldapEntryFromLdap.getDn()).build());
      ldapEntry.setUuid(ldapEntryFromLdap.getUuid());
    }
  }

  private String getBase(LdapEntry ldapEntry) {
    if (ldapEntry.getClass().equals(Component.class)) {
      return componentBase;
    }
    if (ldapEntry.getClass().equals(Organisation.class)) {
      return organisationBase;
    }

    return null;
  }

  public void setComponentInternals(Component component) {
    Component componentFromLdap = ldapService.getEntryById(component.getTechnicalName(), componentBase, Component.class);
    setInternals(component, componentFromLdap);
  }

  public void setContactDn(Contact contact, String orgUUID) {
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

  public String getComponentDnByUUID(String uuid) {
    return LdapNameBuilder.newInstance(componentBase)
      .add("ou", uuid)
      .build().toString();
  }

  public void setOrganisationContainerDN(Container organisationContainer, String componentUuid) {
    organisationContainer.setDn(
      LdapNameBuilder.newInstance(getComponentDnByUUID(componentUuid))
        .add("ou", organisationContainer.getOu())
        .build()
    );
  }

  public void setClientContainerDN(Container clientContainer, Container organisationContainer) {
    clientContainer.setDn(
      LdapNameBuilder.newInstance(organisationContainer.getDn())
        .add("ou", clientContainer.getOu())
        .build()
    );
  }

  public void setAdapterContainerDN(Container adapterContainer, Container organisationContainer) {
    adapterContainer.setDn(
      LdapNameBuilder.newInstance(organisationContainer.getDn())
        .add("ou", adapterContainer.getOu())
        .build()
    );
  }
}
