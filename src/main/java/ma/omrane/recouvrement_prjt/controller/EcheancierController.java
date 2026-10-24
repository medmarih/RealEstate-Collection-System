package ma.omrane.recouvrement_prjt.controller;

import jakarta.validation.Valid;
import ma.omrane.recouvrement_prjt.entity.Echeancier;
import ma.omrane.recouvrement_prjt.service.EcheancierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/echeanciers")
public class EcheancierController {

    private final EcheancierService echeancierService;

    public EcheancierController(EcheancierService echeancierService) {
        this.echeancierService = echeancierService;
    }

    @PostMapping("/{recouvrementId}")
    public Echeancier create(@Valid @RequestBody Echeancier e,
                             @PathVariable Long recouvrementId) {

        return echeancierService.create(e, recouvrementId);
    }

    @GetMapping
    public List<Echeancier> getAll() {
        return echeancierService.findAll();
    }
}