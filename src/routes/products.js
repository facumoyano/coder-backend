import { Router } from "express";
import ProductManager from "../dao/services/product/productDBService.js";
import Product from "../dao/models/productModel.js";

const router = Router();

router.get("/", (req, res) => {
  const manager = new ProductManager();
  manager
    .getProducts()
    .then((products) => res.send(products))
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al cargar los productos");
    });
});

router.get("/:pid", (req, res) => {
  const productId = parseInt(req.params.pid, 10);
  const manager = new ProductManager();

  manager
    .getProductById(productId)
    .then((product) => {
      if (product) {
        res.send(product);
      } else {
        res.status(404).send("Producto no encontrado");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al obtener el producto");
    });
});

router.post("/", (req, res) => {
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

  const newProduct = new Product({
    title: product.title,
    description: product.description,
    price: product.price,
    code: product.code,
    stock: product.stock,
    category: product.category,
    status: true,
  });

  newProduct
    .save()
    .then((savedProduct) => {
      res.status(201).send(savedProduct);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al guardar el producto");
    });
});

router.put("/:pid", (req, res) => {
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

  const productId = req.params.pid;
  const manager = new ProductManager();

  manager
    .updateProduct(productId, product)
    .then((updatedProduct) => {
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        res.status(404).send("Producto no encontrado");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al actualizar el producto");
    });
});

router.delete("/:pid", (req, res) => {
  const productId = req.params.pid;
  const manager = new ProductManager();

  manager
    .deleteProduct(productId)
    .then((message) => {
      res.send(message);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("Error al eliminar el producto");
    });
});

export default router;
