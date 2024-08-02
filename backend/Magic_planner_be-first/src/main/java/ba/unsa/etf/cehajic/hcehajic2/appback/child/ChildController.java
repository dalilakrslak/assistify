package ba.unsa.etf.cehajic.hcehajic2.appback.child;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import ba.unsa.etf.cehajic.hcehajic2.appback.manager.Manager;
import ba.unsa.etf.cehajic.hcehajic2.appback.manager.ManagerService;
import ba.unsa.etf.cehajic.hcehajic2.appback.usersettings.UserSettingsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord.CreateRequest;

import java.util.List;

@RestController
@RequestMapping("/api/v1/child")
@CrossOrigin
class ChildController {

    private final ChildService accountService;
    private final ManagerService managerService;
    private final UserSettingsService settingsService;

    @Autowired
    public ChildController(ChildService accountService, ManagerService managerService,UserSettingsService settingsService) {
        this.accountService = accountService;
        this.managerService = managerService;
        this.settingsService = settingsService;
    }

    @GetMapping
    public List<Child> getAllChildren() {
        return accountService.GetAllChildren();
    }

    @GetMapping(path = "/{id}")
    public Child getAccountById(@PathVariable("id") Long id) {
        Child c = accountService.GetChildById(id);
        return c;
    }

    @PostMapping(path = "/create")
    public ResponseEntity<?> addNewChild(@RequestBody ChildRequestDTO requestDTO) {
        System.out.println("Creating new User!");

        if (accountService.existsByEmail(requestDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body("Email already exists");
        }

        Child newAccount = accountService.CreateNewAccount(
                requestDTO.getName(),
                requestDTO.getSurname(),
                requestDTO.getKidMale(),
                requestDTO.getDateOfBirth(),
                requestDTO.getQualities(),
                requestDTO.getPreferences(),
                requestDTO.getSpecial(),
                requestDTO.getManagerId(),
                requestDTO.getEmail(),
                requestDTO.getPassword()
        );

        Manager m = managerService.getManagerById(requestDTO.getManagerId());
        newAccount.setManager(m);

        CreateRequest request = new CreateRequest()
               .setEmail(newAccount.getEmail())
               .setPassword(newAccount.getPassword())
               .setDisplayName(requestDTO.getName()+ " "+ requestDTO.getSurname())
               .setEmailVerified(true);     

       try {

        FirebaseAuth.getInstance().createUser(request);
        settingsService.CreateUserSettingsDefault(newAccount.getId());

    } catch (FirebaseAuthException e) {
        e.printStackTrace();
    };   
        
        return ResponseEntity.ok().body(newAccount);
    }
    @PutMapping(path = "/update/{id}")
    public ResponseEntity<Child> updateUser(@PathVariable("id") Long id, @RequestBody Child updatedUserData) {
        try {
            Child updatedUser = accountService.updateEmployee(id, updatedUserData);

            if (updatedUser == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping(path = "/update/manager/{id}")
    public ResponseEntity<Child> updateUser(@PathVariable("id") Long id, @RequestBody String updatedUserData) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(updatedUserData);

            Long managerId = jsonNode.has("managerId") ? jsonNode.get("managerId").asLong() : null;

            Manager manager = managerService.getManagerById(managerId);

            System.out.println(manager);

            Child updatedUser = accountService.UpdateUser(null,null,null,null,null,manager);

            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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

    @DeleteMapping(path = {"/{childId}"})
    public void deleteEmployee(@PathVariable("childId") Long childId) {
        System.out.println("Delete called!");
        accountService.deleteEmployee(childId);
    }
}
