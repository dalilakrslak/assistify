import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/Calendar.css';
import AddTaskForm from './AddTaskForm';

const Calendar = ({ id }) => {
  const [currentYear, setCurrentYear] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false); 

  const API_BASE_URL = "https://magicplannerbe-production.up.railway.app";

  useEffect(() => {
    const currentDate = new Date();
    setCurrentYear(currentDate.getFullYear());
    setCurrentMonth(currentDate.getMonth());
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/task/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [id]);

  const handleChangeYear = (amount) => {
    setCurrentYear((prevYear) => prevYear + amount);
  };

  const handleDateClick = (date) => {
    if (selectedDate && selectedDate.getTime() === date.getTime()) {
      setSelectedDate(null);
      setShowTaskPanel(false);
    } else {
      setSelectedDate(date);
      setShowTaskPanel(true);
    }
  };

  const handleAddTask = (newTask) => {
    setShowAddTaskModal(true); // Close the modal after adding the task
  };

  const handleCloseModal = () => {
    setShowAddTaskModal(false); // Zatvori modalni prozor
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const bosnianMonths = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
  ];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const numberOfDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const datesOfMonth = [];
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOffset = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

  for (let i = firstDayOffset - 1; i > 0; i--) {
    datesOfMonth.push({ date: new Date(currentYear, prevMonth, daysInPrevMonth - i + 1), isCurrentMonth: false });
  }

  for (let i = 1; i <= numberOfDaysInMonth; i++) {
    datesOfMonth.push({ date: new Date(currentYear, currentMonth, i), isCurrentMonth: true });
  }

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const remainingDays = (7 - (firstDayOffset + numberOfDaysInMonth) % 7) % 7;

  for (let i = 1; i <= remainingDays; i++) {
    datesOfMonth.push({ date: new Date(currentYear, nextMonth, i), isCurrentMonth: false });
  }

  return (
    <div className="calendar-container">
    <div className="calendar">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => handleChangeYear(-1)} style={{ color: '#07255d' }}>
          <FontAwesomeIcon icon={faAngleLeft} size="lg" />
        </button>
        <span style={{ color: '#07255d' }}>{currentYear}</span>
        <button className="nav-button" onClick={() => handleChangeYear(1)} style={{ color: '#07255d' }}>
          <FontAwesomeIcon icon={faAngleRight} size="lg" />
        </button>
      </div>
      <div className="calendar-months">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} onClick={() => setCurrentMonth(i)} className={`month ${i === currentMonth ? 'current-month' : ''}`}>
            {bosnianMonths[i].substring(0, 3)}
          </div>
        ))}
      </div>
      <hr />
      <div className="calendar-weekdays">
        <div className="weekday">Pon</div>
        <div className="weekday">Uto</div>
        <div className="weekday">Sri</div>
        <div className="weekday">Čet</div>
        <div className="weekday">Pet</div>
        <div className="weekday">Sub</div>
        <div className="weekday">Ned</div>
      </div>
      <div className="calendar-grid">
        <div className="calendar-dates">
          {datesOfMonth.map((dateObj, index) => {
            const { date, isCurrentMonth } = dateObj;
            const dateString = isCurrentMonth ? date.toISOString().substring(0, 10) : '';

            return (
              <div
                key={dateString || index}
                className={`calendar-date ${isCurrentMonth ? '' : 'empty-day'} ${tasks.some(task => {
                  const taskDate = new Date(task.dueDate);
                  return date.getDate() === taskDate.getDate() &&
                        date.getMonth() === taskDate.getMonth() &&
                        date.getFullYear() === taskDate.getFullYear();
                }) ? 'has-task' : ''}`}
                onClick={() => handleDateClick(date)}
                style={{ backgroundColor: isCurrentMonth ? '' : 'transparent' }}
              >
                <div className="date-wrapper">
                  {dateString ? <div className="date">{date.getDate()}</div> : <div>&nbsp;</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      {selectedDate && showTaskPanel && (
        <div className="task-panel">
          <div className="task-panel-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              {(() => {
                const days = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota'];
                const day = days[selectedDate.getDay()];
                return <>{day},</>;
              })()}
              <div>
                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#07255d', fontWeight: '600' }} onClick={() => setShowTaskPanel(false)}>x</button>
              </div>
            </div>
            <div style={{ marginTop: '5px' }}>
              {(() => {
                const months = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'];
                const month = months[selectedDate.getMonth()];
                const date = selectedDate.getDate();
                const year = selectedDate.getFullYear();
                return <>{date}. {month} {year}.</>;
              })()}
            </div>
          </div>
          <div className="task-list-calendar">
            {tasks
              .filter(task => {
                const taskDate = new Date(task.dueDate);
                return selectedDate.getDate() === taskDate.getDate() &&
                  selectedDate.getMonth() === taskDate.getMonth() &&
                  selectedDate.getFullYear() === taskDate.getFullYear();
              })
              .sort((a, b) => {
                const timeA = new Date(`2000-01-01T${a.dueTime}`);
                const timeB = new Date(`2000-01-01T${b.dueTime}`);
                return timeA - timeB;
              })
              .map(task => (
                <div key={task.id} className="task-item">
                  <span className='task-time'>{task.dueTime}</span>
                  <span className='task-name'>{task.taskName}</span>
                </div>
              ))}
          </div>
          <button className="add-task-button-calendar" onClick={handleAddTask}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '1.1em', marginRight: '5px' }} />
            DODAJ ZADATAK
          </button>
        </div>
      )}
      {showAddTaskModal && (
        <div className="modal-calendar">
          <div className="modal-content-calendar">
            <span className="close-calendar" onClick={handleCloseModal}>&times;</span>
            <AddTaskForm
              employeeId={id}
              closeModal={handleCloseModal}
              showDateInput={false}
              selectedDate={selectedDate}
              onTaskAdded={handleTaskAdded}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
