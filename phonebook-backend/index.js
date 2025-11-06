const functions = require("firebase-functions");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req) => JSON.stringify(req.body));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/all-persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  response.json(`Phonebook has information for ${persons.length}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  if (id >= persons.length) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  return response.json(persons[id]);
});

const generateId = () => {
  const id = Math.random() * 1000;
  return String(id);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  // Check:
  // The name already exists in the phonebook
  const existingPerson = persons.find((person) => {
    person.name === body.name;
  });
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // The name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const id = request.params.id;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).end();
  }

  const updatedPerson = {
    id: person.id,
    name: body.name,
    number: body.number,
  };

  persons = persons.map((p) => (p.id === id ? updatedPerson : p));
  response.json(updatedPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).end();
  }

  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Export as Cloud Function
exports.api = functions.https.onRequest(app);

// For local development
const PORT = process.env.PORT || 3001;
if (require.main === module) {
  app.listen(PORT);
  console.log(`Server running on port ${PORT}`);
}
