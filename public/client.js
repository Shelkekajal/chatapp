const socket = io(); // Automatically connects to the deployment host

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.chat-messages');

const name = prompt("Enter your name to join") || "Guest";
alert(`Welcome, ${name}`);
socket.emit('new-user-joined', name);

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

// Close button functionality
const closeButton = document.querySelector('.close-btn');
const chatContainer = document.querySelector('.chat-container');

if (closeButton && chatContainer) {
    closeButton.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });
} else {
    console.warn('Close button or chat container not found!');
}
