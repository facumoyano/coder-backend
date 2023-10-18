import ProductDBService from "../services/product/productDBService.js";

class ProductController {
  constructor() {
    this.productService = new ProductDBService();
  }

  getProducts = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort,
        category,
        available,
        title,
      } = req.query;
      const products = await this.productService.getProducts(
        page,
        limit,
        sort,
        category,
        available,
        "products",
        title
      );
      res.send(products);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error to get the Products");
    }
  };

  getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await this.productService.getProductById(productId);
      if (product) {
        res.send(product);
      } else {
        res.status(404).send("Product not found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error to get the Product");
    }
  };

  addProduct = async (req, res) => {
    const productData = req.body;
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.code ||
      !productData.stock ||
      !productData.category
    ) {
      res.status(400).send("Fields are missing");
      return;
    }

    try {
      const newProduct = await this.productService.addProduct(productData);
      res.status(201).send(newProduct);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error to save the Product");
    }
  };

  editProductById = async (req, res) => {
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
    try {
      const updatedProduct = await this.productService.updateProduct(productId, product);
      if (updatedProduct) {
        res.send(updatedProduct);
      } else {
        res.status(404).send("Product not found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error to update the Product");
    }
  };

  deleteProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
      const message = await this.productService.deleteProduct(productId);
      res.send(message);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error to delete the Product");
    }
  };
}

export default ProductController;
