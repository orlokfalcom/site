const socket = io('/');
const info = {
    numberMessages: 0,
    connected: 0
};
let author = '';

socket.on('receivedMessage', (message) => {
    renderMessage(message);
});

socket.on('previousMessages', (messages) => {
    messages.forEach(message => renderMessage(message));
    renderConnectionsInfo();
});

socket.on('ConnectionsInfo', (connectionsInfo) => {
    info.connected = connectionsInfo.connections._connections;
    renderConnectionsInfo();
});

getAuthor();

function getAuthor() {
    const user = localStorage.getItem('user');
    if (user) {
        author = user;
    } else {
        toggleBoxForNewUser('tog');
    }
}

function generateMessageTemplate({ message, author, time }) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const userImageElement = document.createElement('div');
    userImageElement.classList.add('user-image');

    const userIconElement = document.createElement('i');
    userIconElement.classList.add('fal', 'fa-user-circle');

    userImageElement.appendChild(userIconElement);

    const messageContentElement = document.createElement('div');

    const authorInfoElement = document.createElement('h2');
    authorInfoElement.textContent = author;

    const messageTimeElement = document.createElement('span');
    messageTimeElement.textContent = time;

    authorInfoElement.appendChild(messageTimeElement);

    const messageTextElement = document.createElement('p');
    messageTextElement.setAttribute('aria-expanded', 'true');
    messageTextElement.textContent = message;

    messageContentElement.appendChild(authorInfoElement);
    messageContentElement.appendChild(messageTextElement);

    messageElement.appendChild(userImageElement);
    messageElement.appendChild(messageContentElement);

    return messageElement;
}

function renderMessage(message) {
    const messagesContainer = document.querySelector('.messages');
    const messageTemplate = generateMessageTemplate(message);

    messagesContainer.appendChild(messageTemplate);

    info.numberMessages += 1;
    moveScroll();
    renderConnectionsInfo();
}

function renderConnectionsInfo() {
    document.querySelector('#online').innerHTML = `
        <h3><i class="fas fa-circle"></i> ${info.connected} Online</h3>
    `;

    document.querySelector('#messages-received').innerHTML = `
        <h3 id="messages-received">
            <i class="fad fa-inbox-in"></i> ${info.numberMessages} ${info.numberMessages === 1 ? "Mensagem" : "Mensagens"}
        </h3>
    `;
}

function toggleBoxForNewUser(met) {
    const input = document.getElementById('enter-user');
    if (met === 'tog') {
        input.classList.toggle('active');
        input.focus();
    } else if (met === 'get') {
        const newUser = document.getElementById('input-user').value.trim();

        if (newUser.length < 4) {
            alert('Erro ao cadastrar usuário, tente um nome mais longo.');
            return;
        }

        localStorage.setItem('user', newUser);
        author = newUser;
        toggleBoxForNewUser('tog');
    }
}

function moveScroll() {
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function submit(event) {
    event.preventDefault();

    getAuthor();

    const message = document.querySelector('input[name=message]').value.trim();
    document.querySelector('#input-message').value = '';

    if (message.length) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;

        const messageObject = {
            author,
            message,
            time,
        };

        renderMessage(messageObject);
        moveScroll();
        socket.emit('sendMessage', messageObject);
    }
}

function handleToggleLeftBar() {
    const bar = document.querySelector('#left-bar');
    const chat = document.querySelector('#chat-area');
    const icon = document.querySelector('#toggleInfo');

    bar.classList.toggle('active');
    chat.classList.toggle('active');

    icon.className = icon.className === 'fal fa-info-circle' ? 'fal fa-times' : 'fal fa-info-circle';
}
