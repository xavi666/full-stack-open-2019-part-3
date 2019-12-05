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

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
