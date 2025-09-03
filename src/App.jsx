import React, { useState, useEffect } from "react";
import Todo from "./Todo";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDay, setLastCompletedDay] = useState(null);

  useEffect(() => {
    document.body.className = isDark ? "dark-mode" : "light-mode";
  }, [isDark]);

  const handleAdd = () => {
    if (task.trim() !== "") {
      setTodos([...todos, { text: task, completed: false, missed: false }]);
      setTask("");
    }
  };

  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = true;
    setTodos(newTodos);

    // check if all tasks done → streak++
    if (newTodos.every((t) => t.completed)) {
      const today = new Date().toDateString();
      if (lastCompletedDay !== today) {
        setStreak(streak + 1);
        setLastCompletedDay(today);
      }
    }
  };

  return (
    <div className="app">
      <header>
        <h1>📌 Personal To-Do</h1>
        <button onClick={() => setIsDark(!isDark)}>
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="streak-counter">
        🔥 Streak: <span>{streak} days</span>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleAdd}>➕ Add</button>
      </div>

      <Todo todos={todos} handleDelete={handleDelete} handleComplete={handleComplete} />
    </div>
  );
}

export default App;

