import { Router } from "express";
import CartManager from "../dao/services/cart/cartDBService.js";

const router = Router();
const cartManager = new CartManager();

// Crear un carrito
router.post("/", async (_req, res) => {
   try {
      const cart = await cartManager.createCart();
      res.send(cart);
   } catch (error) {
     console.log(error)
      res.status(500).send("Error al crear el carrito");
   }
});

// Obtener carrito por id
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

// Obtener todos los carritos
router.get("/", async (_req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.send(carts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al obtener los carritos");
  }
});


// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
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

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const cart = await cartManager.removeProductFromCart(cartId, productId);
    res.status(200).send({
      success: true,
      message: "Producto eliminado del carrito",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al eliminar el producto del carrito");
  }
});

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  try {
    const cart = await cartManager.updateCart(cartId, products);
    res.send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar el carrito");
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const cart = await cartManager.updateProductQuantity(cartId, productId, quantity);
    res.send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al actualizar la cantidad del producto");
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    await cartManager.clearCart(cartId);
    res.send({
      success: true,
      message: "Carrito vaciado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al vaciar el carrito");
  }
});

export default router;