const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('./config/db');

const taskRouter = require('./routes/taskRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/tasks', taskRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API');
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
