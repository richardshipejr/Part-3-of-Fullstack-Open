const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body.name);
  } else {
    return "";
  }
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Nestor Kimbabwe</h1>");
});

app.get("/api/contacts", (request, response) => {
  response.json(contacts);
});

const now = new Date();

const time = now.toLocaleString();

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people</p>
  <br/>
  <p>${time}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const searchedId = request.params.id;
  const searchedContact = contacts.find(
    (contact) => contact.id.toString() === searchedId
  );
  if (searchedContact === undefined) {
    return response.status(400).json({
      error: "contact missing",
    });
  }
  response.json(searchedContact);
});

app.delete("/api/persons/:id", (request, response) => {
  const searchedId = request.params.id;
  contacts = contacts.filter(
    (contact) => contact.id.toString() !== searchedId.toString()
  );
  console.log(contacts);
  response.send("successfully deleted!");
});

const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).send("Name is required");
  }

  contacts = contacts.concat(body);
  response.json(contacts);
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const http = require("http");

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(contacts));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log("Server is running!");
