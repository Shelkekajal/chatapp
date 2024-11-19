const { io } = require('socket.io-client');
const socket = io('https://chat_app.onrender.com');

//const socket = io('http://localhost:8000');


const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.chat-messages');

const name = prompt("Enter your name to join") || "Guest";
alert(`Welcome, ${name}`); // Temporary debugging step
//socket.emit('new-user-joined', name);
//const name = prompt("Enter your name to join");
//socket.emit('new-user-joined', name);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat`, 'left');
});

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    appendMessage(`${name} left the chat`, 'left');
});

function appendMessage(message, position) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.innerHTML = `<p>${message}</p>`;
    
    messageElement.appendChild(messageText);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the latest message
}
// Get the close button and chat container elements
const closeButton = document.querySelector('.close-btn'); // Targets the close button
const chatContainer = document.querySelector('.chat-container'); // Targets the chat container

// Check if elements exist before adding event listener
if (closeButton && chatContainer) {
    // Add an event listener to the close button
    closeButton.addEventListener('click', () => {
        chatContainer.style.display = 'none'; // Hides the chat container when the close button is clicked
    });
} else {
    console.warn('Close button or chat container not found!');
}
