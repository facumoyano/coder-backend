const socket = io();

document.addEventListener("DOMContentLoaded", setupPage);

function setupPage() {
  const productForm = document.getElementById("productForm");
  productForm.addEventListener("submit", handleProductSubmission);

  document.addEventListener("click", handleDeleteButtonClick);

  socket.on("productDeleted", handleProductDeletion);
}

async function handleProductSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    code: formData.get("code"),
    thumbnails: formData.getAll("thumbnails"),
  };

  try {
    const response = await fetch("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      const addedProduct = await response.json();
      appendProductToPage(addedProduct);
      event.target.reset();
    } else {
      console.error("Failed to add product.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function appendProductToPage(product) {
  const productContainer = document.querySelector(".product-container");
  const productDiv = createProductElement(product);
  productContainer.appendChild(productDiv);
}

function createProductElement(product) {
  const productDiv = document.createElement("div");
  productDiv.classList.add("product");
  productDiv.setAttribute("id", `product-${product.id}`);

  let thumbnailHTML = '';
  if (product.thumbnails && product.thumbnails[0]) {
    thumbnailHTML = `<img src="${product.thumbnails[0]}" alt="Product thumbnail">`;
  }

  productDiv.innerHTML = `
      ${thumbnailHTML}
      <p>Name: <span>${product.title}</span></p>
      <p>Price: <span>${product.price}</span></p>
      <p>Description: <span>${product.description}</span></p>
      <button class="delete-button" data-product-id="${product.id}">Delete</button>
    `;
  return productDiv;
}

async function handleDeleteButtonClick(event) {
  if (event.target.classList.contains("delete-button")) {
    const productId = event.target.getAttribute("data-product-id");
    try {
      const response = await fetch(`/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const message = await response.text();
        console.log(message);
      } else {
        console.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function handleProductDeletion(productId) {
  const productElement = document.getElementById(`product-${productId}`);
  if (productElement) {
    productElement.remove();
  }
}
