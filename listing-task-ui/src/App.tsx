import React from "react";
import TaskCreate from "./components/TaskCreate";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}>
      <h1>Listing Task Dashboard</h1>
      <TaskCreate />
      <TaskList />
    </div>
  );
}

export default App;
