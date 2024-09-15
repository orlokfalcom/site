const socket = io();

const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Function to add a message to the chat
function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Event listener for the send button
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
});

// Listen for incoming messages
socket.on('receivedMessage', (message) => {
    addMessage(message);
});

// Load previous messages
socket.on('previousMessages', (messages) => {
    messages.forEach(addMessage);
});
