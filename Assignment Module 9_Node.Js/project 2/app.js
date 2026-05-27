const express = require('express');
const app = express();
const path = require('path');

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set up the views directory
app.set('views', path.join(__dirname, 'views'));

// Set up middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Set up the messages array
const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date()
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date()
  }
];

// Set up the index route
app.get('/', (req, res) => {
  res.render('index', { title: 'Mini Messageboard', messages: messages });
});

// Set up the new message form route
app.get('/new', (req, res) => {
  res.render('form');
});

// Handle form submissions
app.post('/new', (req, res) => {
  const message = {
    text: req.body.messageText,
    user: req.body.messageUser,
    added: new Date()
  };
  messages.push(message);
  res.redirect('/');
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running at http://localhost:8080');
});