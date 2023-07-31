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
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const existingProduct = this.products.find((p) => p.code === product.code);
    if (existingProduct) {
      console.log("Ya existe un producto con el mismo código");
      return;
    }

    const newProduct = {
      ...product,
      id: this.nextId++,
    };
    this.products.push(newProduct);
    console.log("Producto agregado:", newProduct);
    this.saveToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      console.log(`Producto con id ${id} eliminado`);

      this.saveToFile();
    } else {
      console.log("Producto no encontrado");
    }
  }
}

export default ProductManager;

const manager = new ProductManager("products.json");

manager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10,
  thumbnail: "url1",
  code: "ABC123",
  stock: 5,
});

manager.addProduct({
  title: "Producto 2",
  description: "Descripción del producto 2",
  price: 20,
  thumbnail: "url2",
  code: "DEF456",
  stock: 10,
});

manager.addProduct({
  title: "Producto 3",
  description: "Descripción del producto 3",
  price: 30,
  thumbnail: "url3",
  code: "GHI789",
  stock: 15,
});
