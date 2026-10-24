package ma.omrane.recouvrement_prjt.dto;

public class RecouvrementDTO {

    private Long id;
    private Double montantTotal;
    private Double montantPaye;
    private Double montantRestant;
    private String statut;

    public RecouvrementDTO() {}

    public RecouvrementDTO(Long id, Double montantTotal,
                           Double montantPaye, Double montantRestant,
                           String statut) {
        this.id = id;
        this.montantTotal = montantTotal;
        this.montantPaye = montantPaye;
        this.montantRestant = montantRestant;
        this.statut = statut;
    }

    public Long getId() { return id; }
    public Double getMontantTotal() { return montantTotal; }
    public Double getMontantPaye() { return montantPaye; }
    public Double getMontantRestant() { return montantRestant; }
    public String getStatut() { return statut; }

    public void setId(Long id) { this.id = id; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }
    public void setMontantPaye(Double montantPaye) { this.montantPaye = montantPaye; }
    public void setMontantRestant(Double montantRestant) { this.montantRestant = montantRestant; }
    public void setStatut(String statut) { this.statut = statut; }
}