package ba.unsa.etf.cehajic.hcehajic2.appback.token;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
@RequestMapping("/api/v1/token")
@CrossOrigin
public class TokenController {

     private final TokenService tokenService;

    @Autowired
    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<Token> getAllTasks() {
        return tokenService.GetAllTokens();
    }

    @GetMapping(path = "/{id}")
    public List<Token> getTokensForAccount(@PathVariable("id") Long id) {
        return tokenService.GetTokensForAccount(id);
    }

    @PostMapping(path = "/create")
    public ResponseEntity<Token> CreateNewToken(@RequestBody TokenRequestDTO requestDTO) {
                Token newToken = tokenService.AddNewToken(
                requestDTO.getToken(),
                requestDTO.getAccountId(),
                requestDTO.getModelId()
        );

        return ResponseEntity.ok().body(newToken);
    }

    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Token> updateToken(@PathVariable("id") Long id, @RequestBody String newToken) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(newToken);
            String tok = jsonNode.get("token").asText();
            
            Token updatedToken = tokenService.UpdateToken(id, tok);

            return ResponseEntity.ok(updatedToken);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



    @DeleteMapping
    public void deleteTask(@RequestBody String token) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(token);
            String tok = jsonNode.get("token").asText();

            tokenService.deleteToken(tok);   

            System.out.println("Delete called!");

        } catch (Exception e) {
        }
        
    }
    
}
