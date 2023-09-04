import Product from "../../models/productModel.js";

class ProductDBService {
  async addProduct(product) {
    try {
      const existingProduct = await Product.findOne({ code: product.code });
      if (existingProduct) {
        return "Ya existe un producto con el mismo código";
      }

      const newProduct = new Product({
        ...product,
        status: true,
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);

      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (product) {
        return `Producto con id ${id} eliminado`;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await Product.findByIdAndUpdate(id, productData, { new: true });
      if (product) {
        return product;
      } else {
        throw new Error("Producto no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductDBService;
