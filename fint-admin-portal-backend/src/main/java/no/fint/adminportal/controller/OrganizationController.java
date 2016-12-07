package no.fint.adminportal.controller;


import lombok.extern.slf4j.Slf4j;
import no.fint.adminportal.model.Organization;
import no.fint.adminportal.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
//@Api(tags = "GuestUser")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/organizations")
public class OrganizationController {

    @Autowired
    OrganizationService organizationService;

    //@ApiOperation("Request new guest user")
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public ResponseEntity createOrganization(@ModelAttribute Organization organization) {
        log.info("Organization: {}", organization);

        boolean orgCreated = organizationService.createOrganization(organization);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{orgId}")
                .buildAndExpand(organization.getOrgId()).toUri();

        if (orgCreated) {
            return ResponseEntity.created(location).build();
        }
        else {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .body(location.toString());
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Organization>> getOrganizations() {
        return ResponseEntity.ok(organizationService.getOrganizations());
    }

    @RequestMapping(method = RequestMethod.GET, value = "/{orgId:.+}")
    public ResponseEntity<Organization> getOrganization(@PathVariable String orgId) {
        return ResponseEntity.ok(organizationService.getOrganization(orgId));
    }
}
