const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
require('./config/db');
const authRoutes = require('./routes/authRoutes');

const taskRouter = require('./routes/taskRoutes');
const router = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",  // Allow frontend clients to connect
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);

app.use(express.json());
const userRouter = require('./routes/userRoutes');
app.use(userRouter);

// Attach io to the request object (so it can be used in controllers)
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/tasks', taskRouter);


// Base Route
app.get('/', (req, res) => {
    res.send('Welcome to the Task Management API');
});

app.use('/api', router);

//app.use('/api', router);

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Emit event when a client disconnects
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});