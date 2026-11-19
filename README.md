# IT340-Project-DailySpark
DailySpark is a full-stack web application deployed in a local IaaS environment of VM's.

It gives people a single place to find fresh, interesting content each day without searching several sites.
Every day the site automatically publishes a set of curated sections, and registered members can discuss each one in
a comment thread. Members can also suggest questions for the community, which turns a passive reading site into a
conversation.

# Architecture (Milestone 2):
| VM | Role | Host-only IP |
|---|---|---|
| fe01 | Front end (Nginx) | 192.168.56.10 |
| be01 | Back end (Node/Express) | 192.168.56.11 |
| db01 | Database (PostgreSQL) | 192.168.56.12 |
| log01 | Logging | 192.168.56.13 |

FE and BE have a NAT adapter (internet) and a host-only adapter. DB and Logging are host-only, with NAT turned on only for package updates.
VLAN = host-only network
