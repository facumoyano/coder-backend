import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductManager {
  constructor(filePath) {
    this.path = path.join(__dirname, filePath);
    this.products = [];
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
      this.products = JSON.parse(data);
      if (this.products.length > 0) {
        this.nextId = this.products[this.products.length - 1].id + 1;
      }
    } catch (error) {
      this.products = [];
    }
  }

  saveToFile() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data);
    console.log("Datos guardados en", this.path);
  }

  addProduct(product) {
    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      return "Ya existe un producto con el mismo código";
    }

    const newProduct = {
      ...product,
      id: this.nextId++,
    };
    this.products.push(newProduct);
    this.saveToFile();

    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveToFile();
      return `Producto con id ${id} eliminado`;
    } else {
      throw new Error("Producto no encontrado");
    }
  }

  updateProduct(id, product) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      const updatedProduct = {
        ...product,
        id,
      };
      this.products[productIndex] = updatedProduct;
      this.saveToFile();
      return `Producto con id ${id} actualizado`;
    } else {
      throw new Error("Producto no encontrado");
    }
  }
}

export default ProductManager;
