package no.fint.adminportal.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.fint.adminportal.model.LdapEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;

@Service
public class LdapService {

    @Autowired
    LdapTemplate ldapTemplate;

    public LdapService() {
    }

    public boolean create(LdapEntry ldapEntry) {
        try {
            ldapTemplate.lookup(ldapEntry.getDn());
            return false;
        } catch (org.springframework.ldap.NamingException e) {
            ldapTemplate.create(ldapEntry);
            return true;
        }
    }
}
