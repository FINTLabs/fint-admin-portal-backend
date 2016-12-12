package no.fint.adminportal;

import com.github.springfox.loader.EnableSpringfox;
import no.rogfk.hateoas.extension.annotations.EnableHalHypermediaSupport;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableHalHypermediaSupport
@EnableSpringfox
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
