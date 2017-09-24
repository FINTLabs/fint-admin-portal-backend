package no.fint.portal.admin.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.contact.Contact;
import no.fint.portal.contact.ContactService;
import no.fint.portal.exceptions.CreateEntityMismatchException;
import no.fint.portal.exceptions.EntityFoundException;
import no.fint.portal.exceptions.EntityNotFoundException;
import no.fint.portal.exceptions.UpdateEntityMismatchException;
import no.fint.portal.model.ErrorResponse;
import no.fint.portal.organisation.Organisation;
import no.fint.portal.organisation.OrganisationService;
import no.rogfk.hateoas.extension.HalPagedResources;
import no.rogfk.hateoas.extension.annotations.HalResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.UnknownHostException;
import java.util.List;
import java.util.Optional;

@SuppressWarnings("ALL")
@Slf4j
@RestController
@Api(tags = "Organisations")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/organisations")
public class OrganisationController {

  @Autowired
  private OrganisationService organisationService;

  @Autowired
  private ContactService contactService;

  @ApiOperation("Request new organisation")
  @RequestMapping(method = RequestMethod.POST,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE

  )
  public ResponseEntity createOrganization(@RequestBody final Organisation organisation) {
    log.info("Organisation: {}", organisation);

    if (!organisationService.createOrganisation(organisation)) {
      throw new EntityFoundException(
        ServletUriComponentsBuilder
          .fromCurrentRequest().path("/{uuid}")
          .buildAndExpand(organisation.getUuid()).toUri().toString()
      );
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(organisation);
  }

  @ApiOperation("Update organisation")
  @RequestMapping(value = "/{uuid}",
    method = RequestMethod.PUT,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
  )
  public ResponseEntity updateOrganization(@RequestBody Organisation organisation, @PathVariable final String uuid) {
    log.info("Organisation: {}", organisation);

    if (!uuid.equals(organisation.getUuid())) {
      throw new UpdateEntityMismatchException(
        String.format("Trying to updateEntry organisation %s on endpoint for organisation %s.", organisation.getUuid(), uuid)
      );
    }

    if (!organisationService.updateOrganisation(organisation)) {
      throw new EntityNotFoundException(String.format("Could not find organisation: %s", organisation));
    }
    return ResponseEntity.ok(organisation);
  }


  @ApiOperation("Delete an organisation")
  @RequestMapping(method = RequestMethod.DELETE, value = "/{uuid}")
  public ResponseEntity deleteOrganization(@PathVariable final String uuid) {
    Optional<Organisation> organisation = organisationService.getOrganisationByUUID(uuid);

    if (organisation.isPresent()) {
      organisationService.deleteOrganisation(organisation.get());
      return ResponseEntity.accepted().build();
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s could not be found.", organisation.get().getUuid())
    );
  }


  @ApiOperation("Get all organisations")
  @HalResource(pageSize = 10)
  @RequestMapping(method = RequestMethod.GET)
  public HalPagedResources<Organisation> getOrganizations(@RequestParam(required = false) Integer page) {
    return new HalPagedResources<>(organisationService.getOrganisations(), page);
  }

  @ApiOperation("Get organisation by uuid")
  @RequestMapping(method = RequestMethod.GET, value = "/{uuid}")
  public ResponseEntity getOrganizationByUuid(@PathVariable String uuid) {
    Optional<Organisation> organisation = organisationService.getOrganisationByUUID(uuid);

    if (organisation.isPresent()) {
      return ResponseEntity.ok(organisation.get());
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s could not be found.", uuid)
    );
  }

  @ApiOperation("Request new contact")
  @RequestMapping(method = RequestMethod.POST,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
    value = "/{uuid}/contacts"
  )
  public ResponseEntity createContact(@RequestBody final Contact contact, @PathVariable final String uuid) {
    log.info("Contact: {}", contact);

    Optional<Organisation> organisation = organisationService.getOrganisationByUUID(uuid);

    if (!organisation.isPresent()) {
      throw new CreateEntityMismatchException(
        String.format("The organisation with uuid %s in the endpoint does not exist.", uuid)
      );
    }

    if (!contactService.addContact(contact, organisation.get())) {
      throw new EntityFoundException(
        ServletUriComponentsBuilder
          .fromCurrentRequest().path("/{nin}")
          .buildAndExpand(contact.getNin()).toUri().toString()
      );
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(contact);
  }

  @ApiOperation("Update organisation contact")
  @RequestMapping(method = RequestMethod.PUT,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE,
    value = "/{uuid}/contacts/{nin}"
  )
  public ResponseEntity updateOrganizationContact(@RequestBody final Contact contact, @PathVariable final String uuid,
                                                  @PathVariable final String nin) {
    log.info("Contact: {}", contact);

    Optional<Organisation> organisation = organisationService.getOrganisationByUUID(uuid);

    if (!organisation.isPresent()) {
      throw new UpdateEntityMismatchException("The organisation uuid in the endpoint does not exist.");
    }

    if (!nin.equals(contact.getNin())) {
      throw new UpdateEntityMismatchException("The contact to updateEntry is not the contact in endpoint.");
    }

    if (!contact.getOrgId().equals(organisation.get().getOrgId()) || (contact.getOrgId() == null)) {
      throw new UpdateEntityMismatchException(
        String.format("Contact belongs to orgId: %s. This orgId is: %s",
          contact.getOrgId(),
          organisation.get().getOrgId())
      );
    }

    if (!contactService.updateContact(contact)) {
      throw new EntityNotFoundException(String.format("Could not find contact: %s", contact));
    }

    return ResponseEntity.ok(contact);
  }

  @ApiOperation("Get the organisation contacts")
  @RequestMapping(method = RequestMethod.GET, value = "/{uuid}/contacts")
  public List<Contact> getOrganizationConcats(@PathVariable final String uuid) {
    Optional<List<Contact>> contacts = Optional.ofNullable(contactService.getContacts(uuid));

    if (contacts.isPresent()) {
      return contacts.get();
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s not found.", uuid)
    );
  }

  @ApiOperation("Get the organisation contact by nin")
  @RequestMapping(method = RequestMethod.GET, value = "/{uuid}/contacts/{nin}")
  public ResponseEntity getOrganizationConcat(@PathVariable final String uuid, @PathVariable final String nin) {
    Optional<Contact> contact = contactService.getContact(uuid, nin);

    if (contact.isPresent()) {
      return ResponseEntity.ok(contact.get());
    }

    throw new EntityNotFoundException(
      String.format("Contact %s not found in organisation %s",
        nin, uuid)
    );
  }

  @ApiOperation("Delete an organisation contact")
  @RequestMapping(method = RequestMethod.DELETE, value = "/{uuid}/contacts/{nin}")
  public ResponseEntity deleteOrganizationContacts(@PathVariable final String uuid, @PathVariable final String nin) {
    Optional<Contact> contact = contactService.getContact(uuid, nin);

    if (contact.isPresent()) {
      contactService.deleteContact(contact.get());
      return ResponseEntity.accepted().build();
    }

    throw new EntityNotFoundException(
      String.format("Contact %s not found in organisation %s",
        nin, uuid)
    );
  }

  //
  // Exception handlers
  //
  @ExceptionHandler(UpdateEntityMismatchException.class)
  public ResponseEntity handleUpdateEntityMismatch(Exception e) {
    return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity handleEntityNotFound(Exception e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(CreateEntityMismatchException.class)
  public ResponseEntity handleCreateEntityMismatch(Exception e) {
    return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(EntityFoundException.class)
  public ResponseEntity handleEntityFound(Exception e) {
    return ResponseEntity.status(HttpStatus.FOUND).body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(NameNotFoundException.class)
  public ResponseEntity handleNameNotFound(Exception e) {
    return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(UnknownHostException.class)
  public ResponseEntity handleUnkownHost(Exception e) {
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(e.getMessage()));
  }
}
