const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let persons = [
  {
    "name": "enric granados",
    "number": "21312312312",
    "id": 2
  },
  {
    "name": "Vicente Ferrer",
    "number": "9869696969",
    "id": 6
  },
  {
    "name": "Aitor Tilla",
    "number": "98666666",
    "id": 7
  },
  {
    "name": "Miquel Marti i Pol",
    "number": "9898989",
    "id": 10
  }
];

app.get('/info', (req, res) => {
  res.send(
    `<div>PhoneBook has info for ${persons.length} people</div>
     <div>${new Date()}</div>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
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

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
