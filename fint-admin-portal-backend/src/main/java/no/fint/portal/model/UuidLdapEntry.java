package no.fint.portal.model;

public interface UuidLdapEntry extends BasicLdapEntry {
  String getUuid();

  void setUuid(String uuid);
}
