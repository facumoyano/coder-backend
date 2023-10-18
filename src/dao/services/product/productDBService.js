import { url } from "../../../utils/constants.js";
import Product from "../../models/productModel.js";

class ProductDBService {
  async addProduct(productData) {
    try {
      const existingProduct = await Product.findOne({ code: productData.code });
      if (existingProduct) {
        throw new Error("A product with the same code already exists");
      }

      const newProduct = new Product({
        ...productData,
        status: true,
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


  async getProducts(page = 1, limit = 10, sort, category, available, urlPath, title) {
    try {
      const options = {
        page,
        limit,
        sort: sort === 'desc' ? { price: -1 } : sort === 'asc' ? { price: 1 } : {},
        lean: true,
      };
  
      const query = {
        ...(category && { category }),
        ...(available !== undefined && { status: available }),
        ...(title && { title: { $regex: new RegExp(title, 'i') } }),
      };
  
      const result = await Product.paginate(query, options);

      const response = {
        status: result.docs.length > 0 ? 'success' : 'error',
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${url}${urlPath}?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `${url}${urlPath}?page=${result.nextPage}` : null
      };

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error)
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);

      if (product) {
        return product;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (product) {
        return `Product with id ${id} deleted`;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
      if (product) {
        return product;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductDBService;
