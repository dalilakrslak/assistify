package ba.unsa.etf.cehajic.hcehajic2.appback.manager;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ba.unsa.etf.cehajic.hcehajic2.appback.child.Child;
import ba.unsa.etf.cehajic.hcehajic2.appback.child.ChildService;
import ba.unsa.etf.cehajic.hcehajic2.appback.token.TokenService;
import ba.unsa.etf.cehajic.hcehajic2.appback.usersettings.UserSettingsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord.CreateRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/manager")
@CrossOrigin
class ManagerController {

    private final ManagerService accountService;
    private final ChildService childService;
    private final TokenService tokenService;

    @Autowired
    public ManagerController(ManagerService accountService,ChildService childService,TokenService tokenService) {
        this.accountService = accountService;
        this.childService = childService;
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<Manager> getAllAccounts() {
        return accountService.GetAllAccounts();
    }

    @GetMapping(path = "/children/{id}")
    public List<Child> getAllChildren(@PathVariable("id") Long id) {
        return childService.GetAllChildren().stream()
        .filter(child -> {
            Manager manager = child.getManager();
            return manager != null && manager.getId().equals(id);
        })
        .collect(Collectors.toList());
    }

    @GetMapping(path = "/{username}/{pass}")
    public Manager getAccountByCredentials(@PathVariable("username") String accName,
                                           @PathVariable("pass") String pass) {
        return accountService.GetAccountByCredentials(accName, pass);
    }

    @GetMapping(path = "/{id}")
    public Manager getManagerById(@PathVariable("id") Long id) {
        return accountService.getManagerById(id);
    }

    @PostMapping(path = "/create")
    public ResponseEntity<?> addNewAccount(@RequestBody ManagerRequestDTO requestDTO) {
        System.out.println("Creating new User!");

        if (accountService.existsByEmail(requestDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Email already exists");
        }
        
        Manager newAccount = accountService.CreateNewAccount(
                requestDTO.getName(),
                requestDTO.getSurname(),
                requestDTO.getEmail(),
                requestDTO.getKidMale(),
                requestDTO.getPassword(),
                requestDTO.getDateOfBirth()
        );

        CreateRequest request = new CreateRequest()
        .setEmail(newAccount.getEmail())
        .setPassword(newAccount.getPassword())
        .setDisplayName(requestDTO.getName()+ " "+ requestDTO.getSurname())
        .setEmailVerified(true);     

        try {
            FirebaseAuth.getInstance().createUser(request);


        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        };   

        return ResponseEntity.ok().body(newAccount);
    }

    
    @PostMapping(path = "/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Manager manager = accountService.GetAccountByCredentials(username, password);
        if (manager != null) {
            return ResponseEntity.ok(manager);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @PutMapping(path = "/pass/{id}")
    public ResponseEntity<Manager> updatePassword(@PathVariable("id") Long id, @RequestBody String passwordJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(passwordJson);
            String pass = jsonNode.get("password").asText();

            Manager updatedUser = accountService.UpdatePassword(id, pass);

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    @DeleteMapping
    public ResponseEntity<String> deleteAllAccounts() {
        try {
            accountService.deleteAllAccounts();
            return ResponseEntity.ok("All accounts deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
             .body("An error occurred while deleting all accounts.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManagerById(@PathVariable Long id) {
        accountService.deleteManagerById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<Manager> updateUser(@PathVariable("id") Long id, @RequestBody Manager updatedUserData) {
        try {
            Manager updatedUser = accountService.updateUser(id, updatedUserData);

            if (updatedUser == null) {
                return ResponseEntity.notFound().build(); 
            }

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
