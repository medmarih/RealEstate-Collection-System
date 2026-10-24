package ma.omrane.recouvrement_prjt.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ma.omrane.recouvrement_prjt.dto.ImportResultDTO;
import ma.omrane.recouvrement_prjt.dto.ImportJobStatusDTO;
import ma.omrane.recouvrement_prjt.service.ExcelImportService;
import ma.omrane.recouvrement_prjt.service.ImportJobService;

/**
 * Réception du fichier Excel — branchez ici le parsing métier.
 */
@RestController
public class ImportController {
    private final ExcelImportService excelImportService;
    private final ImportJobService importJobService;

    public ImportController(ExcelImportService excelImportService, ImportJobService importJobService) {
        this.excelImportService = excelImportService;
        this.importJobService = importJobService;
    }

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImportResultDTO importFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Fichier requis");
        }
        return excelImportService.importFile(file);
    }

    @PostMapping(value = "/import/async", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImportJobStatusDTO importFileAsync(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Fichier requis");
        }
        return importJobService.startImport(file);
    }

    @GetMapping("/import/status/{jobId}")
    public ImportJobStatusDTO getImportStatus(@PathVariable String jobId) {
        return importJobService.getJobStatus(jobId);
    }
}
