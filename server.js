const express = require('express');
const http = require('http');
<<<<<<< HEAD
const socketIo = require('socket.io');
require('./config/db');
const authRoutes = require('./routes/authRoutes');
=======
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
>>>>>>> main

// 🔗 Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/taskManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err));

// 📌 Définition du modèle Task
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: String,
    status: { type: String, enum: ['pending', 'assigned', 'accepted', 'rejected', 'finished'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', TaskSchema);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 🛠️ **Activer CORS**
app.use(cors());
app.use(bodyParser.json());

// 📌 API pour récupérer toutes les tâches
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// 📌 API pour créer une tâche
app.post('/tasks', async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const newTask = new Task({ title, description, assignedTo, status });
    await newTask.save();

<<<<<<< HEAD
app.use('/api/auth', authRoutes);

app.use(express.json());
const userRouter = require('./routes/userRoutes');
app.use(userRouter);

// Attach io to the request object (so it can be used in controllers)
app.use((req, res, next) => {
    req.io = io;
    next();
=======
    io.emit('taskCreated', newTask); // 🔥 Broadcast WebSocket
    res.json(newTask);
>>>>>>> main
});

// 📌 WebSocket pour gérer les mises à jour en temps réel
io.on('connection', (socket) => {
    console.log('🟢 Un client est connecté');

    socket.on('createTask', async (taskData) => {
        const newTask = new Task(taskData);
        await newTask.save();
        io.emit('taskCreated', newTask);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Un client s’est déconnecté');
    });
});

// 📌 Démarrer le serveur
const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
