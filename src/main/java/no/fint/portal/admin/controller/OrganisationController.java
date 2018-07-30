package no.fint.portal.admin.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.LdapServiceRetryDecorator;
import no.fint.portal.exceptions.CreateEntityMismatchException;
import no.fint.portal.exceptions.EntityFoundException;
import no.fint.portal.exceptions.EntityNotFoundException;
import no.fint.portal.exceptions.UpdateEntityMismatchException;
import no.fint.portal.model.ErrorResponse;
import no.fint.portal.model.asset.Asset;
import no.fint.portal.model.asset.AssetService;
import no.fint.portal.model.contact.Contact;
import no.fint.portal.model.contact.ContactService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.UnknownHostException;
import java.util.Optional;

@Slf4j
@RestController
@Api(tags = "Organisations")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/organisations")
public class OrganisationController {

  @Autowired
  private OrganisationService organisationService;

  @Autowired
  private AssetService assetService;

  @Autowired
  private LdapServiceRetryDecorator ldapServiceRetryDecorator;

  @Autowired
  private ContactService contactService;

  @ApiOperation("Create new organisation")
  @RequestMapping(method = RequestMethod.POST,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
  )
  public ResponseEntity createOrganization(@RequestBody final Organisation organisation) {
    log.info("Organisation: {}", organisation);

    if (!organisationService.createOrganisation(organisation)) {
      throw new EntityFoundException(
        ServletUriComponentsBuilder
          .fromCurrentRequest().path("/{uuid}")
          .buildAndExpand(organisation.getName()).toUri().toString()
      );
    }
    return ResponseEntity.status(HttpStatus.CREATED).body(organisation);
  }

  @ApiOperation("Update organisation")
  @RequestMapping(value = "/{name}",
    method = RequestMethod.PUT,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
  )
  public ResponseEntity updateOrganization(@RequestBody Organisation organisation, @PathVariable final String name) {
    log.info("Organisation: {}", organisation);

    if (!name.equals(organisation.getName())) {
      throw new UpdateEntityMismatchException(
        String.format("Trying to updateEntry organisation %s on endpoint for organisation %s.", organisation.getName(), name)
      );
    }

    if (!organisationService.updateOrganisation(organisation)) {
      throw new EntityNotFoundException(String.format("Could not find organisation: %s", organisation));
    }
    return ResponseEntity.ok(organisation);
  }


  @ApiOperation("Delete an organisation")
  @RequestMapping(method = RequestMethod.DELETE, value = "/{name}")
  public ResponseEntity deleteOrganization(@PathVariable final String name) {
    Optional<Organisation> organisation = organisationService.getOrganisation(name);

    if (organisation.isPresent()) {
      organisationService.deleteOrganisation(organisation.get());
      return ResponseEntity.accepted().build();
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s could not be found.", organisation.get().getName())
    );
  }

  @ApiOperation("Get all organisations")
  @RequestMapping(method = RequestMethod.GET)
  public ResponseEntity getOrganizations() {
    return ResponseEntity.ok().body(ldapServiceRetryDecorator.getOrganisations());
  }

  @ApiOperation("Get organisation by name")
  @RequestMapping(method = RequestMethod.GET, value = "/{name}")
  public ResponseEntity getOrganizationByName(@PathVariable String name) {
    Optional<Organisation> organisation = organisationService.getOrganisation(name);

    if (organisation.isPresent()) {
      return ResponseEntity.ok(organisation.get());
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s could not be found.", name)
    );
  }

  @ApiOperation("Get organisation by name")
  @GetMapping(value = "/{name}/asset/primary")
  public ResponseEntity getOrganizationPrimaryAsset(@PathVariable String name) {
    Optional<Organisation> organisation = organisationService.getOrganisation(name);

    if (organisation.isPresent()) {
      Optional<Asset> primaryAsset = assetService.getAssets(organisation.get()).stream().filter(asset -> asset.isPrimaryAsset()).findFirst();
      if (primaryAsset.isPresent()) {
        return ResponseEntity.ok(primaryAsset.get());
      }
      throw new EntityNotFoundException(
        String.format("Primary asset not present.")
      );
    }

    throw new EntityNotFoundException(
      String.format("Organisation %s could not be found so we can't find any primary asset for it either ;)", name)
    );
  }

  @GetMapping("/{orgName}/contacts/legal")
  @ApiOperation("Get Legal Contact")
  public ResponseEntity getLegalContact(@PathVariable String orgName) {
    Organisation organisation = organisationService.getOrganisation(orgName).orElseThrow(() -> new EntityFoundException("Organisation " + orgName + " not found."));

    Contact legalContact = organisationService.getLegalContact(organisation);
    if (legalContact == null) throw new EntityNotFoundException("Legal Contact not found");

    return ResponseEntity.ok(legalContact);
  }

  @PutMapping("/{orgName}/contacts/legal/{nin}")
  @ApiOperation("Set Legal Contact")
  public ResponseEntity linkLegalContact(@PathVariable String orgName, @PathVariable String nin) {
    Organisation organisation = organisationService.getOrganisation(orgName).orElseThrow(() -> new EntityFoundException("Organisation " + orgName + " not found."));
    Contact contact = contactService.getContact(nin).orElseThrow(() -> new EntityFoundException("Contact " + nin + " not found."));

    organisationService.linkLegalContact(organisation, contact);

    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{orgName}/contacts/legal/{nin}")
  @ApiOperation("Unset Legal Contact")
  public ResponseEntity unLinkLegalContact(@PathVariable String orgName, @PathVariable String nin) {
    Organisation organisation = organisationService.getOrganisation(orgName).orElseThrow(() -> new EntityFoundException("Organisation " + orgName + " not found."));
    Contact contact = contactService.getContact(nin).orElseThrow(() -> new EntityFoundException("Contact " + nin + " not found."));

    organisationService.unLinkLegalContact(organisation, contact);

    return ResponseEntity.noContent().build();
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
