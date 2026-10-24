package ma.omrane.recouvrement_prjt.repository;

import ma.omrane.recouvrement_prjt.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByCin(String cin);
}
