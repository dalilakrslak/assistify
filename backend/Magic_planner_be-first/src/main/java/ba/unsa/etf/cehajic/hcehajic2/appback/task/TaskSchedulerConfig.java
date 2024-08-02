package ba.unsa.etf.cehajic.hcehajic2.appback.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class TaskSchedulerConfig {

    @Autowired
    private TaskSchedulerService taskSchedulerService;

    @Scheduled(fixedRate = 60000) // Run every minute
    public void scheduleTask() {
        taskSchedulerService.checkTasksEndingSoon();
    }
}

