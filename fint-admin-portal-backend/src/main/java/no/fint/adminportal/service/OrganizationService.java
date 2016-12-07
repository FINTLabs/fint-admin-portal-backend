package no.fint.adminportal.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Organization;
import no.fint.adminportal.utilities.BaseFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Service;

import javax.naming.Name;
import javax.naming.directory.SearchControls;
import java.util.List;

@Slf4j
@Service
public class OrganizationService {

    @Autowired
    private LdapTemplate ldapTemplate;

    @Autowired
    private LdapService ldapService;

    private SearchControls searchControls;

    @Value("${spring.ldap.base}")
    private String base;

    public OrganizationService() {
        searchControls = new SearchControls();
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
    }

    public boolean createOrganization(Organization organization) {
        log.info("Creating organization: {}", organization);

        String ou = organization.getOrgId().replace(".", "_");
        Name dn = LdapNameBuilder.newInstance(String.format("ou=%s,%s", ou, BaseFactory.getOrganizationBase(base))).build();
        organization.setDn(dn);

        return ldapService.create(organization);
    }

    public List<Organization> getOrganizations() {
        Name orgBase = LdapNameBuilder.newInstance(BaseFactory.getOrganizationBase(base)).build();
        return ldapTemplate.findAll(orgBase, searchControls, Organization.class);
    }

    public Organization getOrganization(String orgId) {
        String dnString = String.format("ou=%s,%s", orgId.replace(".", "_"), BaseFactory.getOrganizationBase(base));
        Name dn = LdapNameBuilder.newInstance(dnString).build();

        return ldapTemplate.lookup(dn, (AttributesMapper<Organization>) attributes -> {
            Organization organization = new Organization();
            organization.setDisplayName(attributes.get("fintOrgDisplayName").get().toString());
            organization.setOrgId(attributes.get("fintOrgId").get().toString());
            organization.setOrgNumber(attributes.get("fintOrgNumber").get().toString());

            return organization;
        });
    }
}
