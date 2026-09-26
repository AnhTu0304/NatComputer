require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/services/socketManager');

const PORT = process.env.PORT || 5000;

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
initSocket(server);

// Bind server instance to app for testing & lifecycle management
app.server = server;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 NAT Computer Backend Server running (MVC Architecture) on http://localhost:${PORT}`);
  });
}

module.exports = app;
