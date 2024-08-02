package ba.unsa.etf.cehajic.hcehajic2.appback.token;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long>{

    Optional<Token> findByChildId(Long childId);
    
    @Transactional
    void deleteByToken(String token);
}
