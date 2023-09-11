import { Router } from "express";
import ProductManager from "../dao/services/product/productDBService.js";
import CartManager from "../dao/services/cart/cartDBService.js";
import { io } from "../app.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("home");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, available, title } = req.query;
    const manager = new ProductManager();
    const result = await manager.getProducts(page, limit, sort, category, available, 'products', title);
  
    res.render("products", { result });
  } catch (error) {
    console.log(error)
  }
});

router.get("/products/:pid", async (req, res) => {
  const manager = new ProductManager();
  const product = await manager.getProductById(req.params.pid);
  res.render("product", { product });
});

router.get("/carts/:cid", async (req, res) => {
  const manager = new CartManager();
  const cart = await manager.getCartById(req.params.cid);
  res.render("cart", { cart });
});

const messages = [];

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, available } = req.query;
    const manager = new ProductManager();
    const result = await manager.getProducts(page, limit, sort, category, available, 'realtimeproducts');
  
    res.render("realTimeProducts", { result });
  } catch (error) {
    console.log(error)
  }
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
