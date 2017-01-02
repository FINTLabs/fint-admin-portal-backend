package no.fint.portal.service;

import no.fint.portal.model.*;
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
    setupUuidContainerObject(organisation, organisationFromLdap);
  }

  public void setupComponent(Component component) {
    Component componentFromLdap = ldapService.getEntryUniqueName(component.getTechnicalName(), componentBase, Component.class);
    setupUuidContainerObject(component, componentFromLdap);
  }

  private void setupUuidContainerObject(UuidLdapEntry uuidLdapEntry, UuidLdapEntry uuidEntryFromLdap) {
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

  public void setupClient(Client client, String compUuid, String orgUuid) {
    client.setUuid(UUID.randomUUID().toString());
    client.setDn(
      LdapNameBuilder.newInstance(getClientBase(compUuid, orgUuid))
        .add("cn", client.getUuid())
        .build()
    );
    client.setPassword(
      UUID.randomUUID().toString().replace("-", "")
    );
  }

  public void setupAdapter(Adapter adapter, String compUuid, String orgUuid) {
    adapter.setUuid(UUID.randomUUID().toString());
    adapter.setDn(
      LdapNameBuilder.newInstance(getAdapterBase(compUuid, orgUuid))
        .add("cn", adapter.getUuid())
        .build()
    );
    adapter.setPassword(
      UUID.randomUUID().toString().replace("-", "")
    );
  }

  public Name getClientBase(String compUuid, String orgUuid) {
    return LdapNameBuilder.newInstance(componentBase)
      .add("ou", compUuid)
      .add("ou", orgUuid)
      .add("ou", "clients")
      .build();
  }

  public Name getAdapterBase(String compUuid, String orgUuid) {
    return LdapNameBuilder.newInstance(componentBase)
      .add("ou", compUuid)
      .add("ou", orgUuid)
      .add("ou", "adapters")
      .build();
  }

  public String getClientDn(String clientUuid, String compUuid, String orgUuid) {
    return LdapNameBuilder.newInstance(getClientBase(compUuid, orgUuid))
      .add("cn", clientUuid)
      .build()
      .toString();
  }

  public String getAdapterDn(String adapterUuid, String compUuid, String orgUuid) {
    return LdapNameBuilder.newInstance(getAdapterBase(compUuid, orgUuid))
      .add("cn", adapterUuid)
      .build()
      .toString();
  }
}
