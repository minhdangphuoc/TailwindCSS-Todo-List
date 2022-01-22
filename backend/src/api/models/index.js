const dbConfig = {
    url: "mongodb://mongodb:27017/t04-todo"
};

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.entries = require("./entry.model.js")(mongoose);

module.exports = db;