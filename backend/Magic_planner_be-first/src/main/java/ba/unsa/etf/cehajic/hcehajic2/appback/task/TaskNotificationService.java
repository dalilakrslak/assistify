package ba.unsa.etf.cehajic.hcehajic2.appback.task;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class TaskNotificationService {
 
    public void sendMobileNotification(String pushToken,Task task,String title) {
        try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
                
                String body = "{\"to\": \"" + pushToken + "\", \"title\": \"" + 
                title + 
                "\", \"body\": \"" 
                + task.getTaskName() + "\", \"sound\": \"default\", \"data\": {\"taskId\": " + task.getId() + ", \"dueDate\": \"" + task.getDueDate() + "\"}}";
                HttpEntity<String> entity = new HttpEntity<>(body, headers);

                String apiUrl = "https://exp.host/--/api/v2/push/send";
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

                if (response.getStatusCode() == HttpStatus.OK) {
                    System.out.println("Push notification sent successfully to token: " + pushToken);
                } else {
                    System.out.println("Failed to send push notification to token: " + pushToken + ". Response code: " + response.getStatusCode());
                }
            } 
            
            catch ( Exception e) {
                System.out.println(e);
            }
        
    }

    public List<String> getTokens(String email) {
        List<String> tokens = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            String apiUrl = "https://app.nativenotify.com/api/expo/indie/sub/22259/xldIGxZI7b0qgDgbFDRgUP/"+email;
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, new HttpEntity<>(headers), String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONArray jsonArray = new JSONArray(response.getBody());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);

                    if (!jsonObject.isNull("expo_ios_token")) {
                        JSONArray expoIosTokens = jsonObject.getJSONArray("expo_ios_token");
                        for (int j = 0; j < expoIosTokens.length(); j++) {
                            tokens.add(expoIosTokens.getString(j));
                        }
                    }

                    if (!jsonObject.isNull("expo_android_token")) {
                        JSONArray expoAndroidTokens = jsonObject.getJSONArray("expo_android_token");
                        for (int j = 0; j < expoAndroidTokens.length(); j++) {
                            tokens.add(expoAndroidTokens.getString(j));
                        }
                    }

                }
            }

        } 
        
        catch ( Exception e) {
            System.out.println(e);
        }

        return tokens;

    }

    
}
