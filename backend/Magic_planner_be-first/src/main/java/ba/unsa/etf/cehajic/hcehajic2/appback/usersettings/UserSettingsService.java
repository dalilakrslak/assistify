package ba.unsa.etf.cehajic.hcehajic2.appback.usersettings;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;

    @Autowired
    public UserSettingsService(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }

    public UserSettings CreateUserSettingsDefault(Long id) {
        UserSettings userSettings = new UserSettings(id,
                "Palatino Linotype",
                22,
                "#FF6347",
                "#00BFFF",
                "#FF6347",
                "#141414",
                "#F5FFFA",
                "#00b200");
        this.userSettingsRepository.save(userSettings);
        return userSettings;
    }

    public UserSettings CreateUserSettings(UserSettings userSettings) {
        this.userSettingsRepository.save(userSettings);
        return userSettings;
    }

    public List<UserSettings> GetAllUserSettings() {
        return userSettingsRepository.findAll();
    }

    public UserSettings GetUserSettingsForAccount(Long id) {
        List<UserSettings> settings = GetAllUserSettings();
        UserSettings matching = null;

        for (int i = 0; i < settings.size(); i++)
            if (settings.get(i).getChild().getId().equals(id))
                matching = settings.get(i);

        return matching;
    }

    public String GetPhoneCode(Long id) {
        UserSettings userSettings = GetUserSettingsForAccount(id);
        if (userSettings == null) return null;
        return userSettings.getPhoneLoginString();
    }

    public UserSettings updateUserSettings(UserSettings userSettings) {
        userSettingsRepository.save(userSettings);
        return userSettings;
    }

    public void UpdateAccountId(Long aid, Long sid) {
        userSettingsRepository.getById(sid).getChild().setId(sid);
    }
}
