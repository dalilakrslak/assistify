package ba.unsa.etf.cehajic.hcehajic2.appback.manager;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Long> {

    boolean existsByEmail(String email);
}