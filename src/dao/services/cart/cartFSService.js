import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
  constructor(filePath) {
    this.path = path.join(__dirname, filePath);
    this.carts = [];
    this.nextId = 1;
    this.createFileIfNotExists();
    this.loadFromFile();
  }

  createFileIfNotExists() {
    try {
      fs.accessSync(this.path, fs.constants.F_OK);
    } catch (err) {
      fs.writeFileSync(this.path, "[]");
    }
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.nextId = this.carts[this.carts.length - 1].id + 1;
      }
    } catch (error) {
      this.carts = [];
    }
  }

  saveToFile() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, data);
    console.log("Datos de carritos guardados en", this.path);
  }

  createCart() {
    const cart = {
      id: this.nextId++,
      products: [],
    };
    this.carts.push(cart);
    this.saveToFile();
    return cart;
  }

  getCartById(cartId) {
    return this.carts.find((cart) => cart.id === cartId);
  }

  addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product === productId
    );
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity }); // Guardar el producto con su cantidad
    }

    this.saveToFile();

    return cart;
  }
}

export default CartManager;
