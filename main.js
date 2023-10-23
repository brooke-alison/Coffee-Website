// const search = document.querySelector(".search-box");
// const searchIcon = document.querySelector("#search-icon");
const header = document.querySelector("header");
const navbar = document.querySelector(".navbar");
const addToCart = document.querySelectorAll(".add-to-cart");
const cartIcon = document.querySelector("#cart-icon");
const shoppingCart = document.querySelector("#shopping-cart");
const cancelCart = document.querySelector("#close-cart");

let isShoppingCart = false;
const cart = [];

window.onscroll = () => {
  navbar.classList.remove("active");
  // search.classList.remove("active");
};

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

// document.querySelector("#search-icon").onclick = () => {
//   search.classList.toggle("active");
//   navbar.classList.remove("active");
// };

document.querySelector("#menu-icon").onclick = () => {
  navbar.classList.toggle("active");
  // search.classList.remove("active");
};

cartIcon.addEventListener("click", () => {
  shoppingCart.classList.toggle("show-cart");
  cartIcon.style.display = "none";
  isShoppingCart = true;
  // searchIcon.style.display = "none";

  if (shoppingCart.classList.contains("show-cart")) {
    shoppingCart.style.right = "0";
  }
});

cancelCart.addEventListener("click", () => {
  shoppingCart.classList.toggle("show-cart");
  cartIcon.style.display = "block";
  isShoppingCart = false;
  // searchIcon.style.display = "block";

  if (!shoppingCart.classList.contains("show-cart")) {
    shoppingCart.style.right = "-300px";
  }
});

document.addEventListener("click", (event) => {
  if (
    isShoppingCart == true &&
    event.target !== cartIcon &&
    event.target !== shoppingCart
  ) {
    let isClickInAddToCart = false;
    addToCart.forEach((element) => {
      if (element.contains(event.target)) {
        isClickInAddToCart = true;
      }
    });

    if (shoppingCart.classList.contains("show-cart")) {
      if (
        event.target !== shoppingCart &&
        event.target !== cartIcon &&
        !shoppingCart.contains(event.target) &&
        !isClickInAddToCart
      ) {
        closeShoppingCart();
      }
    }

    if (!isClickInAddToCart) {
      shoppingCart.classList.toggle("show-cart");
      cartIcon.style.display = "block";
      isShoppingCart = false;
      if (!shoppingCart.classList.contains("show-cart")) {
        shoppingCart.style.right = "-300px";
      }
    }
    if (!isClickInAddToCart && !event.target.classList.contains("trashcan")) {
      toggleShoppingCart();
    }
  }
});

document
  .querySelector("#cart-items")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("trashcan")) {
      event.stopPropagation();

      const cartItem = event.target.closest(".cart-box");
      if (cartItem) {
        const index = Array.from(cartItem.parentElement.children).indexOf(
          cartItem
        );
        console.log(index);
        removeCartItem(index);
      }
    }
  });

document
  .querySelector("#cart-items")
  .addEventListener("input", function (event) {
    if (event.target.classList.contains("cart-quantity")) {
      const cartBox = event.target.closest(".cart-box");
      const productTitle = cartBox.getAttribute("data-product-title");

      const product = cart.find((item) => item.title === productTitle);
      if (product) {
        product.quantity = parseInt(event.target.value, 10);
        quantityChange();
      }
    }
  });

function toggleShoppingCart() {
  if (!shoppingCart.classList.contains("show-cart")) {
    shoppingCart.classList.add("show-cart");
    cartIcon.style.display = "none";
    isShoppingCart = true;
    shoppingCart.style.right = "0";
  } else {
    shoppingCart.classList.remove("show-cart");
    cartIcon.style.display = "block";
    isShoppingCart = false;
    shoppingCart.style.right = "-300px";
  }
}

function closeShoppingCart() {
  shoppingCart.classList.remove("show-cart");
  cartIcon.style.display = "block";
  isShoppingCart = false;

  if (!shoppingCart.classList.contains("show-cart")) {
    shoppingCart.style.right = "-300px";
  }
}

function showToastNotification(message) {
  const toastNotification = document.getElementById("toast-notification");
  toastNotification.textContent = message;
  toastNotification.style.display = "block";

  setTimeout(() => {
    toastNotification.style.display = "none";
  }, 1000);
}

function addProductToCart(title, price, image) {
  const product = {
    title: title,
    price: parseFloat(price),
    image: image,
    quantity: 1,
  };

  const existingProduct = cart.find((item) => item.title === title);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push(product);
  }

  displayCart();
  showToastNotification("Item added to the cart");
}

function displayCart() {
  const cartContainer = document.querySelector("#cart-items");
  const totalElement = document.querySelector("#total");

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-box");
    cartItem.setAttribute("data-product-title", product.title);
    cartItem.innerHTML = `
      <img src="${product.image}" alt="" class="cart-img" />
      <div class="cart-detail">
        <div class="cart-product-title">${product.title}</div>
        <div class="cart-price">$${product.price.toFixed(2)}</div>
        <input type="number" value="${
          product.quantity
        }" class="cart-quantity" title="Quantity" min="1"/>
      </div>
      <div class="trashcan">
        <i class="bx bxs-trash-alt trashcan" title="Remove Item"></i>
      </div>
    `;

    cartContainer.appendChild(cartItem);

    total += product.price * product.quantity;
  });

  totalElement.innerText = `Total: $${total.toFixed(2)}`;
}

function removeCartItem(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    displayCart();
  }
}

function quantityChange() {
  const quantityInputs = document.querySelectorAll(".cart-quantity");
  let total = 0;

  for (let i = 0; i < quantityInputs.length; i++) {
    const newQuantity = parseInt(quantityInputs[i].value, 10);

    cart[i].quantity = newQuantity;

    total += cart[i].price * newQuantity;
  }

  const totalElement = document.querySelector("#total");
  totalElement.innerText = `Total: $${total.toFixed(2)}`;
}

function purchase() {
  if (cart.length == 0) {
    showToastNotification("Cart is empty");
    return;
  } else {
    showToastNotification("Purchased");
  }

  cart.length = 0;
  displayCart();
}

displayCart();
