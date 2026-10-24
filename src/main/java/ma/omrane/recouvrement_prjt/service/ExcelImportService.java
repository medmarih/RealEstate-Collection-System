package ma.omrane.recouvrement_prjt.service;

import ma.omrane.recouvrement_prjt.dto.ImportResultDTO;
import ma.omrane.recouvrement_prjt.entity.*;
import ma.omrane.recouvrement_prjt.repository.ArticleRepository;
import ma.omrane.recouvrement_prjt.repository.ClientRepository;
import ma.omrane.recouvrement_prjt.repository.ImportHistoryRepository;
import ma.omrane.recouvrement_prjt.repository.OperationRepository;
import ma.omrane.recouvrement_prjt.repository.RecouvrementRepository;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.text.Normalizer;

@Service
public class ExcelImportService {
    private final OperationRepository operationRepository;
    private final ClientRepository clientRepository;
    private final ArticleRepository articleRepository;
    private final RecouvrementRepository recouvrementRepository;
    private final ImportHistoryRepository importHistoryRepository;

    public ExcelImportService(OperationRepository operationRepository,
                              ClientRepository clientRepository,
                              ArticleRepository articleRepository,
                              RecouvrementRepository recouvrementRepository,
                              ImportHistoryRepository importHistoryRepository) {
        this.operationRepository = operationRepository;
        this.clientRepository = clientRepository;
        this.articleRepository = articleRepository;
        this.recouvrementRepository = recouvrementRepository;
        this.importHistoryRepository = importHistoryRepository;
    }

    @Transactional
    public ImportResultDTO importFile(MultipartFile file) {
        ImportResultDTO result = new ImportResultDTO();
        result.setFileName(file.getOriginalFilename());
        Map<String, Operation> operationCache = new HashMap<>();
        Map<String, Client> clientCache = new HashMap<>();
        Map<String, Article> articleCache = new HashMap<>();

        String fileName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
        if (fileName.endsWith(".csv")) {
            importCsv(file, result, operationCache, clientCache, articleCache);
            saveImportHistory(result);
            return result;
        }

        try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() <= 1) {
                result.getWarnings().add("Fichier vide ou sans lignes de donnees.");
                return result;
            }

            DataFormatter formatter = new DataFormatter();
            Map<String, Integer> headerMap = buildHeaderMap(sheet.getRow(0), formatter);

            for (int rowIdx = 1; rowIdx <= sheet.getLastRowNum(); rowIdx++) {
                Row row = sheet.getRow(rowIdx);
                if (row == null || isRowEmpty(row, formatter)) {
                    continue;
                }

                result.setTotal(result.getTotal() + 1);
                try {
                    Operation operation = upsertOperation(row, headerMap, formatter, rowIdx + 1, result, operationCache);
                    Client client = upsertClient(row, headerMap, formatter, rowIdx + 1, result, clientCache);
                    Article article = upsertArticle(row, headerMap, formatter, operation, client, rowIdx + 1, result, articleCache);
                    validateBusinessRules(rowIdx + 1, row, headerMap, formatter, article, result);
                    upsertRecouvrement(row, headerMap, formatter, article, rowIdx + 1, result);
                    result.setSuccess(result.getSuccess() + 1);
                } catch (Exception e) {
                    result.setFailed(result.getFailed() + 1);
                    result.getErrors().add(new ImportResultDTO.RowErrorDTO(rowIdx + 1, e.getMessage()));
                }
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Impossible de lire le fichier Excel: " + e.getMessage(), e);
        }

