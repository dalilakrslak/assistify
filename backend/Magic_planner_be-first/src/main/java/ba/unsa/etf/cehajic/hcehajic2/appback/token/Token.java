package ba.unsa.etf.cehajic.hcehajic2.appback.token;

import javax.persistence.*;

import ba.unsa.etf.cehajic.hcehajic2.appback.child.Child;

@Entity
@Table(name = "token", uniqueConstraints = @UniqueConstraint(columnNames = "token"))
public class Token {
     @Id
    @SequenceGenerator(
            name = "token_sequence_new",
            sequenceName = "token_sequence_new",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "token_sequence_new"
    )
    private Long id;
    
    @Column(name = "token", unique = true)
    private String token;

    @ManyToOne(optional = true)
    @JoinColumn(name = "childId") // Specify the name of the foreign key column
    private Child child;

    private String ModelId;
    
    public Token(){};
    public Token(String token,Long accountId, String modelId) {
        this.token = token;
        if(accountId!=null){
        this.child = new Child();
        this.child.setId(accountId);
        }
        this.ModelId = modelId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Child getChild() {
        return child;
    }

    public void setChild(Child child) {
        this.child = child;
    }

    public String getModelId() {
        return ModelId;
    }

    public void setModelId(String modelId) {
        this.ModelId = modelId;
    }

    @Override
    public String toString() {
        return "Account{" +
                "id=" + id +
                ", Token='" + token + '\'' +
                ", ModelId=" + ModelId + '\'' +
                '}';
    }

}
