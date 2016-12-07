package no.fint.adminportal.controller;


import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Component;
import no.fint.adminportal.model.Organization;
import no.fint.adminportal.service.ComponentService;
import no.fint.adminportal.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Slf4j
@RestController
//@Api(tags = "GuestUser")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/components")
public class ComponentController {

    @Autowired
    ComponentService componentService;

    //@ApiOperation("Request new guest user")
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public ResponseEntity createComponent(@ModelAttribute Component component) {
        log.info("Component: {}", component);

        boolean compCreated = componentService.createComponent(component);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{component}")
                .buildAndExpand(component.getTechnicalName()).toUri();

        if (compCreated) {
            return ResponseEntity.created(location).build();
        }
        else {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .body(location.toString());
        }
    }

    /*
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Organization>> getOrganizations() {
        return ResponseEntity.ok(organizationService.getOrganizations());
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{orgId:.+}")
    public ResponseEntity<Organization> getOrganization(@PathVariable String orgId) {
        return ResponseEntity.ok(organizationService.getOrganization(orgId));
    }
    */
}
