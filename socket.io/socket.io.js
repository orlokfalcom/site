const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html');
});

let messages = [];
let connectionsInfo = {
  connections: 0
};

// Function to update connections info
const updateConnectionsInfo = () => {
  return new Promise((resolve, reject) => {
    server.getConnections((err, count) => {
      if (err) {
        console.error('Error getting connections count:', err);
        reject(err);
      } else {
        connectionsInfo.connections = count;
        resolve(count);
      }
    });
  });
};

io.on('connection', async socket => {
  try {
    await updateConnectionsInfo();
    io.emit('ConnectionsInfo', connectionsInfo);
  } catch (err) {
    console.error('Error updating connections info:', err);
  }

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data);
    socket.broadcast.emit('receivedMessage', data);
  });

  socket.on('disconnect', async () => {
    try {
      await updateConnectionsInfo();
      io.emit('ConnectionsInfo', connectionsInfo);
    } catch (err) {
      console.error('Error updating connections info on disconnect:', err);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
