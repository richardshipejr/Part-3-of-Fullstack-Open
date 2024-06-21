require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Contact = require("./models/contact");
const cors = require("cors");

// const mongoose = require("mongoose");
// const password = process.argv[2];
// console.log(process.argv);
// console.log("password", password);
// console.log("password", process.argv);

// const url = `mongodb+srv://rshipejr:${password}@fullstackopenpart3.zxrdw2v.mongodb.net/phonebookContacts?retryWrites=true&w=majority&appName=FullStackOpenPart3`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url);

// const contactSchema = new mongoose.Schema({
//   name: String,
//   phoneNumber: String,
// });

// const Contact = mongoose.model("Contact", contactSchema);

app.use(cors());
app.use(express.json());
// app.use(express.static("dist"));

app.use(morgan("tiny"));

// let contacts = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

//root
app.get("/", (request, response) => {
  response.send("<h1>hello world</h1>");
});

//list all contacts
app.get("/api/contacts", (request, response) => {
  Contact.find({}).then((contacts) => {
    console.log(contacts);
    response.json(contacts);
  });
});

const now = new Date();

const time = now.toLocaleString();

//number of contacts
app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${contacts.length} people</p>
  <br/>
  <p>${time}</p>
  `);
});

//look up specific contact
app.get("/api/contacts/:id", (request, response) => {
  Contact.findById(request.params.id).then((contact) => {
    response.json(contact);
  });
});

//delete a contact
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

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    response.json(savedContact);
  });
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

const PORT = process.env.PORT;

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
