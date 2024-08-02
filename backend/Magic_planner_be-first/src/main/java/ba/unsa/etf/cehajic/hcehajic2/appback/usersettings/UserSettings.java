package ba.unsa.etf.cehajic.hcehajic2.appback.usersettings;
import javax.persistence.*;

import ba.unsa.etf.cehajic.hcehajic2.appback.child.Child;

import java.util.Random;

@Entity
@Table
public class UserSettings {
    @Id
    @SequenceGenerator(
            name = "user_settings_sequence_new",
            sequenceName = "user_settings_sequence_new",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_settings_sequence_new"
    )
    private Long id;
    @OneToOne
    @JoinColumn(name = "childId")
    private Child child;
    private String font;
    private int fontSize;
    private String colorOfPriorityTask;
    private String colorOfNormalTask;
    private String colorForSubtask;
    private String colorForFont;
    private String colorForBackground;
    private String colorForProgress;

    private String phoneLoginString;


    public UserSettings(Long accountId, String font, int fontSize, String colorOfPriorityTask, String colorOfNormalTask, String colorForSubtask, String colorForFont, String colorForBackground, String colorForProgress) {
        this.child = new Child();
        this.child.setId(accountId);
        this.font = font;
        this.fontSize = fontSize;
        this.colorOfPriorityTask = colorOfPriorityTask;
        this.colorOfNormalTask = colorOfNormalTask;
        this.colorForSubtask = colorForSubtask;
        this.colorForFont = colorForFont;
        this.colorForBackground = colorForBackground;
        this.colorForProgress = colorForProgress;
        this.phoneLoginString = accountId + generateRandomString(5) + accountId;
    }

    public UserSettings() {

    }

    public UserSettings(Long id) {
        this.child = new Child();
        this.child.setId(id);
        this.font = "Arial";
        this.fontSize = 12;
        this.colorOfPriorityTask = "#000000";
        this.colorOfNormalTask = "#000000";
        this.colorForSubtask = "#000000";
        this.colorForFont = "#000000";
        this.colorForBackground = "#000000";
        this.colorForProgress = "#000000";
        this.phoneLoginString = id + generateRandomString(5) + id;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Child getChild() {
        return child;
    }

    public void setChild(Child child) {
        this.child = child;
    }

    public String getFont() {
        return font;
    }

    public void setFont(String font) {
        this.font = font;
    }

    public int getFontSize() {
        return fontSize;
    }

    public void setFontSize(int fontSize) {
        this.fontSize = fontSize;
    }

    public String getColorOfPriorityTask() {
        return colorOfPriorityTask;
    }

    public void setColorOfPriorityTask(String colorOfPriorityTask) {
        this.colorOfPriorityTask = colorOfPriorityTask;
    }

    public String getColorOfNormalTask() {
        return colorOfNormalTask;
    }

    public void setColorOfNormalTask(String colorOfNormalTask) {
        this.colorOfNormalTask = colorOfNormalTask;
    }

    public String getColorForSubtask() {
        return colorForSubtask;
    }

    public void setColorForSubtask(String colorForSubtask) {
        this.colorForSubtask = colorForSubtask;
    }

    public String getColorForFont() {
        return colorForFont;
    }

    public void setColorForFont(String colorForHeader) {
        this.colorForFont = colorForHeader;
    }

    public String getColorForBackground() {
        return colorForBackground;
    }

    public void setColorForBackground(String colorForBackground) {
        this.colorForBackground = colorForBackground;
    }

    public String getColorForProgress() {
        return colorForProgress;
    }

    public void setColorForProgress(String colorForProgress) {
        this.colorForProgress = colorForProgress;
    }

    public String getPhoneLoginString() {
        return phoneLoginString;
    }

    public void setPhoneLoginString(String phoneLoginString) {
        this.phoneLoginString = phoneLoginString;
    }


    public static String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(characters.length());
            char randomChar = characters.charAt(randomIndex);
            sb.append(randomChar);
        }

        return sb.toString();
    }

    @Override
    public String toString() {
        return "UserSettings{" +
                "id=" + id +
                ", font='" + font + '\'' +
                ", fontSize=" + fontSize +
                ", colorOfPriorityTask='" + colorOfPriorityTask + '\'' +
                ", colorOfNormalTask='" + colorOfNormalTask + '\'' +
                ", colorForSubtask='" + colorForSubtask + '\'' +
                ", colorForFont='" + colorForFont + '\'' +
                ", colorForBackground='" + colorForBackground + '\'' +
                ", colorForProgress='" + colorForProgress + '\'' +
                ", phoneLoginString='" + phoneLoginString + '\'' +
                '}';
    }
}
