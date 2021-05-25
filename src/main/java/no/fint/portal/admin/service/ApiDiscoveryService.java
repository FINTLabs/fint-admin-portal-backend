package no.fint.portal.admin.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.ApiService;
import no.fint.portal.model.ComponentClass;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ApiDiscoveryService {

    private final RestTemplate restTemplate;
    private final String baseUri;

    public ApiDiscoveryService(
            RestTemplate restTemplate,
            @Value("${fint.admin.api.base:}") String baseUri) {
        this.restTemplate = restTemplate;
        this.baseUri = baseUri;
    }

    @Cacheable("apiServices")
    public List<ComponentClass> getClassesFromComponent(String componentName, String componentPath) {
        try {
            String uri = runsInCluster()
                    ? getInClusterUri(componentName, componentPath)
                    : baseUri + componentPath;

            return restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Map<String, ApiService>>() {
                    }
            )
                    .getBody()
                    .values()
                    .stream()
                    .map(ApiService::getCollectionUrl)
                    .map(UriComponentsBuilder::fromHttpUrl)
                    .map(UriComponentsBuilder::build)
                    .map(UriComponents::getPath)
                    .map(c -> new ComponentClass(StringUtils.substringAfterLast(c, "/"), c))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private boolean runsInCluster() {
        return StringUtils.isBlank(baseUri);
    }

    private String getInClusterUri(String componentName, String componentPath) {
        return "http://consumer-" + componentName + ":8080" + componentPath;
    }


}
