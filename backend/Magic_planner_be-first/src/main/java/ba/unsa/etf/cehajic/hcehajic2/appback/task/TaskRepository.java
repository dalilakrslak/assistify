package ba.unsa.etf.cehajic.hcehajic2.appback.task;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByChildId(Long childId);

    @Query("SELECT t FROM Task t WHERE " +
           "CONCAT(t.dueDate, 'T', t.dueTime) BETWEEN :start AND :end")
    List<Task> findTasksEndingInNext30Minutes(@Param("start") String start, @Param("end") String end);

}
