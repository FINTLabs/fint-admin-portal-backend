package no.fint.portal;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.contact.Contact;
import no.fint.portal.model.contact.ContactService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class LdapServiceRetryDecorator {

  @Autowired
  private ContactService contactService;

  @Autowired
  private OrganisationService organisationService;

  @Autowired
  private ComponentService componentService;

  @Retryable(
    backoff = @Backoff(delay = 200L),
    value = {InvalidResourceException.class},
    maxAttempts = 5
  )
  public List<Contact> getContacts() {
    List<Contact> contacts = contactService.getContacts();
    if (contacts.get(0).getNin() == null) {
      throw new InvalidResourceException("Invalid Contact");
    }
    return contacts;
  }

  @Retryable(
    backoff = @Backoff(delay = 200L),
    value = {InvalidResourceException.class},
    maxAttempts = 5
  )
  public List<Organisation> getOrganisations() {
    List<Organisation> organisations = organisationService.getOrganisations();
    if (organisations.get(0).getOrgNumber() == null) {
      throw new InvalidResourceException("Invalid Organisation");
    }
    return organisations;
  }

  @Retryable(
    backoff = @Backoff(delay = 200L),
    value = {InvalidResourceException.class},
    maxAttempts = 5
  )
  public List<Component> getComponents() {
    List<Component> components = componentService.getComponents();
    if (components.get(0).getName() == null) {
      throw new InvalidResourceException("Invalid Component");
    }
    return components;
  }
}
