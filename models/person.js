const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});
personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);