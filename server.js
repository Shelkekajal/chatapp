const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('new-user-joined', (name) => {
        console.log(`${name} joined the chat`);
        socket.broadcast.emit('user-joined', name);
        socket.name = name;
    });

    socket.on('send', (message) => {
        console.log(`${socket.name}: ${message}`);
        socket.broadcast.emit('receive', { message: message, name: socket.name });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.name} left the chat`);
        socket.broadcast.emit('left', socket.name);
    });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
