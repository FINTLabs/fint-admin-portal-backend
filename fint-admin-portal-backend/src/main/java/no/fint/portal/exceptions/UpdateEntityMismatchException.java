package no.fint.portal.exceptions;

@SuppressWarnings("ALL")
public class UpdateEntityMismatchException extends RuntimeException {
  public UpdateEntityMismatchException(String message) {
    super(message);
  }
}
