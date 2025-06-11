import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../auth';

/**
 * Komponenta pro registraci uživatele
 */
function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(email, username, password);
      // Po úspěšné registraci přesměrujeme na přihlášení
      navigate('/login', { state: { message: 'Registrace proběhla úspěšně. Nyní se můžete přihlásit.' } });
    } catch (err) {
      setError(err.detail || 'Chyba při registraci. Zkuste to znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrace</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="username">Uživatelské jméno:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Heslo:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registrace...' : 'Registrovat se'}
        </button>
      </form>
      
      <p>
        Již máte účet? <a href="/login">Přihlaste se</a>
      </p>
    </div>
  );
}

export default Register;
