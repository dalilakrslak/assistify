package ba.unsa.etf.cehajic.hcehajic2.appback.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ba.unsa.etf.cehajic.hcehajic2.appback.token.Token;
import ba.unsa.etf.cehajic.hcehajic2.appback.token.TokenService;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Service
public class TaskSchedulerService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskNotificationService notificationService;

    @Autowired
    private TokenService tokenService;

    public void checkTasksEndingSoon() {
        
        ZonedDateTime sarajevoNow = ZonedDateTime.now(ZoneId.of("Europe/Sarajevo"));
        
        // Convert Oregon time to Sarajevo time
        ZonedDateTime sarajevoA = sarajevoNow.plusMinutes(29).plusSeconds(30);
        ZonedDateTime sarajevoB = sarajevoNow.plusMinutes(30).plusSeconds(30);
        
        // Format ZonedDateTime to ISO string for verification
        String A = sarajevoA.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        String B = sarajevoB.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        
        // Print the converted times for verification
        System.out.println("Time A in Sarajevo: " + A); 
    
        // Call the repository method with the formatted time strings
        List<Task> tasksEndingSoon = taskRepository.findTasksEndingInNext30Minutes(A, B);
        System.out.println(tasksEndingSoon);
    
        // Iterate over the tasks and send notifications
        for (Task task : tasksEndingSoon) {
            List<String> pushTokens = notificationService.getTokens(task.getChild().getEmail());
            System.out.println(pushTokens);
            // Send push notification to each token
            for (String pushToken : pushTokens) {
                notificationService.sendMobileNotification(pushToken, task, "Još 30min");
            }
        }
    }
}

