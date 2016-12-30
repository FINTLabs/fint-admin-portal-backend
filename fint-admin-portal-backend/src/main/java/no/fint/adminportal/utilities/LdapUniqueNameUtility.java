package no.fint.adminportal.utilities;

import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.Contact;
import no.fint.adminportal.model.Organisation;

public enum LdapUniqueNameUtility {
  ;

  public static <T> String getUniqueNameAttribute(Class<T> type) {

    if (type.getName().equals(Organisation.class.getName())) {
      return "fintOrgId";
    }

    if (type.getName().equals(Component.class.getName())) {
      return "fintCompTechnicalName";
    }

    if (type.getName().equals(Contact.class.getName())) {
      return "cn";
    }

    return null;
  }
}
