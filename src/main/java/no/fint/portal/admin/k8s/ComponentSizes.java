package no.fint.portal.admin.k8s;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Optional;


@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponentSizes {
    private Size small;
    private Size large;
    private Size medium;

    public Optional<Size> getSize(String size) {
        try {
            Method method = ComponentSizes.class.getMethod("get" + StringUtils.capitalize(size.toLowerCase()));
            return Optional.ofNullable((Size) method.invoke(this));
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException e) {
            log.error(e.getMessage());
        }
        return Optional.empty();
    }

    public static Optional<ComponentSizes> deserialize(String json) {
        if (StringUtils.hasText(json)) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                return Optional.ofNullable(objectMapper.readValue(json, ComponentSizes.class));
            } catch (JsonProcessingException e) {
                log.error(e.getMessage());
            }
        }
        return Optional.empty();
    }

    @Builder
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Size {
        private Resources request;
        private Resources limit;
    }

    @Builder
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Resources {
        private String memory;
        private String cpu;
    }
}