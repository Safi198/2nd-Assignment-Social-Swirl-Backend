const mongoose = require("mongoose");

const mongoUri = "mongodb://127.0.0.1:27017/CrudOperationSwirlProjectA2";

mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected with Mongodb");
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
        process.exit(1);
    });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Mongodb connection error:"));

module.exports = db;
