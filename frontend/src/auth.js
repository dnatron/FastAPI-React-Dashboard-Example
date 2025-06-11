/**
 * Autentizační služby pro aplikaci
 */
import axios from 'axios';

// URL backendu - načteno z proměnné prostředí nebo výchozí hodnota
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Registrace nového uživatele
 * @param {string} email - Email uživatele
 * @param {string} username - Uživatelské jméno
 * @param {string} password - Heslo
 * @returns {Promise} - Promise s odpovědí od serveru
 */
export const register = async (email, username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Chyba připojení k serveru');
  }
};

/**
 * Přihlášení uživatele
 * @param {string} username - Uživatelské jméno
 * @param {string} password - Heslo
 * @returns {Promise} - Promise s přístupovým tokenem
 */
export const login = async (username, password) => {
  try {
    // Formát dat pro OAuth2 musí být 'application/x-www-form-urlencoded'
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/token`, formData);
    
    // Uložení tokenu do localStorage
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('token_type', response.data.token_type);

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Chyba připojení k serveru');
  }
};

/**
 * Odhlášení uživatele - odstranění tokenu z localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('token_type');
};

/**
 * Zjištění, zda je uživatel přihlášen
 * @returns {boolean} - True, pokud je uživatel přihlášen
 */
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

/**
 * Získání dat o přihlášeném uživateli
 * @returns {Promise} - Promise s daty o uživateli
 */
export const getCurrentUser = async () => {
  if (!isAuthenticated()) {
    throw new Error('Uživatel není přihlášen');
  }

  const token = localStorage.getItem('token');
  const tokenType = localStorage.getItem('token_type');

  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `${tokenType} ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Pokud je token neplatný, odhlásíme uživatele
      logout();
    }
    throw error.response ? error.response.data : new Error('Chyba připojení k serveru');
  }
};

/**
 * Získání dat pro dashboard
 * @returns {Promise} - Promise s daty pro dashboard
 */
export const getDashboardData = async () => {
  if (!isAuthenticated()) {
    throw new Error('Uživatel není přihlášen');
  }

  const token = localStorage.getItem('token');
  const tokenType = localStorage.getItem('token_type');

  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `${tokenType} ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Pokud je token neplatný, odhlásíme uživatele
      logout();
    }
    throw error.response ? error.response.data : new Error('Chyba připojení k serveru');
  }
};
