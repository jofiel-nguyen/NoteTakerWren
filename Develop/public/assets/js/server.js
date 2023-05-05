const express = require('express');
const rateLimit = require('express-rate-limit');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API routes
let notes = [];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };
  notes.push(newNote);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  notes = notes.filter((note) => note.id !== req.params.id);
  res.json({ msg: 'Note deleted' });
});

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Apply rate limiting to the /notes route
app.get('/notes', limiter, (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
