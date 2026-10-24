package ma.omrane.recouvrement_prjt.controller;

import ma.omrane.recouvrement_prjt.service.RecouvrementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Expose {@code GET /reporting-complet} à la racine (contrat API front).
 */
@RestController
public class ReportingRootController {

    private final RecouvrementService recouvrementService;

    public ReportingRootController(RecouvrementService recouvrementService) {
        this.recouvrementService = recouvrementService;
    }

    @GetMapping("/reporting-complet")
    public Map<String, Object> reportingComplet() {
        return recouvrementService.reportingComplet();
    }
}
