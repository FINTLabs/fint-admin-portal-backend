package no.fint.adminportal.model;

import org.springframework.ldap.odm.annotations.Entry;

import javax.naming.Name;

@Entry(objectClasses = "")
public interface BasicLdapEntry {
  String getDn();

  void setDn(String dn);

  void setDn(Name dn);
}
