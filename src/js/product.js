import {
  setLocalStorage,
  getLocalStorage,
  alertMessage,
  getParam,
  updateCartCount,
  loadHeaderFooter,
  breadcrumbs,
} from "./utils.mjs";
import { findProductById } from "./externalServices.mjs";
import productDetails from "./productDetail.mjs";

// added Team Activity 2
const productId = getParam("product");

// this loads the updateCartCount after the content is loaded
loadHeaderFooter().then(() => {
  updateCartCount();
});

// this fixes the error handling for the product detail page
async function loadProductDetails() {
  try {
    const product = await findProductById(productId);

    if (!product) {
      handleProductNotFound();
      return;
    }
    breadcrumbs([{name:"Product"}, {name: product.Category.toUpperCase(), location: `/product-list/index.html?category=${product.Category}`}, {name: product.NameWithoutBrand}]);
    // this is from the original Team Activity 2
    productDetails(productId);

    const addToCartBtn = document.getElementById("addToCart");
    addToCartBtn.classList.add("show");
    addToCartBtn.addEventListener("click", () => addProductToCart(product));
  } catch (error) {
    handleProductNotFound();
  }
}

function handleProductNotFound() {
  document.querySelector(".product-detail").innerHTML = `
    <p class="error-message">Sorry, the product you're looking for does not exist.</p>`;
  // ensure the Add to Cart button is hidden
  const addToCartBtn = document.getElementById("addToCart");
  addToCartBtn.classList.remove("show");
}
// this updates the cart-count
loadProductDetails().then(() => {
  updateCartCount();
});

// this may have to be moved to productDetail.mjs later - km
function addProductToCart(product) {
  product.Quantity = 1;

  let cartItems = getLocalStorage("so-cart") || [];

  if (!Array.isArray(cartItems)) {
    cartItems = [];
  } else {
    let selectedColor = product.Colors[0];
    if(document.querySelector("#productColors").innerHTML){
      const colorIndex = document.querySelector(".color-option.selected").dataset.colorIndex;
      if(colorIndex && product.Colors[colorIndex]){
        selectedColor = product.Colors[colorIndex];
      }
    }
    product.Color = selectedColor;
    const existingProduct = cartItems.find((item) => item.Id === product.Id && item.Color.ColorCode == product.Color.ColorCode);
    if (existingProduct) {
      cartItems = cartItems.filter((item) => item.Id !== product.Id && item.Color.ColorCode != product.Color.ColorCode);
      product.Quantity = (existingProduct.Quantity ?? 1) + 1;
    }
  }

  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  alertMessage(`${product.NameWithoutBrand} added to cart!`);
  // after it pushes the item, it updates the count w/out refreshing
  updateCartCount();
}
