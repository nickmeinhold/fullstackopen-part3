const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
const redactedUrl = url
  ? url.replace(/(mongodb(?:\+srv)?:\/\/)([^:@]+):([^@]+)@/, "$1***:***@")
  : undefined;

console.log("mongoose readyState at startup:", mongoose.connection.readyState);
console.log("connecting to", redactedUrl || "<MONGODB_URI not set>");

mongoose.connection.on("connected", () => console.log("mongoose event: connected"));
mongoose.connection.on("open", () => console.log("mongoose event: open"));
mongoose.connection.on("error", (err) => console.error("mongoose event: error", err.message));
mongoose.connection.on("disconnected", () => console.log("mongoose event: disconnected"));

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
