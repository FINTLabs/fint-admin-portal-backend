package no.fint.adminportal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;
import org.springframework.ldap.support.LdapNameBuilder;

import javax.naming.Name;

@ApiModel
@Data
@Entry(objectClasses = {"organizationalUnit", "top"})
public class Container implements LdapEntry {

  @Id
  private Name dn;

  @ApiModelProperty(value = "This should be the name of the container.")
  @Attribute(name = "ou")
  private String ou;

  @Override
  public String getDn() {
    if (dn != null) {
      return dn.toString();
    } else {
      return null;
    }
  }

  @Override
  public void setDn(String dn) {
    this.dn = LdapNameBuilder.newInstance(dn).build();
  }

  @Override
  public void setDn(Name dn) {
    this.dn = dn;

  }

  @JsonIgnore
  @Override
  public String getUuid() {
    throw new UnsupportedOperationException("This method is not supported for Contact.");
  }

  @JsonIgnore
  @Override
  public void setUuid(String uuid) {
    throw new UnsupportedOperationException("This method is not supported for Contact.");
  }
}

