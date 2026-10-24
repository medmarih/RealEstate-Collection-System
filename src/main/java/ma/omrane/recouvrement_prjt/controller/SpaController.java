package ma.omrane.recouvrement_prjt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Sert l’application React (history mode) : renvoie {@code index.html} pour les
 * chemins UI. Les appels API passent par {@code /api/...}.
 */
@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/auth",
            "/dashboard",
            "/echeanciers",
            "/import",
            "/operations",
            "/articles",
            "/clients",
            "/login"
    })
    public String spaEntryPoints() {
        return "forward:/index.html";
    }

    @GetMapping("/recouvrements/**")
    public String spaRecouvrements() {
        return "forward:/index.html";
    }
}
