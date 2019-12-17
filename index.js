const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'))

morgan.token('customToken', function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
    Object.entries(req.body).length !== 0 ? JSON.stringify(req.body) : ''
  ].join(' ')
});

app.use(morgan('customToken'));

app.get('/info', (req, res) => {
  res.send(
    `<div>PhoneBook has info for ${persons.length} people</div>
     <div>${new Date()}</div>`
  );
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name || !body.number) {
    return response.status(400).send({
      error: 'name or number missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON());
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
