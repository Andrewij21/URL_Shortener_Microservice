const { model, Schema } = require("mongoose");

const schema = new Schema({
  original_url: String,
  short_url: Number,
});

module.exports = model("Url", schema);
