package no.fint.adminportal.service;

import no.fint.adminportal.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Service;

import javax.naming.Name;
import java.util.UUID;

@SuppressWarnings("ALL")
@Service
public class ObjectService {

  @Autowired
  private
  LdapService ldapService;

  @Value("${fint.ldap.organisation-base}")
  private String organisationBase;

  @Value("${fint.ldap.component-base}")
  private String componentBase;

  public void setupOrganisation(Organisation organisation) {
    Organisation organisationFromLdap = ldapService.getEntryUniqueName(organisation.getOrgId(), organisationBase, Organisation.class);
    setupUuidObject(organisation, organisationFromLdap);
  }

  public void setupComponent(Component component) {
    Component componentFromLdap = ldapService.getEntryUniqueName(component.getTechnicalName(), componentBase, Component.class);
    setupUuidObject(component, componentFromLdap);
  }

  private void setupUuidObject(UuidLdapEntry uuidLdapEntry, UuidLdapEntry uuidEntryFromLdap) {
    Name dn;
    String uuid = UUID.randomUUID().toString();

    if (uuidEntryFromLdap == null) {
      dn = LdapNameBuilder.newInstance(getBase(uuidLdapEntry))
        .add("ou", uuid)
        .build();
      uuidLdapEntry.setUuid(uuid);
      uuidLdapEntry.setDn(dn);
    } else {
      uuidLdapEntry.setDn(LdapNameBuilder.newInstance(uuidEntryFromLdap.getDn()).build());
      uuidLdapEntry.setUuid(uuidEntryFromLdap.getUuid());
    }
  }

  private String getBase(BasicLdapEntry basicLdapEntry) {
    if (basicLdapEntry.getClass().equals(Component.class)) {
      return componentBase;
    }
    if (basicLdapEntry.getClass().equals(Organisation.class)) {
      return organisationBase;
    }

    return null;
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
