import { Router } from "express";
import ProductManager from "../dao/services/product/productDBService.js";
import { io } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
  const manager = new ProductManager();

  const { limit } = req.query;
  let products = await manager.getProducts();
  products = products.map(product => product.toObject());

  if (limit) {
    const limitValue = parseInt(limit, 10);
    products = products.slice(0, limitValue);
  }

  res.render("home", { products });
});

const messages = [];

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/realtimeproducts", async (req, res) => {
  const manager = new ProductManager();

  const { limit } = req.query;
  let products = await manager.getProducts();
  products = products.map(product => product.toObject());

  if (limit) {
    const limitValue = parseInt(limit, 10);
    products = products.slice(0, limitValue);
  }

  res.render("realTimeProducts", { products });
});

router.post("/products", async (req, res) => {
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
  const manager = new ProductManager();

  const newProduct = {
    ...product,
    status: true,
  };

  try {
    const addedProduct = await manager.addProduct(newProduct);
    io.emit("newProduct", addedProduct);
    res.status(201).send(addedProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/products/:pid", (req, res) => {
    const manager = new ProductManager();
  
    const productId = req.params.pid;
    try {
      const message = manager.deleteProduct(productId);
      io.emit("productDeleted", productId);
      res.send(message);
    } catch (error) {
      res.status(404).send("Producto no encontrado");
    }
  });

export default router;
