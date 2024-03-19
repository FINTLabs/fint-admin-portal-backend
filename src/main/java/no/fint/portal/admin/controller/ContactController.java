package no.fint.portal.admin.controller;



import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.admin.service.LdapServiceRetryDecorator;
import no.fint.portal.exceptions.EntityFoundException;
import no.fint.portal.exceptions.EntityNotFoundException;
import no.fint.portal.exceptions.UpdateEntityMismatchException;
import no.fint.portal.model.ErrorResponse;
import no.fint.portal.model.contact.Contact;
import no.fint.portal.model.contact.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.UnknownHostException;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@Tag(name = "Contacts")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/contacts")
public class ContactController {

    private final ContactService contactService;

    private final LdapServiceRetryDecorator ldapServiceRetryDecorator;

    public ContactController(ContactService contactService, LdapServiceRetryDecorator ldapServiceRetryDecorator) {
        this.contactService = contactService;
        this.ldapServiceRetryDecorator = ldapServiceRetryDecorator;
    }

    @Operation(summary = "Add new contact")
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE

    )
    public ResponseEntity<Contact> addContact(@RequestBody final Contact contact) {
        log.trace("Contact: {}", contact);

        if (contactService.addContact(contact)) {
            return ResponseEntity.status(HttpStatus.CREATED).body(contact);
        }

        throw new EntityFoundException(
                ServletUriComponentsBuilder
                        .fromCurrentRequest().path("/{nin}")
                        .buildAndExpand(contact.getNin()).toUri().toString()
        );
    }

    @Operation(summary = "Update contact")
    @RequestMapping(value = "/{nin}",
            method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Contact> updateComponent(@RequestBody final Contact contact, @PathVariable final String nin) {
        log.trace("Contact: {}", contact);

        if (!nin.equals(contact.getNin())) {
            throw new UpdateEntityMismatchException(
                    String.format("Trying to updateEntry contact %s on endpoint for contact %s.", contact.getNin(), nin)
            );
        }

        if (!contactService.updateContact(contact)) {
            throw new EntityNotFoundException(String.format("Could not find contact: %s", contact));
        }

        return ResponseEntity.ok(contact);
    }

    @Operation(summary = "Get all contacts")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Contact>> getContacts() {
        return ResponseEntity.ok(ldapServiceRetryDecorator.getContacts());
    }

    @Operation(summary = "Get contact by nin")
    @RequestMapping(method = RequestMethod.GET, value = "/{nin}")
    public ResponseEntity<Contact> getContact(@PathVariable String nin) {
        Optional<Contact> contact = contactService.getContact(nin);

        if (contact.isPresent()) {
            return ResponseEntity.ok(contact.get());
        }

        throw new EntityNotFoundException(
                String.format("Contact with nin %s could not be found", nin)
        );
    }

    @Operation(summary = "Delete contact")
    @RequestMapping(method = RequestMethod.DELETE, value = "/{nin}")
    public ResponseEntity<Void> deleteContact(@PathVariable final String nin) {
        Optional<Contact> contact = contactService.getContact(nin);

        if (contact.isPresent()) {
            contactService.deleteContact(contact.get());
            return ResponseEntity.accepted().build();
        }

        throw new EntityNotFoundException(
                String.format("Contact %s not found", nin)
        );
    }

    //
    // Exception handlers
    //
    @ExceptionHandler(UpdateEntityMismatchException.class)
    public ResponseEntity<ErrorResponse> handleUpdateEntityMismatch(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(Exception e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(EntityFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityFound(Exception e) {
        return ResponseEntity.status(HttpStatus.FOUND).body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(NameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNameNotFound(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(UnknownHostException.class)
    public ResponseEntity<ErrorResponse> handleUnkownHost(Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(e.getMessage()));
    }
}
