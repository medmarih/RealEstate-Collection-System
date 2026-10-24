package ma.omrane.recouvrement_prjt.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "article")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idArticle;

    @Column(name = "id_produit")
    private String idProduit;

    private String typologie;

    private Double superficieProvisoire;
    private Double superficieCadastrale;

    private String numeroTitreMere;
    private String numeroIndividuel;

    // 🔥 validation PRO
    @NotNull
    @Positive
    private Double prixCession;

    // 🔥 éviter boucle JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_operation")
    @JsonIgnore
    private Operation operation;

    // 🔥 éviter boucle JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_client")
    @JsonIgnore
    private Client client;

    public Article() {}

    public Long getIdArticle() { return idArticle; }
    public void setIdArticle(Long idArticle) { this.idArticle = idArticle; }

    public String getIdProduit() { return idProduit; }
    public void setIdProduit(String idProduit) { this.idProduit = idProduit; }

    public String getTypologie() { return typologie; }
    public void setTypologie(String typologie) { this.typologie = typologie; }

    public Double getSuperficieProvisoire() { return superficieProvisoire; }
    public void setSuperficieProvisoire(Double superficieProvisoire) { this.superficieProvisoire = superficieProvisoire; }

    public Double getSuperficieCadastrale() { return superficieCadastrale; }
    public void setSuperficieCadastrale(Double superficieCadastrale) { this.superficieCadastrale = superficieCadastrale; }

    public String getNumeroTitreMere() { return numeroTitreMere; }
    public void setNumeroTitreMere(String numeroTitreMere) { this.numeroTitreMere = numeroTitreMere; }

    public String getNumeroIndividuel() { return numeroIndividuel; }
    public void setNumeroIndividuel(String numeroIndividuel) { this.numeroIndividuel = numeroIndividuel; }

    public Double getPrixCession() { return prixCession; }
    public void setPrixCession(Double prixCession) { this.prixCession = prixCession; }

    public Operation getOperation() { return operation; }
    public void setOperation(Operation operation) { this.operation = operation; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}