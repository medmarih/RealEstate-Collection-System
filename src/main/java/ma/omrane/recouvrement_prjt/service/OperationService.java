package ma.omrane.recouvrement_prjt.service;

import ma.omrane.recouvrement_prjt.entity.Operation;
import ma.omrane.recouvrement_prjt.repository.OperationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {

    private final OperationRepository operationRepository;

    public OperationService(OperationRepository operationRepository) {
        this.operationRepository = operationRepository;
    }

    // 🔥 récupérer toutes les opérations
    public List<Operation> findAll() {
        return operationRepository.findAll();
    }

    // 🔥 créer ou modifier une opération
    public Operation save(Operation operation) {
        return operationRepository.save(operation);
    }

    // 🔥 récupérer par ID (IMPORTANT)
    public Operation findById(Long id) {
        return operationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opération non trouvée avec id: " + id));
    }

    // 🔥 supprimer (IMPORTANT)
    public void delete(Long id) {
        Operation op = findById(id);
        operationRepository.delete(op);
    }
}