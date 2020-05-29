package no.fint.portal.admin.service;

import lombok.extern.slf4j.Slf4j;
import no.fint.portal.model.ApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpStatusCodeException;
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
    public List<String> getClassesForComponent(String componentName, String componentPath) {
        try {
            String uri = StringUtils.isEmpty(baseUri)
                    ? "http://consumer-" + componentName + ":8080" + componentPath
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
                    .collect(Collectors.toList());
        } catch (HttpStatusCodeException e) {
            return Collections.emptyList();
        }
    }


}
