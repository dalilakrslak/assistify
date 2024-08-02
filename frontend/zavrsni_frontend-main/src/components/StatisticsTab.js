import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import '../styles/StatisticsTab.css';

const StatisticsTab = ({ id }) => {
  const API_BASE_URL = "https://magicplannerbe-production.up.railway.app";

  const [taskData, setTaskData] = useState([]);
  const [averageTime, setAverageTime] = useState('00:00:00');
  const [difficultyAverages, setDifficultyAverages] = useState({
    easy: '00:00:00',
    medium: '00:00:00',
    hard: '00:00:00'
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/v1/task/${id}`)
      .then(response => {
        setTaskData(response.data);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  }, [id]);

  useEffect(() => {
    if (taskData.length > 0) {
      const validTasks = taskData.filter(task => task.start && task.end);

      const times = validTasks.map(task => {
        const start = moment(task.start);
        const end = moment(task.end);
        return end.diff(start, 'seconds');
      });

      const averageSeconds = times.reduce((a, b) => a + b, 0) / times.length;
      const averageTimeFormatted = averageTime ? moment.utc(averageSeconds * 1000).format('HH:mm:ss') : '00:00:00';
      setAverageTime(averageTimeFormatted);

      const difficulties = ['easy', 'medium', 'hard'];
      const difficultyTimes = difficulties.map(difficulty => {
        const filteredTasks = validTasks.filter(task => task.difficulty === difficulty);
        const times = filteredTasks.map(task => {
          const start = moment(task.start);
          const end = moment(task.end);
          return end.diff(start, 'seconds');
        });
        const avgSeconds = times.reduce((a, b) => a + b, 0) / times.length;
        return avgSeconds;
      });

      const difficultyAverages = {
        easy: difficultyTimes[0] ? moment.utc(difficultyTimes[0] * 1000).format('HH:mm:ss') : '00:00:00',
        medium: difficultyTimes[1] ? moment.utc(difficultyTimes[1] * 1000).format('HH:mm:ss') : '00:00:00',
        hard: difficultyTimes[2] ? moment.utc(difficultyTimes[2] * 1000).format('HH:mm:ss') : '00:00:00',
      };

      setDifficultyAverages(difficultyAverages);
    }
  }, [taskData]);

  return (
    <div className="statistics-container">
      <div className="statistics-average-container average">
        <div className="statistics-average-title">{averageTime || '00:00:00'}</div>
        <div className="statistics-average-value">Prosječno vrijeme potrebno za izradu zadatka</div>
      </div>
      <div className="statistics-rectangles">
        <div className="statistics-average-container easy">
          <div className="statistics-average-title">{difficultyAverages.easy}</div>
          <div className="statistics-average-value">Lagani</div>
        </div>
        <div className="statistics-average-container medium">
          <div className="statistics-average-title">{difficultyAverages.medium}</div>
          <div className="statistics-average-value">Srednje teški</div>
        </div>
        <div className="statistics-average-container hard">
          <div className="statistics-average-title">{difficultyAverages.hard}</div>
          <div className="statistics-average-value">Teški</div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsTab;
