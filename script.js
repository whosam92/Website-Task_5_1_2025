// Variables
const cartItemsList = document.getElementById("cartItems");
const totalValueElement = document.getElementById("totalValue");

let cart = JSON.parse(localStorage.getItem("cart")) || []; //  saved cart
let totalValue = parseInt(localStorage.getItem("totalValue")) || 0;

// Initialize the cart display
function initializeCart() {
  cart.forEach((item) => addCartItemToDOM(item));
  totalValueElement.textContent = totalValue;
}

// Add item to cart and update local storage
function addToCart(itemName, itemPrice, itemImage) {
  const existingItem = cart.find((item) => item.name === itemName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: itemName,
      price: itemPrice,
      image: itemImage,
      quantity: 1,
    });
  }

  totalValue += itemPrice;
  updateLocalStorage();
  renderCart();
}

// Remove item from cart
function removeFromCart(itemName) {
  const itemToRemove = cart.find((item) => item.name === itemName);
  if (itemToRemove) {
    totalValue -= itemToRemove.price * itemToRemove.quantity;
    cart = cart.filter((item) => item.name !== itemName);
    updateLocalStorage();
    renderCart();
  }
}

// Increment quantity
function incrementQuantity(itemName) {
  const item = cart.find((item) => item.name === itemName);
  if (item) {
    item.quantity += 1;
    totalValue += item.price;
    updateLocalStorage();
    renderCart();
  }
}

// Decrement quantity
function decrementQuantity(itemName) {
  const item = cart.find((item) => item.name === itemName);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
    totalValue -= item.price;
    updateLocalStorage();
    renderCart();
  }
}

// Update local storage
function updateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("totalValue", totalValue);
}

// Render the cart in the DOM
function renderCart() {
  cartItemsList.innerHTML = "";
  cart.forEach((item) => addCartItemToDOM(item));
  totalValueElement.textContent = totalValue;
}

// Add cart item to the DOM
function addCartItemToDOM(item) {
  const listItem = document.createElement("li");
  listItem.className = "d-flex justify-content-between align-items-center mb-2";
  listItem.innerHTML = `
    <img src="${item.image}" alt="${
    item.name
  }" class="item-image" style="width: 50px; height: 50px; margin-right: 10px;" />
    <span class="item-info">${item.name} (x<span class="quantity">${
    item.quantity
  }</span>)</span>
    <div class="controls">
      <button class="btn btn-sm btn-secondary decrement" data-name="${
        item.name
      }">-</button>
      <button class="btn btn-sm btn-secondary increment" data-name="${
        item.name
      }">+</button>
      <span class="item-total">${item.price * item.quantity} JD</span>
      <button class="btn btn-sm btn-danger remove-item" data-name="${
        item.name
      }"><i class="fa-solid fa-circle-xmark"></i></button>
    </div>
  `;
  cartItemsList.appendChild(listItem);
}

// Event Listeners
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const itemName = button.getAttribute("data-name");
    const itemPrice = parseInt(button.getAttribute("data-price"));
    const itemImage = button.getAttribute("data-image");
    addToCart(itemName, itemPrice, itemImage);
  });
});

cartItemsList.addEventListener("click", (e) => {
  const itemName = e.target.getAttribute("data-name");

  if (e.target.classList.contains("remove-item")) {
    removeFromCart(itemName);
  } else if (e.target.classList.contains("increment")) {
    incrementQuantity(itemName);
  } else if (e.target.classList.contains("decrement")) {
    decrementQuantity(itemName);
  }
});

// Initialize on page load
initializeCart();
