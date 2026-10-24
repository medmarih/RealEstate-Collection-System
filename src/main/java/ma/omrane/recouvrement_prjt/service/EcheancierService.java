package ma.omrane.recouvrement_prjt.service;

import ma.omrane.recouvrement_prjt.entity.Echeancier;
import ma.omrane.recouvrement_prjt.entity.Recouvrement;
import ma.omrane.recouvrement_prjt.repository.EcheancierRepository;
import ma.omrane.recouvrement_prjt.repository.RecouvrementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EcheancierService {

    private final EcheancierRepository echeancierRepository;
    private final RecouvrementRepository recouvrementRepository;

    public EcheancierService(EcheancierRepository echeancierRepository,
                             RecouvrementRepository recouvrementRepository) {
        this.echeancierRepository = echeancierRepository;
        this.recouvrementRepository = recouvrementRepository;
    }

    public Echeancier create(Echeancier e, Long recouvrementId) {

        Recouvrement r = recouvrementRepository.findById(recouvrementId)
                .orElseThrow(() -> new RuntimeException("Recouvrement non trouvé avec id: " + recouvrementId));

        // 🔥 validation
        if (e.getMontant() == null || e.getMontant() <= 0) {
            throw new RuntimeException("Le montant doit être supérieur à 0");
        }

        if (r.getMontantTotal() == null || r.getMontantPaye() == null) {
            throw new RuntimeException("Données recouvrement invalides");
        }

        double montantRestant = r.getMontantTotal() - r.getMontantPaye();

        // 🔥 logique propre (pas anomalie)
        if (e.getMontant() > montantRestant) {
            throw new RuntimeException("Montant dépasse le restant !");
        }

        // 🔗 liaison
        e.setRecouvrement(r);

        // 💰 calcul paiement
        double nouveauMontantPaye = r.getMontantPaye() + e.getMontant();
        r.setMontantPaye(nouveauMontantPaye);

        double nouveauRestant = r.getMontantTotal() - nouveauMontantPaye;
        r.setMontantRestant(nouveauRestant);

        // 📊 statut
        if (nouveauRestant <= 0) {
            r.setStatut("SOLDE");
        } else {
            r.setStatut("EN_COURS");
        }

        recouvrementRepository.save(r);

        return echeancierRepository.save(e);
    }

    public List<Echeancier> findAll() {
        return echeancierRepository.findAll();
    }
}