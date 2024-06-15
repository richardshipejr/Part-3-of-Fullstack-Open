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

app.get("/api/contacts/:id", (request, response) => {
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

app.delete("/api/contacts/:id", (request, response) => {
  const searchedId = request.params.id;
  contacts = contacts.filter(
    (contact) => contact.id.toString() !== searchedId.toString()
  );
  response.send("successfully deleted!");
});

const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/contacts", (request, response) => {
  const body = request.body;
  if (!body.number || !body.name) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(contact);
  response.json(contacts);
});

app.put("/api/contacts/:id", (request, response) => {
  const body = request.body;

  const contactToEdit = contacts.find(
    (contact) => contact.id.toString() === request.params.id.toString()
  );

  //if we find a contact to edit then do stuff
  if (contactToEdit) {
    const updatedContactInfo = {
      id: contactToEdit.id,
      name: contactToEdit.name,
      number: body.number,
    };
    const targetContact = contacts.indexOf(contactToEdit);
    contacts.splice(targetContact, 1, updatedContactInfo);
    // response.status(201).json({ message: "contact number updated" });
    response.json(contacts);
  } else {
    response.status(404).json({
      message: "unable to find contact to edit",
    });
  }
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
