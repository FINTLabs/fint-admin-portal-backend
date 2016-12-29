package no.fint.adminportal.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.exceptions.EntityFoundException;
import no.fint.adminportal.exceptions.EntityNotFoundException;
import no.fint.adminportal.exceptions.UpdateEntityMismatchException;
import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.ErrorResponse;
import no.fint.adminportal.service.ComponentService;
import no.rogfk.hateoas.extension.HalPagedResources;
import no.rogfk.hateoas.extension.annotations.HalResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Optional;

@Slf4j
@RestController
@Api(tags = "Components")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/components")
public class ComponentController {

  @Autowired
  ComponentService componentService;

  @ApiOperation("Request new component")
  @RequestMapping(method = RequestMethod.POST,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE

  )
  public ResponseEntity createComponent(@RequestBody final Component component) {
    log.info("Component: {}", component);

    if (componentService.createComponent(component)) {
      return ResponseEntity.status(HttpStatus.CREATED).body(component);
    }

    throw new EntityFoundException(
      ServletUriComponentsBuilder
        .fromCurrentRequest().path("/{uuid}")
        .buildAndExpand(component.getUuid()).toUri().toString()
    );
  }

  @ApiOperation("Update component")
  @RequestMapping(value = "/{uuid}",
    method = RequestMethod.PUT,
    consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
  )
  public ResponseEntity updateComponent(@RequestBody final Component component, @PathVariable final String uuid) {
    log.info("Component: {}", component);

    if (!uuid.equals(component.getUuid())) {
      throw new UpdateEntityMismatchException(
        String.format("Trying to update component %s on endpoint for component %s.", component.getUuid(), uuid)
      );
    }

    if (!componentService.updateComponent(component)) {
      throw new EntityNotFoundException(String.format("Could not find component: %s", component));
    }

    return ResponseEntity.ok(component);
  }

  @ApiOperation("Get all components")
  @HalResource(pageSize = 10)
  @RequestMapping(method = RequestMethod.GET)
  public HalPagedResources<Component> getComponents(@RequestParam(required = false) Integer page) {
    return new HalPagedResources<>(componentService.getComponents(), page);
  }

  @ApiOperation("Get component by uuid")
  @RequestMapping(method = RequestMethod.GET, value = "/{uuid}")
  public ResponseEntity getComponent(@PathVariable String uuid) {
    Optional<Component> component = componentService.getComponentByUUID(uuid);

    if (component.isPresent()) {
      return ResponseEntity.ok(component.get());
    }

    throw new EntityNotFoundException(
      String.format("Component with uuid %s could not be found", uuid)
    );
  }

  @ApiOperation("Delete an organisation contact")
  @RequestMapping(method = RequestMethod.DELETE, value = "/{uuid}")
  public ResponseEntity deleteOrganizationContacts(@PathVariable final String uuid) {
    Optional<Component> component = componentService.getComponentByUUID(uuid);

    if (component.isPresent()) {
      componentService.deleteComponent(component.get());
      return ResponseEntity.accepted().build();
    }

    throw new EntityNotFoundException(
      String.format("Component %s not found", uuid)
    );
  }

  //
  // Exception handlers
  //
  @ExceptionHandler(UpdateEntityMismatchException.class)
  public ResponseEntity handleUpdateEntityMismatch(Exception e) {
    return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity handleEntityNotFound(Exception e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler(EntityFoundException.class)
  public ResponseEntity handleEntityFound(Exception e) {
    return ResponseEntity.status(HttpStatus.FOUND).body(new ErrorResponse(e.getMessage()));
  }

}
