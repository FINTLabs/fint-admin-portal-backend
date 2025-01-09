package no.fint.portal.admin.service;

import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import no.fint.portal.model.organisation.Organisation;
import no.fint.portal.model.organisation.OrganisationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PreventCascadeDeleteService {

    private final ComponentService componentService;

    private final OrganisationService organisationService;

    public PreventCascadeDeleteService(ComponentService componentService, OrganisationService organisationService) {
        this.componentService = componentService;
        this.organisationService = organisationService;
    }

    public boolean hasComponentSameOrganisationsSize(Component newComponent, String name) {
        Optional<Component> existingComponent = componentService.getComponentByName(name);
        if (existingComponent.isEmpty()) return true;

        return getSize(existingComponent.get().getOrganisations()) == getSize(newComponent.getOrganisations());
    }

    public boolean hasComponentSameClientsSize(Component newComponent, String name) {
        Optional<Component> existingComponent = componentService.getComponentByName(name);
        if (existingComponent.isEmpty()) return true;

        return getSize(existingComponent.get().getClients()) == getSize(newComponent.getClients());
    }

    public boolean hasComponentSameAdaptersSize(Component newComponent, String name) {
        Optional<Component> existingComponent = componentService.getComponentByName(name);
        if (existingComponent.isEmpty()) return true;

        return getSize(existingComponent.get().getAdapters()) == getSize(newComponent.getAdapters());
    }

    public boolean hasOranisationSameComponentSize(Organisation newOrganisation, String name) {
        Optional<Organisation> existingOrganisation = organisationService.getOrganisation(name);
        if (existingOrganisation.isEmpty()) return true;

        return getSize(newOrganisation.getComponents()) == getSize(existingOrganisation.get().getComponents());
    }

    public boolean hasOranisationSameTechnicalContactSize(Organisation newOrganisation, String name) {
        Optional<Organisation> existingOrganisation = organisationService.getOrganisation(name);
        if (existingOrganisation.isEmpty()) return true;

        return getSize(newOrganisation.getTechicalContacts()) == getSize(existingOrganisation.get().getTechicalContacts());
    }

    private int getSize(List<String> list) {
        return list == null ? 0 : list.size();
    }
}
