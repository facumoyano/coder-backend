class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
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
}

const manager = new ProductManager();

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

const allProducts = manager.getProducts();
console.log("Productos:", allProducts);

const product1 = manager.getProductById(1);
console.log("Producto 1:", product1);

const product3 = manager.getProductById(3);
