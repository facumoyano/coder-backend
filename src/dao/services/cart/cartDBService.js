import Cart from "../../models/cartModel.js";

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

  async getCartById(id) {
    try {
      const cart = await Cart.findById(id);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(id, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(id);
      if (cart) {
        const productInCart = cart.products.find(p => p.productId.toString() === productId);
  
        if (productInCart) {
          productInCart.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
  
        await cart.save();
        return cart;
      } else {
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartDBService;
