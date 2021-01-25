package no.fint.portal.admin.service;

public class InvalidResourceException extends RuntimeException {
  public InvalidResourceException(String message) {
    super(message);
  }
}
