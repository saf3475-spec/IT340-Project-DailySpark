import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postJSON } from '../api.js';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const result = await postJSON('/api/register', { username, email, password });
    setBusy(false);

    if (result.ok) {
      navigate('/login', { state: { registered: true } });
    } else if (result.status === 409) {
      setError('That username or email is already in use.');
    } else if (result.status === 400) {
      setError('Please check your details: username 3–20 letters, numbers or underscores, a valid email, and a password of 12–72 characters.');
    } else if (result.status === 0) {
      setError('Could not reach the server. Please try again in a moment.');
    } else {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="auth-wrap">
      <section className="panel" aria-labelledby="register-title">
        <h1 id="register-title">Create your account</h1>
        <p className="sub">Comment on daily posts, bookmark favorites, and suggest questions.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text" autoComplete="username" required
                   minLength={3} maxLength={20} pattern="[A-Za-z0-9_]+" aria-describedby="username-hint"
                   value={username} onChange={(e) => setUsername(e.target.value)} />
            <p className="hint" id="username-hint">3 to 20 letters, numbers or underscores.</p>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={255}
                   value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required
                   minLength={12} maxLength={72} aria-describedby="password-hint"
                   value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="hint" id="password-hint">12 to 72 characters.</p>
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" required
                   maxLength={72} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-block" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="alt">Already registered? <Link to="/login">Log in</Link></p>
      </section>
    </div>
  );
}
