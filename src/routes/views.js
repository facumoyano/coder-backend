import { Router } from "express";
import ProductManager from "../dao/services/product/productDBService.js";
import CartManager from "../dao/services/cart/cartDBService.js";
import { io } from "../app.js";
import logged from '../middlewares/logged.js'
import auth from '../middlewares/auth.js'

const router = Router();

router.get("/", auth, async (req, res) => {
  res.render("home", {
    user: req.session.user
  });
});

router.get("/products", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort,
      category,
      available,
      title,
    } = req.query;
    const manager = new ProductManager();
    const result = await manager.getProducts(
      page,
      limit,
      sort,
      category,
      available,
      "products",
      title
    );
    if (page > result.totalPages || isNaN(page)) {
      res.render("error", { error: "Page not found" });
      return;
    }

    res.render("products", { result });
  } catch (error) {
    console.log(error);
  }
});

router.get("/products/:pid", auth, async (req, res) => {
  try {
    const manager = new ProductManager();
    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      res.render("error", { error: "Product not found" });
      return;
    }
    res.render("product", { product });
  } catch (error) {
    console.log(error);
  }
});

router.get("/carts/:cid", auth, async (req, res) => {
  try {
    const manager = new CartManager();
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      res.render("error", { error: "Cart not found" });
      return;
    }
    res.render("cart", { cart });
  } catch (error) {
    console.log(error);
  }
});

const messages = [];

router.get("/chat", auth, (req, res) => {
  res.render("chat");
});

router.get("/realtimeproducts", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, category, available } = req.query;
    const manager = new ProductManager();
    const result = await manager.getProducts(
      page,
      limit,
      sort,
      category,
      available,
      "realtimeproducts"
    );

    if (page > result.totalPages || isNaN(page)) {
      res.render("error", { error: "Page not found" });
      return;
    }

    res.render("realTimeProducts", { result });
  } catch (error) {
    console.log(error);
  }
});

router.post("/products", auth, async (req, res) => {
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

router.delete("/products/:pid", auth, (req, res) => {
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

router.get("/login", logged, async (req,res) => {
  res.render('login', {
    loginFailed: req.session.loginFailed ?? false,
    registerSuccess: req.session.registerSuccess ?? false
  })
})

router.get("/register", logged, async (req, res) => {
  console.log(req.session)
  res.render("register", {
    registerFailed: req.session.registerFailed ?? false,
  });
});

export default router;
