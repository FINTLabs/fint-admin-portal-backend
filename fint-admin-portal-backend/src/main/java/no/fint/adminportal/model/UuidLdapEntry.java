package no.fint.adminportal.model;

public interface UuidLdapEntry extends BasicLdapEntry {
  String getUuid();

  void setUuid(String uuid);
}
