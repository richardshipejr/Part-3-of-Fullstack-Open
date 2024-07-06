require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const Contact = require("./models/contact");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

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
    // console.log(contacts);
    response.json(contacts);
  });
});

//number of contacts
app.get("/info", (request, response) => {
  Contact.countDocuments({})
    .then((result) => {
      response.send(`<p>You have ${result} contacts</p>`);
    })
    .catch((error) => next(error));
});

//look up specific contact
app.get("/api/contacts/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//delete a contact
app.delete("/api/contacts/:id", (request, response, next) => {
  const id = request.params.id;

  // used for mock data before adding mongodb
  // contacts = contacts.filter(
  //   (contact) => contact.id.toString() !== searchedId.toString()
  // );
  Contact.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: "Contact not found" });
      }
    })
    .catch((error) => next(error));
});

// old code used for 'unique' id's before adding in mongo
// const generateId = () => {
//   const maxId =
//     contacts.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/contacts", (request, response, next) => {
  const body = request.body;

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: "name missing" });
  } else {
    const contact = new Contact({
      name: body.name,
      number: body.number,
    });
    contact
      .save()
      .then((savedContact) => {
        response.json(savedContact);
      })
      .catch((error) => next(error));
  }
});

app.put("/api/contacts/:id", (request, response, next) => {
  if (request.params.id === undefined) {
    response.status(400).json({ error: "Missing id in request" });
  } else {
    const contact = { number: request.body.number };

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
      .then((updatedContact) => {
        response.json(updatedContact);
      })
      .catch((error) => next(error));
  }

  // const contactToEdit = contacts.find(
  //   (contact) => contact.id.toString() === request.params.id.toString()
  // );

  //if we find a contact to edit then do stuff
  // if (contactToEdit) {
  //   const updatedContactInfo = {
  //     id: contactToEdit.id,
  //     name: contactToEdit.name,
  //     number: body.number,
  //   };
  //   const targetContact = contacts.indexOf(contactToEdit);
  //   contacts.splice(targetContact, 1, updatedContactInfo);
  //   // response.status(201).json({ message: "contact number updated" });
  //   response.json(contacts);
  // } else {
  //   response.status(404).json({
  //     message: "unable to find contact to edit",
  //   });
  // }
});

const PORT = process.env.PORT;

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

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
