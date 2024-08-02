package ba.unsa.etf.cehajic.hcehajic2.appback.usersettings;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/account/settings")
@CrossOrigin
public class UserSettingsController {
    private final UserSettingsService userSettingsService;

    @Autowired
    public UserSettingsController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    @GetMapping
    public List<UserSettings> GetAllSettings() { return userSettingsService.GetAllUserSettings(); }

    @GetMapping(path="/{id}")
    public UserSettings GetUserSettings(@PathVariable("id") Long id) { return userSettingsService.GetUserSettingsForAccount(id); }

    @GetMapping(path="mobile/{id}")
    public String GetPhoneCode(@PathVariable Long id) {
        return userSettingsService.GetPhoneCode(id);
    }

    @PostMapping
    public ResponseEntity<UserSettings> CreateUserSettings(@RequestBody UserSettings userSettings) {
        UserSettings newUserSettings = userSettingsService.CreateUserSettings(userSettings);
        return ResponseEntity.ok().body(newUserSettings);
    }

    @PostMapping(path="/default/{id}")
    public ResponseEntity<UserSettings> CreateUserSettings(@PathVariable("id") Long id) {
        UserSettings newUserSettings = userSettingsService.CreateUserSettingsDefault(id);
        return ResponseEntity.ok().body(newUserSettings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSettings> updateUserSettings(@PathVariable Long id, @RequestBody String settingsJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(settingsJson);
            UserSettings existingSettings = userSettingsService.GetUserSettingsForAccount(id);

            if (existingSettings == null) {
                return ResponseEntity.notFound().build();
            }

            if (jsonNode.has("font")) {
                existingSettings.setFont(jsonNode.get("font").asText());
            }

            if (jsonNode.has("fontSize")) {
                existingSettings.setFontSize(jsonNode.get("fontSize").asInt());
            }

            if (jsonNode.has("colorOfPriorityTask")) {
                existingSettings.setColorOfPriorityTask(jsonNode.get("colorOfPriorityTask").asText());
            }

            if (jsonNode.has("colorOfNormalTask")) {
                existingSettings.setColorOfNormalTask(jsonNode.get("colorOfNormalTask").asText());
            }

            if (jsonNode.has("colorForSubtask")) {
                existingSettings.setColorForSubtask(jsonNode.get("colorForSubtask").asText());
            }

            if (jsonNode.has("colorForFont")) {
                existingSettings.setColorForFont(jsonNode.get("colorForFont").asText());
            }

            if (jsonNode.has("colorForBackground")) {
                existingSettings.setColorForBackground(jsonNode.get("colorForBackground").asText());
            }

            if (jsonNode.has("colorForProgress")) {
                existingSettings.setColorForProgress(jsonNode.get("colorForProgress").asText());
            }

            userSettingsService.updateUserSettings(existingSettings);
            return ResponseEntity.ok(existingSettings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
