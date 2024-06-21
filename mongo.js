const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://rshipejr:${password}@fullstackopenpart3.zxrdw2v.mongodb.net/phonebookContacts?retryWrites=true&w=majority&appName=FullStackOpenPart3`;

mongoose.set("strictQuery", false);

mongoose.connect(url);
console.log(url);
const contactSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
  name: process.argv[3],
  phoneNumber: process.argv[4],
});

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  console.log("Phonebook data:");
  Contact.find({}).then((result) => {
    console.log(result);
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  contact.save().then((result) => {
    console.log(
      `added ${contact.name} number ${contact.phoneNumber} added to phonebook`
    );
    mongoose.connection.close();
  });
}

/*
mongodb+srv://rshipejr:<password>@fullstackopenpart3.zxrdw2v.mongodb.net/?retryWrites=true&w=majority&appName=FullStackOpenPart3
*/
