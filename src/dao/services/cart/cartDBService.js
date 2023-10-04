import Cart from "../../models/cartModel.js";
import userModel from "../../models/userModel.js";

class CartDBService {
  async createCart() {
    try {
      const newCart = new Cart({
        timestamp: Date.now(),
        products: [],
      });

      await newCart.save();
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllCarts() {
    try {
      const carts = await Cart.find().populate('products');
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(userId, id, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(id);
      if (cart) {
        const productInCart = cart.products.find(
          (p) => p.productId.toString() === productId
        );

        if (productInCart) {
          productInCart.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }

        await cart.save();
        return cart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (cart) {
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productId
        );
        await cart.save();
        return cart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (cart) {
        cart.products = products;
        await cart.save();
        return cart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (cart) {
        const productInCart = cart.products.find(
          (p) => p.productId.toString() === productId
        );
        if (productInCart) {
          productInCart.quantity = quantity;
          await cart.save();
        } else {
          throw new Error("Product not found in cart");
        }
        return cart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      if (cart) {
        cart.products = [];
        await cart.save();
        return cart;
      } else {
        throw new Error("Cart not found");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartDBService;
