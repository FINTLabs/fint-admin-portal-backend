package no.fint.portal.admin.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.adapter.Adapter;
import no.fint.portal.model.adapter.AdapterService;
import no.fint.portal.model.client.Client;
import no.fint.portal.model.client.ClientService;
import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.contact.Contact;
import no.fint.portal.model.contact.ContactService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@RestController
@Tag(name = "Maintenance")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/maintenance")
public class MaintenanceController {

    private final ComponentService componentService;

    private final ContactService contactService;

    private final OrganisationService organisationService;

    private final ClientService clientService;

    private final AdapterService adapterService;

    public MaintenanceController(ComponentService componentService, ContactService contactService, OrganisationService organisationService, ClientService clientService, AdapterService adapterService) {
        this.componentService = componentService;
        this.contactService = contactService;
        this.organisationService = organisationService;
        this.clientService = clientService;
        this.adapterService = adapterService;
    }

    @GetMapping("/consistency/components/organisations")
    public Map<String, List<String>> componentOrganisationConsistency() {
        return componentService.getComponents()
                .stream()
                .collect(Collectors.toMap(Component::getDn, this::checkComponentOrganisations));
    }

    @GetMapping("/consistency/organisations/contacts/technical")
    public Map<String, List<String>> organisationTechnicalContactsConsistency() {
        return organisationService.getOrganisations()
                .stream()
                .collect(Collectors.toMap(Organisation::getDn, this::checkOrganisationTechnicalContacts));
    }

    @PostMapping("/repair/organisations/contacts/technical")
    public Map<String, List<String>> repairOrganisationTechnicalContactsConsistency() {
        return organisationService.getOrganisations()
                .stream()
                .collect(Collectors.toMap(Organisation::getDn, this::repairOrganisationTechnicalContacts));
    }

    @GetMapping("/consistency/components/clients")
    public Map<String, List<String>> componentClientConsistency() {
        return componentService.getComponents()
                .stream()
                .collect(Collectors.toMap(Component::getDn, this::checkComponentClients));
    }

    @GetMapping("/consistency/components/adapters")
    public Map<String, List<String>> componentAdapterConsistency() {
        return componentService.getComponents()
                .stream()
                .collect(Collectors.toMap(Component::getDn, this::checkComponentAdapters));
    }

    @GetMapping("/consistency/contacts/legal")
    public Map<String, List<String>> legalContactConsistency() {
        return contactService.getContacts()
                .stream()
                .collect(Collectors.toMap(this::getContactName,
                        this::checkLegalContacts,
                        this::merge));
    }

    @GetMapping("/consistency/contacts/technical")
    public Map<String, List<String>> technicalContactConsistency() {
        return contactService.getContacts()
                .stream()
                .collect(Collectors.toMap(this::getContactName, this::checkTechnicalContacts, this::merge));
    }

    @PostMapping("/repair/components/organisation")
    public Map<String, List<String>> repairComponentsOrganisation() {
        return componentService.getComponents()
                .stream()
                .collect(Collectors.toMap(Component::getDn, this::repairComponentOrganisations));
    }

