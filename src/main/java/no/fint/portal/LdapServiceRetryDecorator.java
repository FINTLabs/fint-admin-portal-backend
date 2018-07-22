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

import java.util.Collections;
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
    if (contacts.size() > 0) {
      if (contacts.get(0).getNin() == null) {
        throw new InvalidResourceException("Invalid Contact");
      }
    }
    else {
      contacts = Collections.emptyList();
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
    if (organisations.size() > 0) {
      if (organisations.get(0).getOrgNumber() == null) {
        throw new InvalidResourceException("Invalid Organisation");
      }
    } else {
      organisations = Collections.emptyList();
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
    if (components.size() > 0) {
      if (components.get(0).getName() == null) {
        throw new InvalidResourceException("Invalid Component");
      }
    }
    else {
      components = Collections.emptyList();
    }
    return components;
  }
  /*
  @Retryable(
    backoff = @Backoff(delay = 200L),
    value = {InvalidResourceException.class},
    maxAttempts = 5
  )
  public List<Contact> getContacts() {
    List<Contact> contacts = contactService.getContacts();
    if (contacts.size() == 0) {
      contacts = Collections.emptyList();
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
    if (organisations.size() == 0) {
      organisations = Collections.emptyList();
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
    if (components.size() == 0) {
      components = Collections.emptyList();
    }
    return components;
  }
  */
}
