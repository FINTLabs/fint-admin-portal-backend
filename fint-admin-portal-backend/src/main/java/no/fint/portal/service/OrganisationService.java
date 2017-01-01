package no.fint.portal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.Contact;
import no.fint.portal.model.Organisation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("ALL")
@Slf4j
@Service
public class OrganisationService {

  @Autowired
  private LdapService ldapService;

  @Autowired
  private ObjectService objectService;

  @Value("${fint.ldap.organisation-base}")
  private String organisationBase;

  public boolean createOrganisation(Organisation organisation) {
    log.info("Creating organisation: {}", organisation);

    if (organisation.getDn() == null) {
      objectService.setupOrganisation(organisation);
    }
    return ldapService.createEntry(organisation);
  }

  public boolean updateOrganisation(Organisation organisation) {
    return ldapService.updateEntry(organisation);
  }

  public List<Organisation> getOrganisations() {
    return ldapService.getAll(organisationBase, Organisation.class);
  }

  public Optional<Organisation> getOrganisationByOrgId(String orgId) {
    Optional<String> stringDnById = Optional.ofNullable(ldapService.getStringDnById(orgId, organisationBase, Organisation.class));

    if (stringDnById.isPresent()) {
      return Optional.of(ldapService.getEntry(stringDnById.get(), Organisation.class));
    }
    return Optional.empty();
  }

  public List<Contact> getOrganisationContacts(String uuid) {
    return ldapService.getAll(objectService.getOrganisationDnByUUID(uuid), Contact.class);
  }

  public boolean createOrganisationsContact(Contact contact, String orgUUID) {
    log.info("Creating contact: {}", contact);

    if (contact.getDn() == null) {
      objectService.setContactDn(contact, orgUUID);
    }
    contact.setOrgId(getOrganisationId(orgUUID));
    return ldapService.createEntry(contact);
  }

  public Optional<Contact> getOrganisationContact(String orgUUID, String nin) {

    return Optional.ofNullable(ldapService.getEntry(objectService.getContactDn(orgUUID, nin), Contact.class));
  }

  public boolean updateOrganisationContact(Contact contact) {
    return ldapService.updateEntry(contact);
  }

  public void deleteOrganisationContact(Contact contact) {
    ldapService.deleteEntry(contact);
  }

  public void deleteOrganisation(Organisation organisation) {
    List<Contact> contacts = getOrganisationContacts(organisation.getUuid());

    contacts.forEach(contact -> ldapService.deleteEntry(contact));

    ldapService.deleteEntry(organisation);
  }

  private String getOrganisationId(String uuid) {
    String dn = objectService.getOrganisationDnByUUID(uuid);
    Organisation organisation = ldapService.getEntry(dn, Organisation.class);

    return organisation.getOrgId();

  }

  public Optional<Organisation> getOrganisationByUUID(String uuid) {
    String dn = objectService.getOrganisationDnByUUID(uuid);

    return Optional.ofNullable(ldapService.getEntry(dn, Organisation.class));

  }
}
