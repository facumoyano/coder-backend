import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();

app.get("/products", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const { limit } = req.query;
  let products = manager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit, 10);
    products = products.slice(0, limitValue);
  }

  res.send(products);
});

app.get("/products/:pid", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const productId = parseInt(req.params.pid, 10);
  const product = manager.getProductById(productId);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
