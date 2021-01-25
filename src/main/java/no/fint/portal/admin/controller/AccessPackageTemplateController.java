package no.fint.portal.admin.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.admin.service.LdapServiceRetryDecorator;
import no.fint.portal.exceptions.CreateEntityMismatchException;
import no.fint.portal.exceptions.EntityNotFoundException;
import no.fint.portal.exceptions.UpdateEntityMismatchException;
import no.fint.portal.model.access.AccessPackage;
import no.fint.portal.model.access.AccessPackageTemplateService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Api(tags = "Access package template")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/accesspackage/template")
public class AccessPackageTemplateController {

    private final AccessPackageTemplateService acccessPackageTemplateService;

    private final LdapServiceRetryDecorator ldapServiceRetryDecorator;

    public AccessPackageTemplateController(AccessPackageTemplateService acccessPackageTemplateService, LdapServiceRetryDecorator ldapServiceRetryDecorator) {
        this.acccessPackageTemplateService = acccessPackageTemplateService;
        this.ldapServiceRetryDecorator = ldapServiceRetryDecorator;
    }


    @ApiOperation("Get all access package template")
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<AccessPackage>> getAccessPackageTemplates() {
        return ResponseEntity.ok(ldapServiceRetryDecorator.getAccessPackageTemplates());
    }

    @ApiOperation("Add new access template")
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE

    )
    public ResponseEntity<AccessPackage> addAccessTemplate(@RequestBody final AccessPackage accessPackageTemplate) {
        log.trace("Access package template: {}", accessPackageTemplate);

        if (!acccessPackageTemplateService.addAccessPackageTemplate(accessPackageTemplate)) {
            throw new CreateEntityMismatchException(accessPackageTemplate.getName());

        }
        return ResponseEntity.status(HttpStatus.CREATED).body(accessPackageTemplate);
    }

    @ApiOperation("Update Access Package Template")
    @PutMapping("/{accessId}")
    public ResponseEntity<AccessPackage> updateAccessTemplate(@PathVariable String accessId,
                                                              @RequestBody AccessPackage accessPackage) {

        if (!accessId.equals(accessPackage.getName())) throw new UpdateEntityMismatchException(accessId);
        AccessPackage original = acccessPackageTemplateService.getAccessPackageTemplate(accessId);

        if (accessPackage.getComponents() != null) {
            original.setComponents(accessPackage.getComponents());
        }
        if (accessPackage.getClients() != null) {
            original.setClients(accessPackage.getClients());
        }
        if (accessPackage.getCollection() != null) {
            original.setCollection(accessPackage.getCollection());
        }
        if (accessPackage.getModify() != null) {
            original.setModify(accessPackage.getModify());
        }
        if (accessPackage.getRead() != null) {
            original.setRead(accessPackage.getRead());
        }

        if (!acccessPackageTemplateService.updateAccessPackageTemplate(original))
            throw new UpdateEntityMismatchException(accessId);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(accessPackage);
    }

    @ApiOperation("Delete access package template")
    @RequestMapping(method = RequestMethod.DELETE, value = "/{accessPackageTemplateName}")
    public ResponseEntity<Void> deleteAccessTemplate(@PathVariable final String accessPackageTemplateName) {
        AccessPackage accessPackageTemplate = acccessPackageTemplateService.getAccessPackageTemplate(accessPackageTemplateName);

        if (accessPackageTemplate != null) {
            acccessPackageTemplateService.removeAccessPackageTemplate(accessPackageTemplate);
            return ResponseEntity.accepted().build();
        }

        throw new EntityNotFoundException(
                String.format("AccessPackageTemplate %s not found", accessPackageTemplateName)
        );
    }
}
