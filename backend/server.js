const express = require('express');
const app = express();

const HOST = '192.168.56.11'; //be01 host-only IP
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'be01' });

});

app.listen(PORT, HOST, () => {
  console.log('API listening on http://${HOST}:{PORT}');
});
