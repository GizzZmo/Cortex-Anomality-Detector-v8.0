const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for simplicity, restrict in production
        methods: ["GET", "POST"]
    }
});

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image data

// API routes
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- WebSocket Logic ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('log', async (logData) => {
        try {
            const newLog = await prisma.systemLog.create({
                data: {
                    message: logData.message,
                    type: logData.type,
                },
            });
            // Broadcast the new log to all connected clients
            io.emit('new_log', newLog);
        } catch (error) {
            console.error("Error saving log:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


server.listen(PORT, () => {
    console.log(`CORTEX Backend running on http://localhost:${PORT}`);
});
