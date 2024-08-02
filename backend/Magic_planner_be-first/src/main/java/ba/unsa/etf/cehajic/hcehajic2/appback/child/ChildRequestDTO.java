package ba.unsa.etf.cehajic.hcehajic2.appback.child;

import java.time.LocalDate;

public class ChildRequestDTO {
    private String name;
    private String surname;
    private Boolean kidMale;
    private LocalDate dateOfBirth;
    private String qualities;
    private String preferences;
    private String special;
    private Long managerId;
    private String email;
    private String password;

    public ChildRequestDTO() {
        // Default no-argument constructor
    }

    public ChildRequestDTO(String name, String surname, String password, LocalDate dateOfBirth, Long managerId) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.kidMale = true;
        this.managerId = managerId;
    }

    public ChildRequestDTO(String name, String surname,LocalDate dateOfBirth, Long managerId, String email, String password) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.password = password;
        this.kidMale = true;
        this.managerId = managerId;
    }
    public ChildRequestDTO(String name, String surname, String email, Boolean kidMale, String password, LocalDate dateOfBirth, Long managerId) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.kidMale = kidMale;
        this.managerId = managerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getKidMale() {
        return kidMale;
    }

    public void setKidMale(Boolean kidMale) {
        this.kidMale = kidMale;
    }


    public String getQualities() {
        return qualities;
    }

    public void setQualities(String kidName) {
        this.qualities = kidName;
    }
    public String getSpecial() {
        return special;
    }

    public void setSpecial(String kidName) {
        this.special = kidName;
    }
    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String kidName) {
        this.preferences = kidName;
    }
    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long kidName) {
        this.managerId = kidName;
    }
}
