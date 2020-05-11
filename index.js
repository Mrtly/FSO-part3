require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors');
const db = require("./mongo");
db.connect();

const Person = require("./models/person");

const PORT = process.env.PORT || 3001;


const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectJd") {
    return res.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" });
};

morgan.token("content", req => {
  console.log(req.body);
  if (!req.body) return "";
  return JSON.stringify(req.body);
});

app.use(bodyParser.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);
app.use(cors());
app.use(express.static('build'));

app.get("/api/persons", (req, res) => {
  Person.find({}).then(docs => {
    res.json(docs);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  
  Person.findById(id)
    .then(personDoc => {
      if (personDoc) {
        res.json(personDoc.toJSON());
      } else {
        res.status(204).end();
      }
    })
    .catch(err => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  const person = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(doc => {
      if (doc) {
        res.json(doc.toJSON());
      } else {
        res.status(204).end();
      }
    })
    .catch(err => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then(personDoc => {
      if (personDoc) {
        res.json(personDoc.toJSON());
      } else {
        res.status(204).end();
      }
    })
    .catch(err => next(err));
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      error: "missing name"
    });
  }
  if (!req.body.number) {
    return res.status(400).json({
      error: "missing number"
    });
  }

  const person = new Person({
    name: req.body.name, 
    number: req.body.number, 
  });

  person
  .save()
  .then(personDoc => {
    res.json(personDoc.toJSON());
  })
  .catch(err => next(err));
});

app.get("/info", (req, res) => {
 Person.count({}).then(personsLength => {
   res.send(`
   <p>phonebook has info for ${personsLength} people</p>
   <p>${new Date()}</p>
   `);
 });
});

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App runing on port ${PORT}`);
});