import { createContext, useContext, useState } from 'react';

// Milestone 2: this only remembers the username for the page UI (per browser tab).
// Real session handling arrives with the next milestone.
const AuthContext = createContext(null);
const KEY = 'ds-user';

function readUser() {
  try { return sessionStorage.getItem(KEY); } catch (err) { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser());

  function login(name) {
    setUser(name);
    try { sessionStorage.setItem(KEY, name); } catch (err) { /* ignore */ }
  }
  function logout() {
    setUser(null);
    try { sessionStorage.removeItem(KEY); } catch (err) { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
