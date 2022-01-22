module.exports = mongoose => {
    const Entry = mongoose.model(
        "entry",
        mongoose.Schema({
            tasks: [{
                task: String,
                done: Boolean
            }]
        })
    );
  
    return Entry;
  };