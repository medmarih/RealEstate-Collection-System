package ma.omrane.recouvrement_prjt.controller;

import ma.omrane.recouvrement_prjt.entity.ImportHistory;
import ma.omrane.recouvrement_prjt.repository.ImportHistoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/imports")
public class ImportHistoryController {
    private final ImportHistoryRepository importHistoryRepository;

    public ImportHistoryController(ImportHistoryRepository importHistoryRepository) {
        this.importHistoryRepository = importHistoryRepository;
    }

    @GetMapping
    public List<ImportHistory> getAllImports() {
        return importHistoryRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(ImportHistory::getImportDate).reversed())
                .toList();
    }
}
