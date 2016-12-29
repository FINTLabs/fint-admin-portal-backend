package no.fint.adminportal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Contact;
import no.fint.adminportal.model.Organisation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.naming.directory.SearchControls;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class OrganisationService {

  @Autowired
  private LdapService ldapService;

  @Autowired
  private DnService dnService;

  private SearchControls searchControls;

  @Value("${fint.ldap.organisation-base}")
  private String organisationBase;

  public OrganisationService() {
    searchControls = new SearchControls();
    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
  }

  public boolean createOrganisation(Organisation organisation) {
    log.info("Creating organisation: {}", organisation);

    if (organisation.getDn() == null) {
      dnService.setOrganisationInternals(organisation);
    }
    return ldapService.create(organisation);
  }

  public boolean updateOrganisation(Organisation organisation) {
    return ldapService.update(organisation);
  }

  public List<Organisation> getOrganisations() {
    return ldapService.getAll(organisationBase, Organisation.class);
  }

  /*
  public Optional<Organisation> getOrganisationByOrgId(String orgId) {
    Optional<String> stringDnById = Optional.ofNullable(ldapService.getStringDnById(orgId, organisationBase, Organisation.class));

    if (stringDnById.isPresent()) {
      return Optional.of(ldapService.getEntry(stringDnById.get(), Organisation.class));
    }
    return Optional.empty();
  }
  */

  public List<Contact> getOrganisationContacts(String uuid) {
    return ldapService.getAll(dnService.getOrganisationDnByUUID(uuid), Contact.class);
  }

  public boolean createOrganisationsContact(Contact contact, String orgUUID) {
    log.info("Creating contact: {}", contact);

    if (contact.getDn() == null) {
      dnService.setContactDn(contact, orgUUID);
    }
    contact.setOrgId(getOrganisationId(orgUUID));
    return ldapService.create(contact);
  }

  public Optional<Contact> getOrganisationContact(String orgUUID, String nin) {

    return Optional.ofNullable(ldapService.getEntry(dnService.getContactDn(orgUUID, nin), Contact.class));
  }

  public boolean updateOrganisationContact(Contact contact) {
    return ldapService.update(contact);
  }

  public void deleteOrganisationContact(Contact contact) {
    ldapService.deleteEntry(contact);
  }

  public void deleteOrganisation(Organisation organisation) {
    List<Contact> contacts = getOrganisationContacts(organisation.getUuid());

    contacts.forEach(contact -> ldapService.deleteEntry(contact));

    ldapService.deleteEntry(organisation);
  }

  public String getOrganisationId(String uuid) {
    String dn = dnService.getOrganisationDnByUUID(uuid);
    Organisation organisation = ldapService.getEntry(dn, Organisation.class);

    return organisation.getOrgId();

  }

  public Optional<Organisation> getOrganisationByUUID(String uuid) {
    String dn = dnService.getOrganisationDnByUUID(uuid);
    Optional<Organisation> organisation = Optional.ofNullable(ldapService.getEntry(dn, Organisation.class));

    return organisation;

  }
}
