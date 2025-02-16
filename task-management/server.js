const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('./config/db');

const taskRouter = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow frontend clients to connect
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Attach io to the request object (so it can be used in controllers)
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(taskRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API with WebSockets');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
