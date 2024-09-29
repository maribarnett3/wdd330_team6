import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  // checks if cart is empty
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<li>Your cart is empty</li>";
    return;
  }

  // this is what adds the item to the cart
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  const htmlItems = cartArray.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
 </li>`;

  return newItem;
}

renderCartContents();