        saveImportHistory(result);
        return result;
    }

    private void importCsv(MultipartFile file,
                           ImportResultDTO result,
                           Map<String, Operation> operationCache,
                           Map<String, Client> clientCache,
                           Map<String, Article> articleCache) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.isBlank()) {
                result.getWarnings().add("CSV vide.");
                return;
            }
            char delimiter = headerLine.contains(";") ? ';' : ',';
            String[] rawHeaders = splitCsvLine(headerLine, delimiter);
            String[] headers = Arrays.stream(rawHeaders).map(this::canonicalHeader).toArray(String[]::new);

            String line;
            int rowNumber = 1;
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                if (line.trim().isEmpty()) continue;
                result.setTotal(result.getTotal() + 1);
                try {
                    Map<String, String> values = buildRowMap(headers, splitCsvLine(line, delimiter));
                    Operation operation = upsertOperationFromMap(values, rowNumber, result, operationCache);
                    Client client = upsertClientFromMap(values, rowNumber, result, clientCache);
                    Article article = upsertArticleFromMap(values, operation, client, rowNumber, result, articleCache);
                    validateBusinessRulesFromMap(rowNumber, values, article, result);
                    upsertRecouvrementFromMap(values, article, rowNumber, result);
                    result.setSuccess(result.getSuccess() + 1);
                } catch (Exception e) {
                    result.setFailed(result.getFailed() + 1);
                    result.getErrors().add(new ImportResultDTO.RowErrorDTO(rowNumber, e.getMessage()));
                }
            }
        } catch (IOException e) {
            throw new IllegalArgumentException("Impossible de lire le fichier CSV: " + e.getMessage(), e);
        }
    }

    private Operation upsertOperation(Row row,
                                      Map<String, Integer> headerMap,
                                      DataFormatter formatter,
                                      int rowNumber,
                                      ImportResultDTO result,
                                      Map<String, Operation> operationCache) {
        String libelle = cleanText(getText(row, headerMap, formatter, "operation_libelle"));
        if (libelle.isBlank()) {
            throw new IllegalArgumentException("operation_libelle est obligatoire");
        }
        String division = cleanText(getText(row, headerMap, formatter, "operation_division"));
        String operationKey = (libelle + "|" + division).toLowerCase(Locale.ROOT);
        if (operationCache.containsKey(operationKey)) {
            return operationCache.get(operationKey);
        }
        Optional<Operation> existing = operationRepository.findByLibelleAndDivision(libelle, division);
        Operation operation = existing.orElseGet(Operation::new);
        operation.setLibelle(libelle);
        operation.setDivision(division);

        String site = cleanText(getText(row, headerMap, formatter, "operation_site"));
        if (!site.isBlank()) {
            try {
                String normalizedSite = site.toUpperCase(Locale.ROOT);
                if (!normalizedSite.equals(site)) {
                    result.getCorrections().add(new ImportResultDTO.CorrectionDTO(
                            rowNumber, "operation_site", site, normalizedSite
                    ));
                }
                operation.setSite(Site.valueOf(normalizedSite));
            } catch (IllegalArgumentException ignored) {
                // Le site reste inchange si la valeur n'est pas valide
                result.getWarnings().add("Ligne " + rowNumber + ": operation_site inconnu (" + site + ").");
            }
        }
        Operation saved = operationRepository.save(operation);
        operationCache.put(operationKey, saved);
        return saved;
    }

    private Client upsertClient(Row row,
                                Map<String, Integer> headerMap,
                                DataFormatter formatter,
                                int rowNumber,
                                ImportResultDTO result,
                                Map<String, Client> clientCache) {
        String cin = cleanText(getText(row, headerMap, formatter, "client_cin"));
        String nom = cleanName(getText(row, headerMap, formatter, "client_nom"));
        String prenom = cleanName(getText(row, headerMap, formatter, "client_prenom"));
        String telephone = cleanText(getText(row, headerMap, formatter, "client_telephone"));
        String adresse = cleanText(getText(row, headerMap, formatter, "client_adresse"));
        String ville = cleanName(getText(row, headerMap, formatter, "client_ville"));
        String clientKey = (cin.isBlank() ? nom + "|" + prenom + "|" + telephone : cin).toLowerCase(Locale.ROOT);
        if (clientCache.containsKey(clientKey)) {
            return clientCache.get(clientKey);
        }

        Client client = cin.isBlank()
                ? new Client()
                : clientRepository.findByCin(cin).orElseGet(Client::new);

        client.setCin(cin.isBlank() ? null : cin);
        client.setNom(nom);
        client.setPrenom(prenom);
        client.setNumeroTel(telephone);
        client.setAdresse(adresse);
        client.setVille(ville);
        addCorrectionIfChanged(rowNumber, "client_nom", getText(row, headerMap, formatter, "client_nom"), nom, result);
        addCorrectionIfChanged(rowNumber, "client_prenom", getText(row, headerMap, formatter, "client_prenom"), prenom, result);
        addCorrectionIfChanged(rowNumber, "client_ville", getText(row, headerMap, formatter, "client_ville"), ville, result);

        Client saved = clientRepository.save(client);
        clientCache.put(clientKey, saved);
        return saved;
    }

    private Article upsertArticle(Row row,
                                  Map<String, Integer> headerMap,
                                  DataFormatter formatter,
                                  Operation operation,
                                  Client client,
                                  int rowNumber,
                                  ImportResultDTO result,
                                  Map<String, Article> articleCache) {
        String idProduit = cleanText(getText(row, headerMap, formatter, "article_id_produit"));
        String numeroIndividuel = cleanText(getText(row, headerMap, formatter, "article_numero_individuel"));
        String articleKey = (idProduit + "|" + numeroIndividuel).toLowerCase(Locale.ROOT);
        if (articleCache.containsKey(articleKey)) {
            return articleCache.get(articleKey);
        }

        Article article = null;
        if (!idProduit.isBlank()) {
            article = articleRepository.findByIdProduit(idProduit).orElse(null);
        }
        if (article == null && !numeroIndividuel.isBlank()) {
            article = articleRepository.findByNumeroIndividuel(numeroIndividuel).orElse(null);
        }
        if (article == null) {
            article = new Article();
        }

        article.setIdProduit(idProduit);
        article.setTypologie(cleanText(getText(row, headerMap, formatter, "article_typologie")));
        article.setSuperficieProvisoire(getDouble(row, headerMap, formatter, "article_superficie_provisoire"));
        article.setSuperficieCadastrale(getDouble(row, headerMap, formatter, "article_superficie_cadastrale"));
        article.setNumeroTitreMere(cleanText(getText(row, headerMap, formatter, "article_numero_titre_mere")));
        article.setNumeroIndividuel(numeroIndividuel);
        double prix = getDouble(row, headerMap, formatter, "article_prix_cession");
        if (prix == 0.0) {
            prix = getDouble(row, headerMap, formatter, "prix_cession");
        }
        article.setPrixCession(prix);
        article.setOperation(operation);
        article.setClient(client);
        Article saved = articleRepository.save(article);
        articleCache.put(articleKey, saved);
        return saved;
    }

    private void upsertRecouvrement(Row row,
                                    Map<String, Integer> headerMap,
                                    DataFormatter formatter,
                                    Article article,
                                    int rowNumber,
                                    ImportResultDTO result) {
        Recouvrement recouvrement = recouvrementRepository.findByArticle_IdArticle(article.getIdArticle())
                .orElseGet(Recouvrement::new);

        double total = article.getPrixCession() == null ? 0.0 : article.getPrixCession();
        double paye = getDouble(row, headerMap, formatter, "recouvrement_montant_paye");
        if (paye == 0.0) {
            paye = getDouble(row, headerMap, formatter, "montant");
        }
        recouvrement.setArticle(article);
        recouvrement.setMontantTotal(total);
        recouvrement.setMontantPaye(paye);
        recouvrement.setMontantRestant(Math.max(0, total - paye));

        String statut = normalizeStatus(getText(row, headerMap, formatter, "recouvrement_statut"));
        if (statut.isBlank()) {
            recouvrement.setStatut(recouvrement.getMontantRestant() <= 0 ? "SOLDE" : "EN_COURS");
        } else {
            recouvrement.setStatut(statut);
        }
        if (paye > total) {
            result.getAnomalies().add(new ImportResultDTO.AnomalyDTO(
                    rowNumber,
                    "PAID_EXCEEDS_TOTAL",
                    "Montant paye superieur au montant total."
            ));
            result.getWarnings().add("Ligne " + rowNumber + ": paiement superieur au total.");
        }
        recouvrement.setSource("IMPORT");
        recouvrementRepository.save(recouvrement);
    }

    private void validateBusinessRules(int rowNumber,
                                       Row row,
                                       Map<String, Integer> headerMap,
                                       DataFormatter formatter,
                                       Article article,
                                       ImportResultDTO result) {
        String clientNom = getText(row, headerMap, formatter, "client_nom");
        String clientPrenom = getText(row, headerMap, formatter, "client_prenom");
        String operationLibelle = getText(row, headerMap, formatter, "operation_libelle");

        if (operationLibelle.isBlank()) {
            throw new IllegalArgumentException("operation_libelle est obligatoire.");
        }
        if (clientNom.isBlank() || clientPrenom.isBlank()) {
            throw new IllegalArgumentException("client_nom et client_prenom sont obligatoires.");
        }
        if (article.getPrixCession() == null || article.getPrixCession() <= 0) {
            throw new IllegalArgumentException("article_prix_cession doit etre > 0.");
        }

        normalizeDateForWarning(rowNumber, row, headerMap, formatter, "date");

        double montantPaye = getDouble(row, headerMap, formatter, "recouvrement_montant_paye");
        if (montantPaye < 0) {
            result.getAnomalies().add(new ImportResultDTO.AnomalyDTO(
                    rowNumber,
                    "NEGATIVE_PAYMENT",
                    "Montant paye negatif detecte."
            ));
            result.getWarnings().add("Ligne " + rowNumber + ": montant paye negatif.");
        }
    }

    private void saveImportHistory(ImportResultDTO result) {
        ImportHistory history = new ImportHistory();
        history.setFileName(result.getFileName() == null ? "unknown" : result.getFileName());
        history.setImportDate(LocalDateTime.now());
        history.setTotalRows(result.getTotal());
        history.setSuccessRows(result.getSuccess());
        history.setFailedRows(result.getFailed());
        history.setUserName(null);
        importHistoryRepository.save(history);
    }

    private Map<String, Integer> buildHeaderMap(Row headerRow, DataFormatter formatter) {
        Map<String, Integer> headers = new HashMap<>();
        if (headerRow == null) {
            return headers;
        }
        for (Cell cell : headerRow) {
            String key = canonicalHeader(formatter.formatCellValue(cell));
            if (!key.isBlank()) {
                headers.put(key, cell.getColumnIndex());
            }
        }
        return headers;
    }

    private boolean isRowEmpty(Row row, DataFormatter formatter) {
        for (Cell cell : row) {
            if (!formatter.formatCellValue(cell).trim().isBlank()) {
                return false;
            }
        }
        return true;
    }

    private String getText(Row row, Map<String, Integer> headers, DataFormatter formatter, String key) {
        Integer index = headers.get(key);
        if (index == null) return "";
        Cell cell = row.getCell(index);
        return cell == null ? "" : formatter.formatCellValue(cell).trim();
    }

    private double getDouble(Row row, Map<String, Integer> headers, DataFormatter formatter, String key) {
        String raw = cleanText(getText(row, headers, formatter, key)).replace(',', '.');
        if (raw.isBlank()) return 0.0;
        try {
            return Double.parseDouble(raw);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private String cleanText(String value) {
        if (value == null) return "";
        return value.replace("\uFEFF", "").trim().replaceAll("\\s+", " ");
    }

    private String cleanName(String value) {
        String cleaned = cleanText(value).toLowerCase(Locale.ROOT);
        if (cleaned.isBlank()) return "";
        String[] parts = cleaned.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p.isBlank()) continue;
            if (!sb.isEmpty()) sb.append(" ");
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1));
        }
        return sb.toString();
    }

    private String normalizeStatus(String status) {
        String s = cleanText(status).toUpperCase(Locale.ROOT);
        if (s.isBlank()) return "";
        if (Arrays.asList("SOLDE", "PAYE", "PAID", "COMPLETED").contains(s)) return "SOLDE";
        return "EN_COURS";
    }

    private String canonicalHeader(String raw) {
        String normalized = Normalizer.normalize(cleanText(raw), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replace("-", "_")
                .replace(" ", "_");
        Map<String, String> aliases = Map.ofEntries(
                Map.entry("operation", "operation_libelle"),
                Map.entry("operation_libelle", "operation_libelle"),
                Map.entry("nom", "client_nom"),
                Map.entry("client_nom", "client_nom"),
                Map.entry("prenom", "client_prenom"),
                Map.entry("client_prenom", "client_prenom"),
                Map.entry("cin", "client_cin"),
                Map.entry("article", "article_id_produit"),
                Map.entry("prix", "article_prix_cession"),
                Map.entry("montant", "recouvrement_montant_paye"),
                Map.entry("montant_paye", "recouvrement_montant_paye"),
                Map.entry("prix_cession", "article_prix_cession"),
                Map.entry("id_produit", "article_id_produit"),
                Map.entry("numero_individuel", "article_numero_individuel"),
                Map.entry("date_contrat", "date"),
                Map.entry("statut", "recouvrement_statut")
        );
        return aliases.getOrDefault(normalized, normalized);
    }

    private void addCorrectionIfChanged(int rowNumber,
                                        String field,
                                        String original,
                                        String corrected,
                                        ImportResultDTO result) {
        String o = original == null ? "" : original;
        String c = corrected == null ? "" : corrected;
        if (!o.equals(c)) {
            result.getCorrections().add(new ImportResultDTO.CorrectionDTO(rowNumber, field, o, c));
        }
    }

    private void normalizeDateForWarning(int rowNumber,
                                         Row row,
                                         Map<String, Integer> headers,
                                         DataFormatter formatter,
                                         String field) {
        String raw = cleanText(getText(row, headers, formatter, field));
        if (raw.isBlank()) return;
        List<DateTimeFormatter> formats = List.of(
                DateTimeFormatter.ofPattern("yyyy-MM-dd"),
                DateTimeFormatter.ofPattern("dd/MM/yyyy"),
                DateTimeFormatter.ofPattern("d/M/yyyy")
        );
        for (DateTimeFormatter f : formats) {
            try {
                LocalDate date = LocalDate.parse(raw, f);
                if (!date.format(DateTimeFormatter.ISO_LOCAL_DATE).equals(raw)) {
                    // date normalization information is a non-blocking warning
                }
                return;
            } catch (DateTimeParseException ignored) {
            }
        }
        // No exception - only warning for non-critical date field
    }

    private String[] splitCsvLine(String line, char delimiter) {
        String regex = delimiter == ';'
                ? ";(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)"
                : ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";
        return line.split(regex, -1);
    }

    private Map<String, String> buildRowMap(String[] headers, String[] values) {
        Map<String, String> map = new HashMap<>();
        for (int i = 0; i < headers.length; i++) {
            String value = i < values.length ? values[i] : "";
            map.put(headers[i], cleanText(value).replaceAll("^\"|\"$", ""));
        }
        return map;
    }

    private String get(Map<String, String> values, String key) {
        return cleanText(values.getOrDefault(key, ""));
    }

    private Operation upsertOperationFromMap(Map<String, String> values,
                                             int rowNumber,
                                             ImportResultDTO result,
                                             Map<String, Operation> cache) {
        String libelle = cleanText(get(values, "operation_libelle"));
        if (libelle.isBlank()) throw new IllegalArgumentException("operation_libelle est obligatoire");
        String division = cleanText(get(values, "operation_division"));
        String operationKey = (libelle + "|" + division).toLowerCase(Locale.ROOT);
        if (cache.containsKey(operationKey)) return cache.get(operationKey);

        Operation operation = operationRepository.findByLibelleAndDivision(libelle, division).orElseGet(Operation::new);
        operation.setLibelle(libelle);
        operation.setDivision(division);
        String site = cleanText(get(values, "operation_site"));
        if (!site.isBlank()) {
            try {
                String normalizedSite = site.toUpperCase(Locale.ROOT);
                addCorrectionIfChanged(rowNumber, "operation_site", site, normalizedSite, result);
                operation.setSite(Site.valueOf(normalizedSite));
            } catch (IllegalArgumentException ignored) {
                result.getWarnings().add("Ligne " + rowNumber + ": operation_site inconnu (" + site + ").");
            }
        }
        Operation saved = operationRepository.save(operation);
        cache.put(operationKey, saved);
        return saved;
    }

    private Client upsertClientFromMap(Map<String, String> values,
                                       int rowNumber,
                                       ImportResultDTO result,
                                       Map<String, Client> cache) {
        String cin = get(values, "client_cin");
        String nom = cleanName(get(values, "client_nom"));
        String prenom = cleanName(get(values, "client_prenom"));
        String telephone = get(values, "client_telephone");
        String adresse = get(values, "client_adresse");
        String ville = cleanName(get(values, "client_ville"));
        String clientKey = (cin.isBlank() ? nom + "|" + prenom + "|" + telephone : cin).toLowerCase(Locale.ROOT);
        if (cache.containsKey(clientKey)) return cache.get(clientKey);

        Client client = cin.isBlank() ? new Client() : clientRepository.findByCin(cin).orElseGet(Client::new);
        client.setCin(cin.isBlank() ? null : cin);
        client.setNom(nom);
        client.setPrenom(prenom);
        client.setNumeroTel(telephone);
        client.setAdresse(adresse);
        client.setVille(ville);
        addCorrectionIfChanged(rowNumber, "client_nom", get(values, "client_nom"), nom, result);
        addCorrectionIfChanged(rowNumber, "client_prenom", get(values, "client_prenom"), prenom, result);
        Client saved = clientRepository.save(client);
        cache.put(clientKey, saved);
        return saved;
    }

    private Article upsertArticleFromMap(Map<String, String> values,
                                         Operation operation,
                                         Client client,
                                         int rowNumber,
                                         ImportResultDTO result,
                                         Map<String, Article> cache) {
        String idProduit = get(values, "article_id_produit");
        String numeroIndividuel = get(values, "article_numero_individuel");
        String key = (idProduit + "|" + numeroIndividuel).toLowerCase(Locale.ROOT);
        if (cache.containsKey(key)) return cache.get(key);

        Article article = null;
        if (!idProduit.isBlank()) article = articleRepository.findByIdProduit(idProduit).orElse(null);
        if (article == null && !numeroIndividuel.isBlank()) article = articleRepository.findByNumeroIndividuel(numeroIndividuel).orElse(null);
        if (article == null) article = new Article();

        article.setIdProduit(idProduit);
        article.setTypologie(get(values, "article_typologie"));
        article.setSuperficieProvisoire(parseDouble(get(values, "article_superficie_provisoire")));
        article.setSuperficieCadastrale(parseDouble(get(values, "article_superficie_cadastrale")));
        article.setNumeroTitreMere(get(values, "article_numero_titre_mere"));
        article.setNumeroIndividuel(numeroIndividuel);
        double prix = parseDouble(get(values, "article_prix_cession"));
        if (prix == 0.0) prix = parseDouble(get(values, "prix_cession"));
        article.setPrixCession(prix);
        article.setOperation(operation);
        article.setClient(client);
        Article saved = articleRepository.save(article);
        cache.put(key, saved);
        return saved;
    }

    private void validateBusinessRulesFromMap(int rowNumber,
                                              Map<String, String> values,
                                              Article article,
                                              ImportResultDTO result) {
        String operationLibelle = get(values, "operation_libelle");
        String clientNom = get(values, "client_nom");
        String clientPrenom = get(values, "client_prenom");
        if (operationLibelle.isBlank()) throw new IllegalArgumentException("operation_libelle est obligatoire.");
        if (clientNom.isBlank() || clientPrenom.isBlank()) throw new IllegalArgumentException("client_nom et client_prenom sont obligatoires.");
        if (article.getPrixCession() == null || article.getPrixCession() <= 0) throw new IllegalArgumentException("article_prix_cession doit etre > 0.");
        double montantPaye = parseDouble(get(values, "recouvrement_montant_paye"));
        if (montantPaye < 0) {
            result.getAnomalies().add(new ImportResultDTO.AnomalyDTO(rowNumber, "NEGATIVE_PAYMENT", "Montant paye negatif detecte."));
            result.getWarnings().add("Ligne " + rowNumber + ": montant paye negatif.");
        }
    }

    private void upsertRecouvrementFromMap(Map<String, String> values,
                                           Article article,
                                           int rowNumber,
                                           ImportResultDTO result) {
        Recouvrement recouvrement = recouvrementRepository.findByArticle_IdArticle(article.getIdArticle()).orElseGet(Recouvrement::new);
        double total = article.getPrixCession() == null ? 0.0 : article.getPrixCession();
        double paye = parseDouble(get(values, "recouvrement_montant_paye"));
        if (paye == 0.0) paye = parseDouble(get(values, "montant"));
        recouvrement.setArticle(article);
        recouvrement.setMontantTotal(total);
        recouvrement.setMontantPaye(paye);
        recouvrement.setMontantRestant(Math.max(0, total - paye));
        String statut = normalizeStatus(get(values, "recouvrement_statut"));
        recouvrement.setStatut(statut.isBlank() ? (recouvrement.getMontantRestant() <= 0 ? "SOLDE" : "EN_COURS") : statut);
        if (paye > total) {
            result.getAnomalies().add(new ImportResultDTO.AnomalyDTO(rowNumber, "PAID_EXCEEDS_TOTAL", "Montant paye superieur au montant total."));
            result.getWarnings().add("Ligne " + rowNumber + ": paiement superieur au total.");
        }
        recouvrement.setSource("IMPORT");
        recouvrementRepository.save(recouvrement);
    }

    private double parseDouble(String raw) {
        String v = cleanText(raw).replace(',', '.');
        if (v.isBlank()) return 0.0;
        try {
            return Double.parseDouble(v);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
