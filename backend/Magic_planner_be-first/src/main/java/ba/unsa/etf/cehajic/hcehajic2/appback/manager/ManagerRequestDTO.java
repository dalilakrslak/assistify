package ba.unsa.etf.cehajic.hcehajic2.appback.manager;

import java.time.LocalDate;

public class ManagerRequestDTO {
    private String name;
    private String surname;
    private String email;
    private String kidName;
    private Boolean kidMale;
    private String password;
    private LocalDate dateOfBirth;

    public ManagerRequestDTO() {
        // Default no-argument constructor
    }

    public ManagerRequestDTO(String name, String surname, String password, LocalDate dateOfBirth) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.kidMale = true;
    }

    public ManagerRequestDTO(String name, String surname, String email,String password, LocalDate dateOfBirth) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.kidMale = true;
    }
    public ManagerRequestDTO(String name, String surname, String email, String kidName,String password, LocalDate dateOfBirth) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.kidName = kidName;
        this.kidMale = true;
    }
    public ManagerRequestDTO(String name, String surname, String email, String kidName, Boolean kidMale, String password, LocalDate dateOfBirth) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.kidName = kidName;
        this.kidMale = kidMale;
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

    public String getKidName() {
        return kidName;
    }

    public Boolean getKidMale() {
        return kidMale;
    }

    public void setKidMale(Boolean kidMale) {
        this.kidMale = kidMale;
    }

    public void setKidName(String kidName) {
        this.kidName = kidName;
    }
}
