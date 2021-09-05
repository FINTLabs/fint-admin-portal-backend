package no.fint.portal.admin.k8s.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

@Slf4j
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComponentConfiguration {
    private String image;
    private String environment;
    private ComponentSizes sizes;
    private List<String> cacheDisabledFor;

    public static Optional<List<ComponentConfiguration>> deserialize(String json) {
        if (StringUtils.hasText(json)) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                return Optional.ofNullable(objectMapper.readValue(json, new TypeReference<>() {
                }));
            } catch (JsonProcessingException e) {
                log.error(e.getMessage());
            }
        }
        return Optional.empty();
    }
}