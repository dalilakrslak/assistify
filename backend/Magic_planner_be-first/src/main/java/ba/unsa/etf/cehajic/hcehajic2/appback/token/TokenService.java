package ba.unsa.etf.cehajic.hcehajic2.appback.token;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ba.unsa.etf.cehajic.hcehajic2.appback.manager.Manager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TokenService {

     private final TokenRepository tokenRepository;

    @Autowired
    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public List<Token> GetAllTokens() {
        return tokenRepository.findAll();
    }

    public List<Token> GetTokensForAccount(Long id) {
        List<Token> tokens = GetAllTokens();
        List<Token> matching = new ArrayList<>();
        for (int i = 0; i < tokens.size(); i++)
            if (tokens.get(i).getChild().getId() == id)
                matching.add(tokens.get(i));

        return matching;
    }

    public Token AddNewToken(String token, Long accountId, String modelId) {
        Token token1 = new Token(token,accountId,modelId);
        Token savedToken = tokenRepository.save(token1);
        return savedToken;
    }

    public void deleteToken(String token) {
        tokenRepository.deleteByToken(token);
    }
    
    public Token UpdateToken(Long id, String newToken){

        Optional<Token> existingToken = tokenRepository.findByChildId(id);
        Token token = existingToken.orElse(null);
        if (token == null) return null;
        token.setToken(newToken);
        tokenRepository.save(token);

        return token;
    }

    public String getManagerToken(Manager manager) {
        List<Token> tokens = GetAllTokens();
        Token matching = new Token("", null,manager.getId().toString());
        for (int i = 0; i < tokens.size();){
            if (tokens.get(i).getChild().getManager().getId() == manager.getId())
                matching.setToken(tokens.get(i).getToken());
                break;
        }

        if(matching.getToken()=="")
            return "no";   

        return matching.getToken();
    }


}
