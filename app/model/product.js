import mongoose from "mongoose";

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: Number,
    quantity: Number,
    stock: Number
  })
);

export default Product;
