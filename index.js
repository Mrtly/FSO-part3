const express = require("express");
const app = express();

const port = 3001;
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter(person => person.id === id);
  
  if (person.length < 1) {
    res.status(404).json({
      error: `Person with the id ${id} doesn't exist in the database`
    });
  } else {
    res.json(person[0]);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.filter(person => person.id === id);
  
  if (person.length < 1) {
    res.status(404).json({
      error: `Person with the id ${id} doesn't exist in the database`
    });
  } else {
    persons = persons.filter(person => person.id !== id);
    res.json([person[0]]);
  }
})

app.get("/info", (req, res) => {
  res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.listen(port, () => {
  console.log(`App runing on port ${port}`);
});