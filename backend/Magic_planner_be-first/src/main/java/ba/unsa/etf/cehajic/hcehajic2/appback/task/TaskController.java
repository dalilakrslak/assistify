package ba.unsa.etf.cehajic.hcehajic2.appback.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ba.unsa.etf.cehajic.hcehajic2.appback.child.Child;
import ba.unsa.etf.cehajic.hcehajic2.appback.child.ChildService;
import ba.unsa.etf.cehajic.hcehajic2.appback.token.Token;
import ba.unsa.etf.cehajic.hcehajic2.appback.token.TokenService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin
class TaskController {

    private final TaskService taskService;
    private final TokenService tokenService;
    private final ChildService childService;
    private final TaskNotificationService notificationService;

    @Autowired
    public TaskController(TaskService taskService, TokenService tokenService,ChildService childService, TaskNotificationService notificationService) {
        this.taskService = taskService;
        this.tokenService = tokenService;
        this.childService = childService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.GetAllTasks();
    }

    @GetMapping(path = "/{id}")
    public List<Task> getTasksForAccount(@PathVariable("id") Long id) {
        return taskService.GetTasksForAccount(id);
    }

    @GetMapping(path = "/undone/{id}")
    public List<Task> getUndoneTasksForAccount(@PathVariable("id") Long id) {
        return taskService.GetUndoneTasksForAccount(id);
    }

    @GetMapping(path = "/alldone/{id}")
    public List<Task> getDoneTasksForAccount(@PathVariable("id") Long id) {
        return taskService.GetDoneTasksForAccount(id);
    }

    @PostMapping
    public ResponseEntity<Task> addNewTask(@RequestBody Task task) {

        Child child = childService.GetChildById(task.getChild().getId());
        task.setChild(child);

        Task newTask = taskService.AddNewTask(task);

        List<String> pushTokens = notificationService.getTokens(task.getChild().getEmail());

        System.out.println(pushTokens);

        // Send push notification to each token
        for (String pushToken : pushTokens) {
            notificationService.sendMobileNotification(pushToken,newTask,"Imaš novi task!");
        }

        return ResponseEntity.ok().body(newTask);
    }


    @PutMapping(path = "/start/{id}")
    public void startTask(@PathVariable Long id) {
        taskService.StartTask(id);
    }

    @PutMapping(path = "/done/{id}")
    public void finishTask(@PathVariable Long id) {
        taskService.FinishTask(id);
    }

    @DeleteMapping(path = {"/{taskId}"})
    public void deleteTask(@PathVariable("taskId") Long taskId) {
        System.out.println("Delete called!");
        taskService.deleteTask(taskId);
    }
}