    private List<String> repairComponentOrganisations(Component component) {
        return component.getOrganisations()
                .stream()
                .map(organisation -> {
                    Optional<Organisation> optionalOrganisation = organisationService.getOrganisationByDn(organisation);
                    if (!optionalOrganisation.isPresent()) {
                        return null;
                    }
                    Organisation org = optionalOrganisation.get();
                    if (org.getComponents()
                            .stream()
                            .noneMatch(component.getDn()::equals)) {
                        org.getComponents().add(component.getDn());
                        organisationService.updateOrganisation(org);
                        return "Repaired: " + organisation;
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<String> repairOrganisationTechnicalContacts(Organisation organisation) {
        return organisation.getTechicalContacts().stream()
                .map(contact -> {
                    Optional<Contact> optionalContact = contactService.getContactByDn(contact);
                    if (!optionalContact.isPresent()) {
                        return null;
                    }

                    Contact contact1 = optionalContact.get();
                    if (contact1
                            .getTechnical()
                            .stream()
                            .noneMatch(organisation.getDn()::equals)) {
                        contact1.getTechnical().add(organisation.getDn());
                        contactService.updateContact(contact1);
                        return "Repaired: " + contact;
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<String> checkOrganisationTechnicalContacts(Organisation organisation) {
        return organisation.getTechicalContacts().stream()
                .map(contact -> {
                    Optional<Contact> optionalContact = contactService.getContactByDn(contact);
                    if (!optionalContact.isPresent()) {
                        return "Not found: " + contact;
                    }
                    if (optionalContact.get()
                            .getTechnical()
                            .stream()
                            .anyMatch(organisation.getDn()::equals)) {
                        return "OK: " + contact;
                    }
                    return "Missing: " + contact;
                })
                .collect(Collectors.toList());
    }

    private List<String> checkComponentAdapters(Component component) {
        return component.getAdapters()
                .stream()
                .map(adapter -> {
                    Optional<Adapter> optionalAdapter = adapterService.getAdapterByDn(adapter);
                    if (!optionalAdapter.isPresent()) {
                        return "Not found: " + adapter;
                    }
                    if (optionalAdapter.get()
                            .getComponents()
                            .stream()
                            .anyMatch(component.getDn()::equals)) {
                        return "OK: " + adapter;
                    }
                    return "Missing: " + adapter;
                })
                .collect(Collectors.toList());
    }

    private List<String> checkComponentClients(Component component) {
        return component.getClients()
                .stream()
                .map(client -> {
                    Optional<Client> optionalClient = clientService.getClientByDn(client);
                    if (!optionalClient.isPresent()) {
                        return "Not found: " + client;
                    }
                    if (optionalClient.get()
                            .getComponents()
                            .stream()
                            .anyMatch(component.getDn()::equals)) {
                        return "OK: " + client;
                    }
                    return "Missing: " + client;
                })
                .collect(Collectors.toList());
    }

    private List<String> checkTechnicalContacts(Contact contact) {
        return contact.getTechnical()
                .stream()
                .map(organisation -> {
                    Optional<Organisation> optionalOrganisation = organisationService.getOrganisationByDn(organisation);
                    if (!optionalOrganisation.isPresent()) {
                        return "Not found: " + organisation;
                    }
                    if (optionalOrganisation.get()
                            .getTechicalContacts()
                            .stream()
                            .anyMatch(contact.getDn()::equals)) {
                        return "OK: " + organisation;
                    }
                    return "Missing: " + organisation;
                })
                .collect(Collectors.toList());
    }

    private List<String> merge(List<String> a, List<String> b) {
        return Stream.concat(a.stream(), b.stream()).collect(Collectors.toList());
    }

    private String getContactName(Contact contact) {
        return String.format("%s %s <%s>", contact.getFirstName(), contact.getLastName(), contact.getDn());
    }

    private List<String> checkLegalContacts(Contact contact) {
        return contact.getLegal()
                .stream()
                .map(organisation -> {
                    Optional<Organisation> optionalOrganisation = organisationService.getOrganisationByDn(organisation);
                    if (!optionalOrganisation.isPresent()) {
                        return "Not found: " + organisation;
                    }
                    if (contact.getDn().equals(
                            optionalOrganisation.get()
                                    .getLegalContact())) {
                        return "OK : " + organisation;
                    }
                    return "Missing: " + organisation;
                })
                .collect(Collectors.toList());
    }

    private List<String> checkComponentOrganisations(Component component) {
        return component.getOrganisations()
                .stream()
                .map(organisation -> {
                    Optional<Organisation> optionalOrganisation = organisationService.getOrganisationByDn(organisation);
                    if (!optionalOrganisation.isPresent()) {
                        return "Not found: " + organisation;
                    }
                    if (optionalOrganisation.get()
                            .getComponents()
                            .stream()
                            .anyMatch(component.getDn()::equals)) {
                        return "OK: " + organisation;
                    }
                    return "Missing: " + organisation;
                })
                .collect(Collectors.toList());
    }
}
