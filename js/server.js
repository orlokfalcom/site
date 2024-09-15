import express from 'express';
import { createServer } from 'http';
import { Server } from '.socket.io/socket.io.js';
import path from 'path';

// Obtendo o diretório raiz do projeto
const __dirname = path.resolve();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const PORT = process.env.PORT || 3000;

// Configurando a pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurando a engine de visualização e a pasta de views
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Rota principal
app.get('/', (req, res) => {
  res.render('index.html');
});

const onlineUsers = new Map();
const messages = [];
let connectionsInfo = {
  connections: 0
};

// Manipulando eventos do Socket.IO
io.on('connection', (socket) => {
  // Adiciona novo usuário e notifica os clientes
  socket.on('join', (username) => {
    socket.data = {
      id: socket.id,
      username,
    };
    onlineUsers.set(socket.id, socket.data);
    io.emit('online users', [...onlineUsers.values()]);
    socket.emit('user joined', socket.data);
    console.log(`${socket.data.username} joined the chat`);
  });

  // Envia mensagens anteriores para o novo usuário
  socket.emit('previousMessages', messages);

  // Recebe novas mensagens e distribui para todos os clientes
  socket.on('sendMessage', (data) => {
    messages.push(data);
    io.emit('receivedMessage', data);
  });

  // Atualiza a lista de usuários online e notifica sobre desconexão
  socket.on('disconnect', () => {
    if (socket.data) {
      onlineUsers.delete(socket.id);
      io.emit('online users', [...onlineUsers.values()]);
      console.log(`${socket.data.username} left the chat`);
    }
  });

  // Recebe e distribui mensagens de chat
  socket.on('message', (text) => {
    const time = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    io.emit('receive message', {
      userId: socket.id,
      username: socket.data.username,
      text,
      time,
    });
    console.log(`${socket.data.username}: ${text}`);
  });

  // Recebe mudanças de nome de usuário
  socket.on('change username', (username) => {
    if (socket.data) {
      console.log(`${socket.data.username} changed username to ${username}`);
      socket.data.username = username;
      io.emit('online users', [...onlineUsers.values()]);
      socket.emit('user joined', socket.data);
    }
  });

  // Recebe status de digitação dos usuários
  socket.on('user typing', (isTyping) => {
    if (isTyping) {
      socket.broadcast.emit('user typing', {
        userId: socket.id,
        username: socket.data.username,
      });
    } else {
      socket.broadcast.emit('user typing', false);
    }
  });
});

// Iniciando o servidor na porta especificada
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
