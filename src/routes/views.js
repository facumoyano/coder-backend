import { Router } from "express";
import ProductManager from "../ProductManager.js";
import { io } from "../app.js";

const router = Router();

router.get("/", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const { limit } = req.query;
  let products = manager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit, 10);
    products = products.slice(0, limitValue);
  }

  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const { limit } = req.query;
  let products = manager.getProducts();

  if (limit) {
    const limitValue = parseInt(limit, 10);
    products = products.slice(0, limitValue);
  }

  res.render("realTimeProducts", { products });
});

router.post("/products", (req, res) => {
  const product = req.body;

  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.stock ||
    !product.category
  ) {
    res.status(400).send("Faltan datos");
    return;
  }
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const newProduct = {
    ...product,
    status: true,
  };

  try {
    const addedProduct = manager.addProduct(newProduct);
    io.emit("newProduct", addedProduct);
    res.status(201).send(addedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/products/:pid", (req, res) => {
    const manager = new ProductManager("products.json");
    manager.loadFromFile();
  
    const productId = parseInt(req.params.pid, 10);
    try {
      const message = manager.deleteProduct(productId);
      io.emit("productDeleted", productId);
      res.send(message);
    } catch (error) {
      res.status(404).send("Producto no encontrado");
    }
  });

export default router;
