package ma.omrane.recouvrement_prjt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "recouvrement")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Recouvrement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montantTotal;
    private Double montantPaye;
    private Double montantRestant;

    private String statut;

    private String source; // import ou manuel

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_article")
    @JsonIgnore
    private Article article;

    public Recouvrement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getMontantTotal() { return montantTotal; }
    public void setMontantTotal(Double montantTotal) { this.montantTotal = montantTotal; }

    public Double getMontantPaye() { return montantPaye; }
    public void setMontantPaye(Double montantPaye) { this.montantPaye = montantPaye; }

    public Double getMontantRestant() { return montantRestant; }
    public void setMontantRestant(Double montantRestant) { this.montantRestant = montantRestant; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Article getArticle() { return article; }
    public void setArticle(Article article) { this.article = article; }
}