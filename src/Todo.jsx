import React from "react";
import "./Todo.css";

function Todo({ todos, handleDelete, handleComplete }) {
  return (
    <div className="todo-list">
      {todos.length ? (
        <ul>
          {todos.map((t, i) => (
            <li key={i} className={t.completed ? "completed" : t.missed ? "missed" : ""}>
              <span className="num">{i + 1}.</span>
              <span>{t.text}</span>
              <div className="btns">
                <button className="complete" onClick={() => handleComplete(i)}>
                  ✔
                </button>
                <button className="delete" onClick={() => handleDelete(i)}>
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks added yet!</p>
      )}
    </div>
  );
}

export default Todo;
