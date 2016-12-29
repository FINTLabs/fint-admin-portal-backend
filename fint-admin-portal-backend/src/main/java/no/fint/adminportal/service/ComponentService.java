package no.fint.adminportal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.naming.directory.SearchControls;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ComponentService {

  @Autowired
  LdapService ldapService;

  @Autowired
  private DnService dnService;

  private SearchControls searchControls;

  @Value("${fint.ldap.component-base}")
  private String componentBase;

  public ComponentService() {
    searchControls = new SearchControls();
    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
  }

  public boolean createComponent(Component component) {
    log.info("Creating component: {}", component);

    if (component.getDn() == null) {
      dnService.setComponentInternals(component);
    }
    return ldapService.create(component);
  }

  public boolean updateComponent(Component component) {
    log.info("Updating component: {}", component);

    return ldapService.update(component);
  }

  public List<Component> getComponents() {
    return ldapService.getAll(componentBase, Component.class);
  }

  public Optional<Component> getComponentByTechnicalName(String technicalName) {
    Optional<String> stringDnById = Optional.ofNullable(ldapService.getStringDnById(technicalName, componentBase, Component.class));

    if (stringDnById.isPresent()) {
      return Optional.of(ldapService.getEntry(stringDnById.get(), Component.class));
    }
    return Optional.empty();
  }

  public Optional<Component> getComponentByUUID(String uuid) {
    String dn = dnService.getComponentDnByUUID(uuid);
    Optional<Component> component = Optional.ofNullable(ldapService.getEntry(dn, Component.class));

    return component;

  }

  public void deleteComponent(Component component) {
    ldapService.deleteEntry(component);
  }
}
