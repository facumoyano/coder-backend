import { Router } from "express";
import ProductManager from "../dao/services/product/productDBService.js";
import Product from "../dao/models/productModel.js";

const router = Router();

router.get("/", async (req, res) => {
  const manager = new ProductManager();
  try {
    const { page = 1, limit = 10, sort, category, available, title } = req.query;
    const manager = new ProductManager();
    const products = await manager.getProducts(page, limit, sort, category, available, 'products', title );
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error to get the Products");
  }
});

router.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const manager = new ProductManager();
  try {
    const product = await manager.getProductById(productId);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error to get the Product");
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.stock ||
    !product.category
  ) {
    res.status(400).send("Fields are missing");
    return;
  }
  const newProduct = new Product({
    title: product.title,
    description: product.description,
    price: product.price,
    code: product.code,
    stock: product.stock,
    category: product.category,
    status: true,
  });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error to save the Product");
  }
});

router.put("/:pid", async (req, res) => {
  const product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.price ||
    !product.code ||
    !product.category
  ) {
    res.status(400).send("Fields are missing");
    return;
  }
  const productId = req.params.pid;
  const manager = new ProductManager();
  try {
    const updatedProduct = await manager.updateProduct(productId, product);
    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error to update the Product");
  }
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const manager = new ProductManager();
  try {
    const message = await manager.deleteProduct(productId);
    res.send(message);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error to delete the Product");
  }
});




export default router;
