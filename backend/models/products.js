const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
  },
  totoal: {
    type: Number,
  },
});

module.exports = mongoose.model("Products", ProductsSchema);
