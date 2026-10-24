package ma.omrane.recouvrement_prjt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "operation")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Operation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOperation;

    @Column(nullable = false)
    private String libelle;

    private String division;

    @Enumerated(EnumType.STRING)
    private Site site;

    // 🔥 relation avec Article
    @OneToMany(mappedBy = "operation", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Article> articles;

    public Operation() {}

    public Long getIdOperation() { return idOperation; }
    public void setIdOperation(Long idOperation) { this.idOperation = idOperation; }

    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }

    public String getDivision() { return division; }
    public void setDivision(String division) { this.division = division; }

    public Site getSite() { return site; }
    public void setSite(Site site) { this.site = site; }

    public List<Article> getArticles() { return articles; }
    public void setArticles(List<Article> articles) { this.articles = articles; }
}