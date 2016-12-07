package no.fint.adminportal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.LdapEntry;
import no.fint.adminportal.model.Organization;
import no.fint.adminportal.utilities.BaseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Service;

import javax.naming.InvalidNameException;
import javax.naming.Name;
import javax.naming.directory.SearchControls;

@Slf4j
@Service
public class ComponentService {

    @Autowired
    private LdapTemplate ldapTemplate;

    @Autowired
    LdapService ldapService;

    private SearchControls searchControls;

    @Value("${spring.ldap.base}")
    private String base;

    public ComponentService() {
        searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
    }

    public boolean createComponent(Component component) {
        log.info("Creating component: {}", component);

        Name dn = LdapNameBuilder.newInstance(
                String.format("ou=%s,%s", component.getTechnicalName(), BaseFactory.getComponentBase(base))
        ).build();
        component.setDn(dn);

        return ldapService.create(component);
    }
}
