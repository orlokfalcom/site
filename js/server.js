const express = require('express');
const app = express();
const path = require('path');
const { join } = path;
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

let messages = [];
let connectionsInfo = {
  connections: 0
};

io.on('connection', socket => {
  server.getConnections((err, count) => {
    if (err) {
      console.error('Error getting connections count:', err);
      return;
    }
    connectionsInfo.connections = count;
    io.emit('ConnectionsInfo', connectionsInfo);
  });

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });

  socket.on('disconnect', () => {
    server.getConnections((err, count) => {
      if (err) {
        console.error('Error getting connections count:', err);
        return;
      }
      connectionsInfo.connections = count;
      io.emit('ConnectionsInfo', connectionsInfo);
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
