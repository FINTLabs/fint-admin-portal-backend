package no.fint.portal.admin.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.LdapServiceRetryDecorator;
import no.fint.portal.admin.service.ApiDiscoveryService;
import no.fint.portal.exceptions.EntityFoundException;
import no.fint.portal.exceptions.EntityNotFoundException;
import no.fint.portal.exceptions.UpdateEntityMismatchException;
import no.fint.portal.model.ComponentConfiguration;
import no.fint.portal.model.ErrorResponse;
import no.fint.portal.model.asset.Asset;
import no.fint.portal.model.component.Component;
import no.fint.portal.model.component.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ldap.NameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.UnknownHostException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@Api(tags = "Components")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/components")
public class ComponentController {

    @Autowired
    private ComponentService componentService;

    @Autowired
    private LdapServiceRetryDecorator ldapServiceRetryDecorator;

    @Autowired
    private ApiDiscoveryService apiDiscoveryService;

    @ApiOperation("Create new component")
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
                        .buildAndExpand(component.getName()).toUri().toString()
        );
    }

    @ApiOperation("Update component")
    @RequestMapping(value = "/{name}",
            method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_UTF8_VALUE
    )
    public ResponseEntity updateComponent(@RequestBody final Component component, @PathVariable final String name) {
        log.info("Component: {}", component);

        if (!name.equals(component.getName())) {
            throw new UpdateEntityMismatchException(
                    String.format("Trying to updateEntry component %s on endpoint for component %s.", component.getName(), name)
            );
        }

        if (!componentService.updateComponent(component)) {
            throw new EntityNotFoundException(String.format("Could not find component: %s", component));
        }

        return ResponseEntity.ok(component);
    }

    @ApiOperation("Get all components")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity getComponents() {
        List<Component> components = ldapServiceRetryDecorator.getComponents();
        if (components == null)
            components = Collections.emptyList();
        return ResponseEntity.ok(components);
    }

    @ApiOperation("Get compontent configurations")
    @GetMapping("/configurations")
    public ResponseEntity<List<ComponentConfiguration>> getComponentConfigurations() throws NoSuchMethodException {
        List<Component> components = ldapServiceRetryDecorator.getComponents();
        if (Objects.isNull(components) || components.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        ControllerLinkBuilder builder = ControllerLinkBuilder.linkTo(getClass()).slash("assets");
        return ResponseEntity.ok(components
                .stream()
                .map(c -> ComponentConfiguration
                        .builder()
                        .name(c.getName().replace("_", "-"))
                        .dn(c.getDn())
                        .displayName(c.getDescription())
                        .core(c.isCore())
                        .path(c.getBasePath())
                        .assetPath(builder.slash(c.getName()).toUri().getPath())
                        .classes(apiDiscoveryService.getClassesFromComponent(c.getName().replace("_", "-"), c.getBasePath()))
                        .isInBeta(c.isInBeta())
                        .isInProduction(c.isInProduction())
                        .isInPlayWithFint(c.isInPlayWithFint())
                        .build()
                )
                .collect(Collectors.toList()));
    }

    @ApiOperation("Get component by name")
    @RequestMapping(method = RequestMethod.GET, value = "/{name}")
    public ResponseEntity getComponent(@PathVariable String name) {
        Optional<Component> component = componentService.getComponentByName(name);

        if (component.isPresent()) {
            return ResponseEntity.ok(component.get());
        }

        throw new EntityNotFoundException(
                String.format("Component with name %s could not be found", name)
        );
    }

    @ApiOperation("Delete component")
    @RequestMapping(method = RequestMethod.DELETE, value = "/{name}")
    public ResponseEntity deleteComponent(@PathVariable final String name) {
        Optional<Component> component = componentService.getComponentByName(name);

        if (component.isPresent()) {
            componentService.deleteComponent(component.get());
            return ResponseEntity.accepted().build();
        }

        throw new EntityNotFoundException(
                String.format("Component %s not found", name)
        );
    }

    @GetMapping("/assets/{name}")
    public ResponseEntity<List<String>> getActiveAssetsForComponent(@PathVariable final String name) {
        Optional<Component> component = componentService.getComponentByName(name);

        Component c = component.orElseThrow(() -> new EntityNotFoundException("Component " + name + " not found"));


        return ResponseEntity.ok(componentService.getActiveAssetsForComponent(c).stream().map(Asset::getAssetId).collect(Collectors.toList()));
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

    @ExceptionHandler(NameNotFoundException.class)
    public ResponseEntity handleNameNotFound(Exception e) {
        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
    }

    @ExceptionHandler(UnknownHostException.class)
    public ResponseEntity handleUnkownHost(Exception e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(new ErrorResponse(e.getMessage()));
    }
}
