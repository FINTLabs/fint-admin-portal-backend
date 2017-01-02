package no.fint.portal.model;

import org.springframework.ldap.odm.annotations.Entry;

import javax.naming.Name;

@Entry(objectClasses = "")
public interface BasicLdapEntry {
  String getDn();

  void setDn(Name dn);

  void setDn(String dn);
}
