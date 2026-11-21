require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const HOST = '192.168.56.11';
const PORT = 3000;
const ALLOWED_SOURCES = ['192.168.56.10'];      // only the front-end VM
const BCRYPT_ROUNDS = 12;
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', BCRYPT_ROUNDS);
const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Simple log: timestamp, event, details (never passwords)
fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
function log(event, details = {}) {
  const line = `${new Date().toISOString()} ${event} ${JSON.stringify(details)}\n`;
  process.stdout.write(line);
  fs.appendFile(path.join(__dirname, 'logs', 'app.log'), line, () => { });
}

const app = express();
app.use(express.json({ limit: '10kb' }));

// Only accept requests that come from the front-end VM
app.use((req, res, next) => {
  const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');
  if (!ALLOWED_SOURCES.includes(ip)) {
    log('REJECTED_SOURCE', { ip, path: req.path });
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'be01' });
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body || {};
  if (typeof username !== 'string' || !USERNAME_RE.test(username) ||
    typeof email !== 'string' || email.length > 255 || !EMAIL_RE.test(email) ||
    typeof password !== 'string' || password.length < 12 || password.length > 72) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hash]
    );
    log('REGISTER_OK', { username });
    res.status(201).json({ message: 'Account created' });
  } catch (err) {
    if (err.code === '23505') {
      log('REGISTER_DUPLICATE', { username });
      return res.status(409).json({ error: 'Username or email already in use' });
    }
    log('REGISTER_ERROR', { message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' ||
    username.length > 20 || password.length > 72) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const result = await pool.query(
      'SELECT username, password_hash FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];
    // Compare even when the user doesn't exist, so response time doesn't reveal valid usernames
    const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
    if (user && ok) {
      log('LOGIN_OK', { username });
      return res.json({ message: 'Login successful', username: user.username });
    }
    log('LOGIN_FAIL', { username });
    res.status(401).json({ error: 'Incorrect username or password' });
  } catch (err) {
    log('LOGIN_ERROR', { message: err.message });
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, HOST, () => {
  log('SERVER_START', { host: HOST, port: PORT });
});