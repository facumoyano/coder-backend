import { Router } from "express";
import CartManager from "../dao/services/cart/cartDBService.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (_req, res) => {
   try {
      const cart = await cartManager.createCart();
      res.send(cart);
   } catch (error) {
     console.log(error)
      res.status(500).send("Error al crear el carrito");
   }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  try {
    const cart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.send(cart);
  } catch (error) {
    res.status(404).send("Carrito no encontrado");
  }
});

export default router;