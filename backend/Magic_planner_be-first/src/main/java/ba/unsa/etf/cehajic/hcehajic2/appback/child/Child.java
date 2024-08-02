package ba.unsa.etf.cehajic.hcehajic2.appback.child;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import ba.unsa.etf.cehajic.hcehajic2.appback.manager.Manager;

@Entity
@Table
@JsonIgnoreProperties({"age","hibernateLazyInitializer","username"})
public class Child {

    @Id
    @SequenceGenerator(
            name = "child_sequence_new",
            sequenceName = "child_sequence_new",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "child_sequence_new"
    )
    private Long id;
    private String Name;
    private String Surname;
    private Boolean kidMale;   
    private String qualities;
    private String preferences;
    private String special;
    @ManyToOne
    @JoinColumn(name = "managerId") // Specify the name of the foreign key column
    private Manager manager;
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String Password;

    public Child(){};
    public Child(String name, String surname, LocalDate dateOfBirth,boolean male, String qualities, String preferences, String special, Long managerId, String email ,String password) {
        Name = name;
        Surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.qualities = qualities;
        this.kidMale = male;
        this.preferences = preferences;
        this.special = special;
        this.Password = password;
        this.manager = new Manager();
        this.manager.setId(managerId);
    }

    public Child(String name, String surname, String email, LocalDate dateOfBirth) {
        Name = name;
        Surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
    }

    public Child(String name, String surname, String email, LocalDate dateOfBirth, boolean kidMale) {
        Name = name;
        Surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.kidMale = kidMale;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getSurname() {
        return Surname;
    }

    public void setSurname(String surname) {
        Surname = surname;
    }


    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public int getAge() {
        return Period.between(this.dateOfBirth, LocalDate.now()).getYears();
    }

    public String getUsername() {
        return ((this.Name.toLowerCase()).charAt(0) + this.getSurname().toLowerCase() + this.id)
                .replace("č", "c")
                .replace("ć", "c")
                .replace("ž", "z")
                .replace("š", "s")
                .replace("đ", "d");
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        this.Password = password;
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
    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }
    

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", Name='" + Name + '\'' +
                ", Surname='" + Surname + '\'' +
                ", Email=" + email + '\'' +
                ", kidMale=" + kidMale + '\'' +
                ", dateOfBirth=" + dateOfBirth + '\'' +
                ", qualities=" + qualities + '\'' +
                ", preferences=" + preferences + '\'' +
                ", special=" + special + '\'' +
                ", managerId=" + manager.getId() +
                '}';
    }
}
