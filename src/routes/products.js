import { Router } from "express";
import ProductManager from "../ProductManager.js";

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

  res.send(products);
});

router.get("/:pid", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const productId = parseInt(req.params.pid, 10);
  try {
    const product = manager.getProductById(productId);
    res.send(product);
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
});

router.post("/", (req, res) => {
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
    res.send(addedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:pid", (req, res) => {
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

  const productId = parseInt(req.params.pid, 10);
  try {
    const message = manager.updateProduct(productId, product);
    res.send(message);
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
});

router.delete("/:pid", (req, res) => {
  const manager = new ProductManager("products.json");
  manager.loadFromFile();

  const productId = parseInt(req.params.pid, 10);
  try {
    const message = manager.deleteProduct(productId);
    res.send(message);
  } catch (error) {
    res.status(404).send("Producto no encontrado");
  }
});

export default router;
