package no.fint.adminportal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.Container;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ComponentService {

  @Autowired
  private LdapService ldapService;

  @Autowired
  private ObjectService objectService;

  @Value("${fint.ldap.component-base}")
  private String componentBase;

  public boolean createComponent(Component component) {
    log.info("Creating component: {}", component);

    if (component.getDn() == null) {
      objectService.setupComponent(component);
    }
    return ldapService.createEntry(component);
  }

  public boolean updateComponent(Component component) {
    log.info("Updating component: {}", component);

    return ldapService.updateEntry(component);
  }

  public List<Component> getComponents() {
    return ldapService.getAll(componentBase, Component.class);
  }

  /*
  public Optional<Component> getComponentByTechnicalName(String technicalName) {
    Optional<String> stringDnById = Optional.ofNullable(ldapService.getStringDnById(technicalName, componentBase, Component.class));

    if (stringDnById.isPresent()) {
      return Optional.of(ldapService.getEntry(stringDnById.get(), Component.class));
    }
    return Optional.empty();
  }
  */

  public Optional<Component> getComponentByUUID(String uuid) {
    String dn = objectService.getComponentDnByUUID(uuid);

    return Optional.ofNullable(ldapService.getEntry(dn, Component.class));
  }

  public void deleteComponent(Component component) {
    ldapService.deleteEntry(component);
  }

  public void addOrganisationToComponent(String componentUuid, String organistionUuid) {
    Container organisationContainer = new Container();
    Container clientContainer = new Container();
    Container adapterContainer = new Container();

    organisationContainer.setOu(organistionUuid);
    clientContainer.setOu("Clients");
    adapterContainer.setOu("Adapters");

    objectService.setOrganisationContainerDN(organisationContainer, componentUuid);
    ldapService.createEntry(organisationContainer);

    objectService.setClientContainerDN(clientContainer, organisationContainer);
    ldapService.createEntry(clientContainer);

    objectService.setAdapterContainerDN(adapterContainer, organisationContainer);
    ldapService.createEntry(adapterContainer);
  }

  public void removeOrganisationFromComponent(String componentUuid, String organistionUuid) {
    Container organisationContainer = new Container();
    Container clientContainer = new Container();
    Container adapterContainer = new Container();

    organisationContainer.setOu(organistionUuid);
    clientContainer.setOu("Clients");
    adapterContainer.setOu("Adapters");

    objectService.setOrganisationContainerDN(organisationContainer, componentUuid);

    objectService.setClientContainerDN(clientContainer, organisationContainer);
    ldapService.deleteEntry(clientContainer);

    objectService.setAdapterContainerDN(adapterContainer, organisationContainer);
    ldapService.deleteEntry(adapterContainer);

    ldapService.deleteEntry(organisationContainer);
  }
}
