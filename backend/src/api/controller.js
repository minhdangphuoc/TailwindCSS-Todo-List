const db = require("./models");
const Entry = db.entries;

// Create and Save a new Entry
exports.create = (req, res) => {
    // Validate request
    if (!req.body.tasks) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create an array of Entries
    let list = [];
    for (let i in req.body.tasks) {
        list.push({
            task: req.body.tasks[i].task,
            done: req.body.tasks[i].done
        });
    }
    const entry = new Entry({
        tasks: list
    });

    // Save Entry in the database and respond with id
    entry
        .save(entry)
        .then(data => {
            res.send(data._id);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while saving the entry in database."
            });
        });

};

// Find a single Entry with an id
exports.findOne = (req, res) => {
    // id of list from request
    const id = req.params.id;

    // Find and respond with list
    Entry.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found list with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving list with id=" + id });
    });
};

// Update a Entry by the id in the request
exports.update = (req, res) => {
    // Validate request
    if (!req.body.tasks) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // id of list from request
    const id = req.params.id;

    // Find list by id and put new one in place of it
    const new_entry = {
        tasks: req.body.tasks
    };
    Entry.findByIdAndUpdate(id, new_entry, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update list with id=${id}. Maybe list was not found!`
        });
      } else res.send({ message: "List was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating list with id=" + id
      });
    });
};