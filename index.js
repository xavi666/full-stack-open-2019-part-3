const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
}

app.use(requestLogger);

const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));

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

// Get Persons
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
  .catch(error => next(error));
});
// Get Persons

// Get Person Method
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
// Get Person Method

// Post method
app.post('/api/persons', (request, response, next) => {
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
  })
  .catch(error => next(error))
});
// Post method

// Delete Method
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error))
});
// Delete Method

// Error Handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error);
}

app.use(errorHandler)
// Error Handler

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
