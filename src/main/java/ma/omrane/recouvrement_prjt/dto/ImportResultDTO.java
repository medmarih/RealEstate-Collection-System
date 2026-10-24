package ma.omrane.recouvrement_prjt.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportResultDTO {
    private String fileName;
    private int total;
    private int success;
    private int failed;
    private final List<String> warnings = new ArrayList<>();
    private final List<RowErrorDTO> errors = new ArrayList<>();
    private final List<AnomalyDTO> anomalies = new ArrayList<>();
    private final List<CorrectionDTO> corrections = new ArrayList<>();

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getSuccess() {
        return success;
    }

    public void setSuccess(int success) {
        this.success = success;
    }

    public int getFailed() {
        return failed;
    }

    public void setFailed(int failed) {
        this.failed = failed;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public List<RowErrorDTO> getErrors() {
        return errors;
    }

    public List<AnomalyDTO> getAnomalies() {
        return anomalies;
    }

    public List<CorrectionDTO> getCorrections() {
        return corrections;
    }

    public static class RowErrorDTO {
        private int row;
        private String message;

        public RowErrorDTO() {
        }

        public RowErrorDTO(int row, String message) {
            this.row = row;
            this.message = message;
        }

        public int getRow() {
            return row;
        }

        public void setRow(int row) {
            this.row = row;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class AnomalyDTO {
        private int row;
        private String flag;
        private String message;

        public AnomalyDTO() {
        }

        public AnomalyDTO(int row, String flag, String message) {
            this.row = row;
            this.flag = flag;
            this.message = message;
        }

        public int getRow() {
            return row;
        }

        public void setRow(int row) {
            this.row = row;
        }

        public String getFlag() {
            return flag;
        }

        public void setFlag(String flag) {
            this.flag = flag;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class CorrectionDTO {
        private int row;
        private String field;
        private String original;
        private String corrected;

        public CorrectionDTO() {
        }

        public CorrectionDTO(int row, String field, String original, String corrected) {
            this.row = row;
            this.field = field;
            this.original = original;
            this.corrected = corrected;
        }

        public int getRow() {
            return row;
        }

        public void setRow(int row) {
            this.row = row;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getOriginal() {
            return original;
        }

        public void setOriginal(String original) {
            this.original = original;
        }

        public String getCorrected() {
            return corrected;
        }

        public void setCorrected(String corrected) {
            this.corrected = corrected;
        }
    }
}
