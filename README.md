# IT340-Project-DailySpark
DailySpark is a full-stack web application deployed in a local IaaS environment of VM's.

It gives people a single place to find fresh, interesting content each day without searching several sites.
Every day the site automatically publishes a set of curated sections, and registered members can discuss each one in a comment thread. 
Members can also suggest questions for the community, which turns a passive reading site into a conversation.

# Architecture

| VM | Role | Host-only IP | Adapters |
|---|---|---|---|
| fe01 | Nginx serving the React build, proxying `/api` to the back end | 192.168.56.10 | NAT + host-only |
| be01 | Node/Express API, bcrypt hashing, forwards logs (M3) | 192.168.56.11 | NAT + host-only |
| db01 | PostgreSQL | 192.168.56.12 | Host-only (NAT only for updates) |
| log01 | Log storage (M3) | 192.168.56.13 | Host-only (NAT only for updates) |

Request path: browser → Nginx (fe01) → `/api` → Express (be01) → PostgreSQL (db01). The back end is the only VM that talks to the database.

# Firewall (UFW: default deny inbound and outbound)

| VM | Allowed inbound | Allowed outbound |
|---|---|---|
| fe01 | 80, 443 from anywhere | 192.168.56.11:3000 |
| be01 | 3000 from 192.168.56.10 | 192.168.56.12:5432 |
| db01 | 5432 from 192.168.56.11 | none (NAT toggled on for updates only) |
| log01 | none yet | none |

# Database setup (db01)
- PostgreSQL listens on localhost and 192.168.56.12 (`listen_addresses`).
- `pg_hba.conf` allows only user `dsapp` to database `dailyspark` from 192.168.56.11/32 using scram-sha-256.
- `dsapp` has SELECT and INSERT only on the `users` table; passwords are stored as bcrypt hashes.

# Back end (be01)
- Endpoints: `GET /api/health`, `POST /api/register`, `POST /api/login`.
- Parameterized queries prevent SQL injection; input is validated; requests are accepted only from 192.168.56.10.
- Credentials are kept in `.env` (not in Git). Events are written to `backend/logs/app.log`.

# Front end (fe01)
- React (Vite) app in `client/`, built with `npm run build` and served from `/var/www/dailyspark`.
- Nginx config: `deploy/dailyspark.nginx.conf`.

# Logs (Milestone 2)
System logs in `/var/log` (`auth.log`, `syslog`, `ufw.log`, Nginx and PostgreSQL logs) plus the application log above.

# Git workflow
Work happens on the `dev` branch; `main` holds the final version. Only fe01 and be01 push or pull; db01 and log01 are documented here.

# AI usage
AI assistance is documented in the project's Trello board.