package ma.omrane.recouvrement_prjt.controller;

import ma.omrane.recouvrement_prjt.dto.RecouvrementDTO;
import ma.omrane.recouvrement_prjt.entity.Recouvrement;
import ma.omrane.recouvrement_prjt.service.RecouvrementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recouvrements")
public class RecouvrementController {

    private final RecouvrementService recouvrementService;

    public RecouvrementController(RecouvrementService recouvrementService) {
        this.recouvrementService = recouvrementService;
    }

    // 🔥 création
    @PostMapping("/{articleId}")
    public Recouvrement createRecouvrement(@PathVariable Long articleId) {
        return recouvrementService.createRecouvrement(articleId);
    }

    // 🔥 liste DTO
    @GetMapping
    public List<RecouvrementDTO> getAll() {
        return recouvrementService.findAll()
                .stream()
                .map(recouvrementService::toDTO)
                .toList();
    }

    // 🔥 recalcul statut
    @PutMapping("/{id}/calculer-statut")
    public Recouvrement calculerStatut(@PathVariable Long id) {
        return recouvrementService.calculerStatut(id);
    }

    /** Alias API front : même traitement que calculer-statut */
    @PutMapping("/{id}/corriger")
    public Recouvrement corriger(@PathVariable Long id) {
        return recouvrementService.calculerStatut(id);
    }

    // 🔥 reporting simple
    @GetMapping("/reporting")
    public Map<String, Long> reporting() {
        return recouvrementService.reporting();
    }

    // 🔥 reporting complet
    @GetMapping("/reporting-complet")
    public Map<String, Object> reportingComplet() {
        return recouvrementService.reportingComplet();
    }
}