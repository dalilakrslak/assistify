import React, { useState, useEffect } from 'react';
import '../styles/AddTaskForm.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

function AddTaskForm({ employeeId, closeModal, showDateInput = true, selectedDate = '', onTaskAdded, onSubTaskAdded }) {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [priority, setPriority] = useState(false);
    const [subTaskName, setSubTaskName] = useState('');
    const [subTasks, setSubTasks] = useState([]);

    const API_BASE_URL = "https://magicplannerbe-production.up.railway.app";

    useEffect(() => {
        if (selectedDate) {
            const formattedDate = formatDate(selectedDate);
            setDueDate(formattedDate);
        }
    }, [selectedDate]);

    const formatDate = (date) => {
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const addSubTask = () => {
        if (subTaskName.trim() !== '') {
            setSubTasks([...subTasks, subTaskName]);
            setSubTaskName('');
        }
    };

    const removeSubTask = (index) => {
        const updatedSubTasks = [...subTasks];
        updatedSubTasks.splice(index, 1);
        setSubTasks(updatedSubTasks);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const taskData = {
            taskName: taskName,
            description: description,
            dueDate: dueDate,
            dueTime: dueTime,
            difficulty: difficulty,
            child: {
                id: employeeId,
            },
            priority: priority,
        };

        const response = await fetch(`${API_BASE_URL}/api/v1/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const taskId = responseData.id;

        if (subTasks.length > 0) {
            await Promise.all(subTasks.map(async (subTaskName) => {
                const subTaskData = {
                    description: subTaskName,
                    task: {
                        id: taskId,
                    },
                };

                const subTaskResponse = await fetch(`${API_BASE_URL}/api/v1/task/sub`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subTaskData),
                });

                if (!subTaskResponse.ok) {
                    throw new Error('Network response was not ok');
                }
            }));
        }

        setTaskName('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setDifficulty('');
        setPriority(false);
        setSubTasks([]);

        closeModal();
        onTaskAdded(responseData);
    } catch (error) {
        console.error(error);
    }
};


    return (
        <form className="addTask-form" onSubmit={handleSubmit}>
            <div className='div-form'>
                <label>Naziv zadatka:</label>
                <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
            </div>
            <div className='div-form'>
                <label>Opis:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            {showDateInput && (
            <div className='div-form'>
                <label>Rok:</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} required />
                </div>
            )}
            {!showDateInput && (
                <div className='div-form'>
                    <label>Rok:</label>
                    <input type="date" value={selectedDate ? formatDate(selectedDate) : ''} readOnly />
                    <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} required />
                </div>
            )}
            <div className='div-form'>
                <label>Težina:</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
                    <option value="">Odaberi težinu</option>
                    <option value="easy">Lagano</option>
                    <option value="medium">Srednje</option>
                    <option value="hard">Teško</option>
                </select>
            </div>
            <div className='div-form'>
                <label>Prioritet:</label>
                <input
                    type="checkbox"
                    checked={priority}
                    onChange={(e) => setPriority(e.target.checked)}
                />
            </div>
            <h4>Podzadaci:</h4>
            <div className="sub-tasks-container">
                {subTasks.map((subTask, index) => (
                    <div key={index} className="sub-task-item">
                        <p>{subTask}</p>
                        <button className="delete-subtask-button" onClick={() => removeSubTask(index)}>
                            <FontAwesomeIcon icon={faTrashCan} style={{ color: "#C70000" }} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="add-subtask-form">
                <input className='add-subtask-input' type="text" name="subTaskName" placeholder="Dodaj podzadatak" value={subTaskName} onChange={(e) => setSubTaskName(e.target.value)} />
                <button className='add-subtask' type="button" onClick={addSubTask}>
                    <FontAwesomeIcon icon={faPlus} style={{ color: "#07255d", border: "none" }} size="2x" />
                </button>
            </div>
            <button type="submit">Dodaj zadatak</button>
        </form>
    );
}

export default AddTaskForm;
