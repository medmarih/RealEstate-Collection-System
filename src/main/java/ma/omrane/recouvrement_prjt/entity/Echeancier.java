package ma.omrane.recouvrement_prjt.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "echeancier")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Echeancier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEcheance;

    private Double montant;
    private String dateEcheance;
    private boolean paye;
    private int delai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_recouvrement")
    private Recouvrement recouvrement;

    public Echeancier() {}

    public Long getIdEcheance() { return idEcheance; }
    public void setIdEcheance(Long idEcheance) { this.idEcheance = idEcheance; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public String getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(String dateEcheance) { this.dateEcheance = dateEcheance; }

    public boolean isPaye() { return paye; }
    public void setPaye(boolean paye) { this.paye = paye; }

    public int getDelai() { return delai; }
    public void setDelai(int delai) { this.delai = delai; }

    public Recouvrement getRecouvrement() { return recouvrement; }
    public void setRecouvrement(Recouvrement recouvrement) { this.recouvrement = recouvrement; }
}