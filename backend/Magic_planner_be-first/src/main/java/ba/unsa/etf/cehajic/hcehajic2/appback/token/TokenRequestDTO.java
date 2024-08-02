package ba.unsa.etf.cehajic.hcehajic2.appback.token;


public class TokenRequestDTO {
    private String Token;
    private Long accountId;
    private String ModelId;

    public TokenRequestDTO() {
        // Default no-argument constructor
    }

    public TokenRequestDTO(String token, Long accountId, String modelId) {
        this.Token = token;
        this.accountId = accountId;
        this.ModelId = modelId;
    }

    public String getToken() {
        return Token;
    }

    public void setToken(String token) {
        this.Token = token;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getModelId() {
        return ModelId;
    }

    public void setModelId(String modelId) {
        this.ModelId = modelId;
    }
    
}
