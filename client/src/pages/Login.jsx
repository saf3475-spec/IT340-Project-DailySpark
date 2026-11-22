import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { postJSON } from '../api.js';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = Boolean(location.state && location.state.registered);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const result = await postJSON('/api/login', { username, password });
    setBusy(false);

    if (result.ok) {
      login(result.data.username || username);
      navigate('/');
    } else if (result.status === 401) {
      setError('Incorrect username or password.');
    } else if (result.status === 0) {
      setError('Could not reach the server. Please try again in a moment.');
    } else {
      setError('Something went wrong. Please check your details and try again.');
    }
  }

  return (
    <div className="auth-wrap">
      <section className="panel" aria-labelledby="login-title">
        <h1 id="login-title">Log in</h1>
        <p className="sub">Welcome back. Pick up where you left off.</p>

        {justRegistered && (
          <p className="form-note" role="status">Account created. You can log in now.</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username" required
                   maxLength={20} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
                   maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-block" type="submit" disabled={busy}>
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="alt">New here? <Link to="/register">Create an account</Link></p>
      </section>
    </div>
  );
}
