package no.fint.portal.admin.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import no.fint.portal.admin.ComponentConfigurationNotFound;
import no.fint.portal.model.ComponentConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@RestController
@Api(tags = "Component Configurations")
@CrossOrigin(origins = "*")
@RequestMapping(value = "/api/components/configurations")

public class ComponentConfigController {
    private final RestTemplate restTemplate;
    private final String rootUri;

    public ComponentConfigController(
            RestTemplate restTemplate,
            @Value("${fint.portal.admin.uri}") String rootUri) {
        this.restTemplate = restTemplate;
        this.rootUri = rootUri;
    }

    @GetMapping
    public ResponseEntity<List<ComponentConfiguration>> getComponentConfigurations() {
        List<ComponentConfiguration> componentConfigurationList = restTemplate
                .exchange(
                        rootUri + "/api/components/configurations",
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<ComponentConfiguration>>() {
                        }
                ).getBody();

        if (Objects.nonNull(componentConfigurationList)) {
            return ResponseEntity.ok(componentConfigurationList.stream()
                    .filter(ComponentConfiguration::isCore)
                    .collect(Collectors.toList()));
        }

        throw new ComponentConfigurationNotFound();
    }

    @ExceptionHandler(ComponentConfigurationNotFound.class)
    public ResponseEntity<Void> handleEntityNotFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
