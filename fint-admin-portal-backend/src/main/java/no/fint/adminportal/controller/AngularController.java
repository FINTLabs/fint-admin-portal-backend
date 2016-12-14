package no.fint.adminportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by oystein.amundsen on 14.12.2016.
 */
@Controller
class AngularController {
    @RequestMapping({
        // Map all routes defined in our angular app
        "/",
        "/components",
        "/components/{id:\\w+}",
        "/organisations",
        "/organisations/{id:\\w+}",
        "/events",
    })
    public String index() {
        return "forward:/index.html";
    }
}
