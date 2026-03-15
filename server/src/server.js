const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const registerSocketHandlers = require('./socket/socketHandler');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

global.io = io;

io.on('connection', (socket) => {
  registerSocketHandlers(io, socket);
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});


