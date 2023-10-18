import { Router } from "express";
import CartController from "../dao/controllers/cartController.js";

const router = Router();
const controller = new CartController();

// Crear un carrito
router.post("/", controller.addNewCart);

// Obtener carrito por id
router.get("/:cid", controller.getCartById);

// Obtener todos los carritos
router.get("/", controller.getCarts);


// Agregar un producto al carrito
router.post("/:cid/products/:pid", controller.addProductToCart);

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", controller.deleteProductFromCart);

// Actualizar el carrito con un arreglo de productos
router.put("/:cid", controller.updateCart);

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", controller.updateQtyOfProductFromCart);

// Eliminar todos los productos del carrito
router.delete("/:cid", controller.deleteAllProductsFromCart);

export default router;