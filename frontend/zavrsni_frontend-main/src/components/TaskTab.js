import React, { useState, useEffect } from "react";
import "../styles/TaskTab.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import AddTaskForm from "./AddTaskForm";

function TaskTab({ employeeId }) {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setPriorityTasks] = useState([]);
  const [nTasks, setNormalTasks] = useState([]);
  const [sortBy, setSortBy] = useState("all");
  const [subTasksMap, setSubTasksMap] = useState({});

  const API_BASE_URL = "https://magicplannerbe-production.up.railway.app";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/task/${employeeId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const priorityTasks = data.filter((task) => task.priority === true);
        const normalTasks = data.filter((task) => task.priority === false);
        setPriorityTasks(priorityTasks);
        setNormalTasks(normalTasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [employeeId]);

  useEffect(() => {
    const fetchSubTasks = async () => {
      try {
        const tasksToFetch = [...tasks, ...nTasks];
        const subTasksData = await Promise.all(
          tasksToFetch.map(async (task) => {
            const response = await fetch(`${API_BASE_URL}/api/v1/task/sub/${task.id}`);
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            const subTasks = await response.json();
            return { taskId: task.id, subTasks };
          })
        );
        const subTasksMap = {};
        subTasksData.forEach(({ taskId, subTasks }) => {
          subTasksMap[taskId] = subTasks;
        });
        setSubTasksMap(subTasksMap);
      } catch (error) {
        console.error(error);
      }
    };

    if (tasks.length > 0 || nTasks.length > 0) {
      fetchSubTasks();
    }
  }, [tasks, nTasks]);

  const sortTasks = (tasks) => {
    switch (sortBy) {
      case "hard":
        return tasks.filter((task) => task.difficulty === "hard");
      case "medium":
        return tasks.filter((task) => task.difficulty === "medium");
      case "easy":
        return tasks.filter((task) => task.difficulty === "easy");
      default:
        return tasks;
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/task/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedPriorityTasks = tasks.filter((task) => task.id !== taskId);
      const updatedNormalTasks = nTasks.filter((task) => task.id !== taskId);
      setPriorityTasks(updatedPriorityTasks);
      setNormalTasks(updatedNormalTasks);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubTask = async (taskId, subTaskName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/task/sub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: subTaskName,
          task: {
            id: taskId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();

      const newSubTask = responseData;
      const updatedSubTasksMap = { ...subTasksMap };
      if (updatedSubTasksMap[taskId]) {
        updatedSubTasksMap[taskId].push(newSubTask);
      } else {
        updatedSubTasksMap[taskId] = [newSubTask];
      }
      setSubTasksMap(updatedSubTasksMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSubTask = async (subTaskId, taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/task/sub/${subTaskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const updatedSubTasksMap = { ...subTasksMap };
      updatedSubTasksMap[taskId] = updatedSubTasksMap[taskId].filter(
        (subTask) => subTask.id !== subTaskId
      );
      setSubTasksMap(updatedSubTasksMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortChange = (sortBy) => {
    setSortBy(sortBy);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAddTask = async (newTask) => {
    if(newTask.priority) {
      setPriorityTasks([...tasks, newTask]);
    }
    else {
      setNormalTasks([...nTasks, newTask]);;
    }
  }

  const currentDate = new Date(); 
  const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  return (
    <div>
      <div className="sort-container">
        <div className="sort-options">
          <button onClick={() => handleSortChange("all")} className={sortBy === "all" ? "active" : ""} > PRIKAŽI SVE </button>
          <button onClick={() => handleSortChange("hard")} className={sortBy === "hard" ? "active" : ""} > TEŠKI </button>
          <button onClick={() => handleSortChange("medium")} className={sortBy === "medium" ? "active" : ""} > SREDNJE TEŠKI </button>
          <button onClick={() => handleSortChange("easy")} className={sortBy === "easy" ? "active" : ""} > LAGANI </button>
        </div>
        <div>
          <button className="add-task-button" onClick={() => setShowModal(true)} >
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: "1.1em", marginRight: "5px" }} />{" "} DODAJ ZADATAK
          </button>
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close" onClick={() => setShowModal(false)}> &times; </span>
              <AddTaskForm employeeId={employeeId} closeModal={closeModal} onTaskAdded={handleAddTask} />
            </div>
          </div>
        )}
      </div>

      <h2 className="priority-title">Prioritetni zadaci</h2>
            <div className="task-list">
              {sortTasks(tasks).map((task, index) => (
                <div key={task.id} className={`task-list-item difficulty-${task.difficulty}`} >
                  <div className="task-list-item-header">
                    <p className={`task-list-item-date ${task.done ? 'task-done' : ''}`}  style={{color: !task.done && new Date(task.dueDate) < todayDate ? '#c70000' : '', fontWeight: !task.done && new Date(task.dueDate) < todayDate ? 'bold' : 'normal'}}>
                      {new Date(task.dueDate).toLocaleDateString("en-GB")}{" "} {task.dueTime}
                    </p>
                    <button className="delete-button" onClick={() => handleDeleteTask(task.id)} >
                      <FontAwesomeIcon icon={faXmark} style={{ color: "#C70000" }} size="2x" />
                    </button>
                  </div>
                  <h3 className="task-list-item-title">{task.taskName}</h3>
                  <p className="task-list-item-description"> {task.description} </p>
                  <div className="sub-tasks-container">
                    {subTasksMap[task.id] && subTasksMap[task.id].map((subTask) => (
                        <div id={subTask.id} key={subTask.id} className="sub-task-item">
                          <p>{subTask.description}</p>
                          <button className="delete-subtask-button" onClick={() => handleDeleteSubTask(subTask.id, task.id) } >
                            <FontAwesomeIcon icon={faTrashCan} style={{ color: "#C70000" }} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="add-subtask-form" id={task.id}>
            <input
              type="text"
              name="subTaskName"
              placeholder="Dodaj podzadatak"
            />
            <button
              type="submit"
              onClick={(e) => {
                const inputField = e.target.closest('.add-subtask-form').querySelector('input[name="subTaskName"]');
                const subTaskName = inputField.value;
                handleAddSubTask(task.id, subTaskName);
                inputField.value = ''; // Clear the input field after adding the subtask
              }}
            >
                      <FontAwesomeIcon icon={faPlus} style={{ color: "#07255d", border: "none" }} size="2x" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="priority-title">Manje prioritetni zadaci</h2>
            <div className="task-list">
              {sortTasks(nTasks).map((task, index) => (
                <div key={task.id} className={`task-list-item difficulty-${task.difficulty}`} >
                  <div className="task-list-item-header"> 
                    <p className={`task-list-item-date ${task.done ? 'task-done' : ''}`}  style={{color: !task.done && new Date(task.dueDate) < todayDate ? '#c70000' : '', fontWeight: !task.done && new Date(task.dueDate) < todayDate ? 'bold' : 'normal'}}>
                      {new Date(task.dueDate).toLocaleDateString("en-GB")}{" "} {task.dueTime}
                    </p>                  
                    <button className="delete-button" onClick={() => handleDeleteTask(task.id)} >
                      <FontAwesomeIcon icon={faXmark} style={{ color: "#C70000" }} size="2x" />
                    </button>
                  </div>
                  <h3 className="task-list-item-title">{task.taskName}</h3>
                  <p className="task-list-item-description"> {task.description} </p>
                  <div className="sub-tasks-container">
                    {subTasksMap[task.id] && subTasksMap[task.id].map((subTask) => (
                        <div key={subTask.id} className="sub-task-item">
                          <p>{subTask.description}</p>
                          <button className="delete-subtask-button" onClick={() => handleDeleteSubTask(subTask.id, task.id) } >
                            <FontAwesomeIcon icon={faTrashCan} style={{ color: "#C70000" }} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="add-subtask-form" id={task.id}>
            <input
              type="text"
              name="subTaskName"
              placeholder="Dodaj podzadatak"
            />
            <button
              type="submit"
              onClick={(e) => {
                const inputField = e.target.closest('.add-subtask-form').querySelector('input[name="subTaskName"]');
                const subTaskName = inputField.value;
                handleAddSubTask(task.id, subTaskName);
                inputField.value = ''; // Clear the input field after adding the subtask
              }}
            >
                    <FontAwesomeIcon icon={faPlus} style={{ color: "#07255d", border: "none" }} size="2x" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  );
}

export default TaskTab;
