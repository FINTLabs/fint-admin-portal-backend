package no.fint;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

@Configuration
public class ApplicationSecurity {

    @Bean
    public WebSecurityCustomizer configure() {
        return web -> web
                .ignoring()
                .antMatchers("/**");
    }
}