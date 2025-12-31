import React from 'react';
import TaskCreate from './components/TaskCreate';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  return (
    <div className="container">
      <h1>Listing Task Dashboard</h1>
      <div className="card">
        <TaskCreate />
      </div>
      <div className="card">
        <TaskList />
      </div>
    </div>
  );
}

export default App;
