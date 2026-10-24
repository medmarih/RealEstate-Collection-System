package ma.omrane.recouvrement_prjt.controller;

import ma.omrane.recouvrement_prjt.entity.Operation;
import ma.omrane.recouvrement_prjt.service.OperationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/operations")
public class OperationController {

    private final OperationService operationService;

    public OperationController(OperationService operationService) {
        this.operationService = operationService;
    }

    // 🔥 créer une opération
    @PostMapping
    public Operation createOperation(@RequestBody Operation operation) {
        return operationService.save(operation);
    }

    // 🔥 récupérer toutes les opérations
    @GetMapping
    public List<Operation> getAllOperations() {
        return operationService.findAll();
    }

    // 🔥 récupérer une opération par ID
    @GetMapping("/{id}")
    public Operation getOperationById(@PathVariable Long id) {
        return operationService.findById(id);
    }

    // 🔥 supprimer une opération
    @DeleteMapping("/{id}")
    public String deleteOperation(@PathVariable Long id) {
        operationService.delete(id);
        return "Opération supprimée avec succès";
    }
}