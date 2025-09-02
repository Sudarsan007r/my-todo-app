import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Todo from "./Todo.jsx";
import "./App.css";

function App() {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos")) || {});
  const [task, setTask] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [showDayTasks, setShowDayTasks] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Correct streak logic
  const getStreak = () => {
    const today = new Date();
    let streak = 0;

    for (let i = 1; i <= 365; i++) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      const key = formatDate(day);
      const dayTasks = todos[key] || [];
      if (dayTasks.length && dayTasks.every((t) => t.completed)) streak++;
      else break;
    }

    // Check if today is completed
    const todayKey = formatDate(today);
    const todayTasks = todos[todayKey] || [];
    if (todayTasks.length && todayTasks.every((t) => t.completed)) streak += 1;

    return streak;
  };

  const handleAdd = () => {
    if (!task.trim()) return;
    const dateKey = formatDate(selectedDate);
    setTodos({
      ...todos,
      [dateKey]: [...(todos[dateKey] || []), { text: task.trim(), completed: false, missed: false }],
    });
    setTask("");
  };

  const handleDelete = (index) => {
    const dateKey = formatDate(selectedDate);
    const newTasks = [...(todos[dateKey] || [])];
    newTasks.splice(index, 1);
    setTodos({ ...todos, [dateKey]: newTasks });
  };

  const handleComplete = (index) => {
    const dateKey = formatDate(selectedDate);
    const newTasks = [...(todos[dateKey] || [])];
    newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
    setTodos({ ...todos, [dateKey]: newTasks });
  };

  // Missed tasks from yesterday
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDate(yesterday);
    if (todos[yesterdayKey]) {
      const missedTasks = todos[yesterdayKey].filter((t) => !t.completed && !t.missed);
      if (missedTasks.length) {
        const todayKey = formatDate(new Date());
        setTodos((prev) => ({
          ...prev,
          [todayKey]: [
            ...(prev[todayKey] || []),
            ...missedTasks.map((t) => ({ ...t, missed: true, completed: false })),
          ],
        }));
      }
    }
  }, []);

  const tasksForSelectedDate = todos[formatDate(selectedDate)] || [];

  return (
    <div className="app">
      {/* Background images */}
      <div
        className="bg-image"
        style={{
          backgroundImage: darkMode
            ? "url('https://c4.wallpaperflare.com/wallpaper/767/17/72/anime-anime-girls-dark-room-wallpaper-preview.jpg')"
            : "url('https://t3.ftcdn.net/jpg/08/07/40/48/240_F_807404831_nXincnVjKiYkv3EEE48iI30QxeX98h4M.jpg')",
        }}
      ></div>

      {/* Girl & Bulb */}
      <div className="girl-container">
        <img
          src="https://images.unsplash.com/photo-1584697964153-d4d9a23fbd62?auto=format&fit=crop&w=800&q=80"
          alt="Studying Girl"
          className="girl-img"
        />
        <div className={darkMode ? "bulb glow" : "bulb"}>💡</div>
      </div>

      {/* Header */}
      <div className="header">
        <h1 className="app-title">Personal To-Do</h1>
        <div className="header-right">
          <span className="streak">🔥 Streak: {getStreak()} days</span>
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="calendar-section">
          <Calendar
            onChange={(date) => { setSelectedDate(date); setShowDayTasks(true); }}
            value={selectedDate}
            className="calendar"
          />
          {showDayTasks && (
            <div className="day-tasks">
              <h3>Tasks for {formatDate(selectedDate)}</h3>
              {tasksForSelectedDate.length ? (
                <ul>
                  {tasksForSelectedDate.map((t, i) => (
                    <li key={i} className={t.completed ? "completed" : t.missed ? "missed" : ""}>
                      {i + 1}. {t.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks for this day.</p>
              )}
            </div>
          )}
        </div>

        <div className="todo-section">
          <div className="input-section">
            <input
              type="text"
              placeholder="Add a new task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <button onClick={handleAdd}>Add</button>
          </div>

          <Todo
            todos={tasksForSelectedDate}
            handleDelete={handleDelete}
            handleComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
