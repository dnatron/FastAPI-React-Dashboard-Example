import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

// Import komponentů
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import './App.css';

/**
 * Komponenta pro chráněné routy - ověří, zda je uživatel přihlášen
 */
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Pokud uživatel není přihlášen, přesměrujeme na přihlášení
    return <Navigate to="/login" />;
  }
  return children;
};

/**
 * Hlavní komponenta aplikace
 */
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Přesměrování na /login pro výchozí cestu */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Přesměrování na /login pro neznámé cesty */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
