import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  function toggleTheme() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ds-theme', next); } catch (err) { /* ignore */ }
    setDark(!dark);
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header>
        <nav className="site-nav" aria-label="Main">
          <Link className="logo" to="/">
            <span className="logo-dot" aria-hidden="true"></span>Daily Spark
          </Link>
          <ul className="nav-links">
            <li><NavLink to="/" end>Today</NavLink></li>
          </ul>
          <div className="nav-actions">
            <button className="theme-toggle" type="button" onClick={toggleTheme} aria-pressed={dark}>
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
            {user ? (
              <>
                <span className="signed-in">Signed in as <strong>{user}</strong></span>
                <button className="btn btn-ghost" type="button" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" to="/login">Log in</Link>
                <Link className="btn" to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">Daily Spark · IT 340 course project</footer>
    </>
  );
}
