import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, logout, getCurrentUser } from '../auth';

/**
 * Komponenta pro dashboard - chráněná stránka pro přihlášené uživatele
 */
function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Načtení dat pro dashboard při prvním renderu
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Získání informací o uživateli
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Získání dat pro dashboard
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Nelze načíst data. Prosím, zkuste se znovu přihlásit.');
        // Pokud je problém s autentizací, přesměrujeme na přihlášení
        if (err.message === 'Uživatel není přihlášen') {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Funkce pro odhlášení
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="loading">Načítání dashboardu...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">
          Odhlásit se
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {user && (
        <div className="user-info">
          <h3>Informace o uživateli</h3>
          <p><strong>Uživatelské jméno:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {dashboardData && (
        <div className="dashboard-content">
          <h3>Dashboard Data</h3>
          <p>{dashboardData.message}</p>
          <pre>{JSON.stringify(dashboardData.user_info, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
