package ma.omrane.recouvrement_prjt.service;

import ma.omrane.recouvrement_prjt.dto.ImportJobStatusDTO;
import ma.omrane.recouvrement_prjt.dto.ImportResultDTO;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ImportJobService {
    private final ExcelImportService excelImportService;
    private final Map<String, ImportJobStatusDTO> jobs = new ConcurrentHashMap<>();

    public ImportJobService(ExcelImportService excelImportService) {
        this.excelImportService = excelImportService;
    }

    public ImportJobStatusDTO startImport(MultipartFile file) {
        String jobId = UUID.randomUUID().toString();
        ImportJobStatusDTO job = new ImportJobStatusDTO();
        job.setJobId(jobId);
        job.setStatus("RUNNING");
        job.setProgress(5);
        job.setMessage("Import en cours");
        jobs.put(jobId, job);
        runImport(jobId, file);
        return job;
    }

    public ImportJobStatusDTO getJobStatus(String jobId) {
        ImportJobStatusDTO status = jobs.get(jobId);
        if (status == null) {
            ImportJobStatusDTO notFound = new ImportJobStatusDTO();
            notFound.setJobId(jobId);
            notFound.setStatus("NOT_FOUND");
            notFound.setProgress(0);
            notFound.setMessage("Job introuvable");
            return notFound;
        }
        return status;
    }

    @Async("importTaskExecutor")
    public void runImport(String jobId, MultipartFile file) {
        ImportJobStatusDTO job = jobs.get(jobId);
        if (job == null) return;
        try {
            job.setProgress(20);
            ImportResultDTO result = excelImportService.importFile(file);
            job.setResult(result);
            job.setProgress(100);
            job.setStatus("SUCCESS");
            job.setMessage("Import termine");
        } catch (Exception e) {
            job.setStatus("FAILED");
            job.setProgress(100);
            job.setMessage(e.getMessage());
        }
    }
}
