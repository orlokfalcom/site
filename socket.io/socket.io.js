const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Função para criar e adicionar mensagens ao chat
const addMessage = (msg) => {
  const item = document.createElement('div');
  item.textContent = msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
};

// Enviar mensagem ao servidor quando o formulário for submetido
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Receber e exibir mensagem do servidor
socket.on('chat message', (msg) => {
  addMessage(msg);
});

// Notificar quando um usuário se conecta ou desconecta
socket.on('connect', () => {
  addMessage('You are connected to the chat.');
});

socket.on('disconnect', () => {
  addMessage('You have been disconnected from the chat.');
});
