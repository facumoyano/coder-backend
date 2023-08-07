import { Router } from "express";
import CartManager from "../CartManager.js";

const router = Router();
const cartManager = new CartManager('carts.json');

router.post("/", (_req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.send(newCart);
  } catch (error) {
    res.status(500).send("Error al crear el carrito");
  }
});

router.get("/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.send(cart.products);
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid, 10);
  const productId = parseInt(req.params.pid, 10);
  const quantity = parseInt(req.body.quantity, 10) || 1;

  try {
    const cart = cartManager.addProductToCart(cartId, productId, quantity);
    res.send(cart);
  } catch (error) {
    res.status(404).send("Carrito no encontrado");
  }
});

export default router;