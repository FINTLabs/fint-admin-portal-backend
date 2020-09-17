package no.fint.portal.model;

import lombok.Data;

import java.util.List;

@Data
public class ApiService {
    private String collectionUrl;
    private List<String> oneUrl;
    private String cacheSizeUrl;
    private String lastUpdatedUrl;
}
