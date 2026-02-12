import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import EngineerDashboard from './pages/EngineerDashboard';
import StockManagerDashboard from './pages/StockManagerDashboard';

function App() {
  const role = localStorage.getItem("role");
  const currentUser = { role };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/engineer-dashboard"
          element={<EngineerDashboard user={currentUser} />}
        />
        <Route
          path="/stock-dashboard"
          element={<StockManagerDashboard user={currentUser} />}
        />
      </Routes>
    </Router>
  );
}


export default App;
