const express = require('express');
const cors = require('cors');
const md5 = require('md5');
const fs = require('fs');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const usersDB = require('./data/users.json');

const port = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  let user;
  Object.values(usersDB).forEach((userRecord) => {
    if (
      username &&
      userRecord.username === username &&
      password &&
      userRecord.passwordHash === md5(password)
    ) {
      const { id, username, firstName, lastName } = userRecord;
      user = { id, username, fullName: `${firstName} ${lastName}` };
    }
  });

  if (!user) {
    return res.status(403).json({
      status: 'error',
      error: 'Unable to authenticate user'
    });
  }

  res.status(200).json(user);
});

app.get('/users', (req, res) => {
  const users = Object.values(usersDB)
    .map((userRecord) => {
      const { id, username, firstName, lastName } = userRecord;
      if (firstName !== 'Test') {
        return { id, username, fullName: `${firstName} ${lastName}` };
      }
    })
    .filter(Boolean);

  res.status(200).json({ users });
});

app.get('/messages', (req, res) => {
  fs.readFile('./data/messages.json', 'utf8', (readErr, data) => {
    if (readErr) {
      console.log('Error reading messages database');
    } else {
      res.status(200).json({ messages: JSON.parse(data) });
    }
  });
});

io.on('connection', (socket) => {
  socket.emit('connection', null);
  // NOTE: For the sake of keeping complexity low I'm making this a single channel chat
  // between two users only. Ideally would handle two-way chat between any two users.
  socket.on('send-message', (message) => {
    fs.readFile('./data/messages.json', 'utf8', (readErr, data) => {
      if (readErr) {
        console.log('Error reading messages database');
      } else {
        const messages = JSON.parse(data);
        messages.push(message);
        fs.writeFile(
          './data/messages.json',
          JSON.stringify(messages),
          (writeErr) => {
            if (writeErr) {
              console.log('Error writing messages database');
            }
          }
        );

        io.emit('messages-stream', messages);
      }
    });
  });
});
