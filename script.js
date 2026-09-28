// Product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 1999,
        image: "⌚"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 2499,
        image: "👟"
    },
    {
        id: 4,
        name: "Backpack",
        price: 999,
        image: "🎒"
    },
    {
        id: 5,
        name: "Smartphone",
        price: 15999,
        image: "📱"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 799,
        image: "🕶️"
    }
];

let cart = [];

// Get HTML elements
const productList = document.getElementById("productList");
const cartCount = document.getElementById("cartCount");
const cartBtn = document.getElementById("cartBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Display products
function displayProducts() {
    productList.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <button class="add-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productList.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    cart.push(product);

    updateCart();
}

// Update cart
function updateCart() {
    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <span>${item.image} ${item.name}</span>
            <span>₹${item.price}</span>
            <button onclick="removeFromCart(${index})">❌</button>
        `;

        cartItems.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    cartTotal.textContent = total;
}

// Remove product
function removeFromCart(index) {
    cart.splice(index, 1);

    updateCart();
}

// Open cart
cartBtn.addEventListener("click", () => {
    checkoutModal.style.display = "flex";
});

// Close cart
closeModal.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});

// Close modal when clicking outside
checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
        checkoutModal.style.display = "none";
    }
});

// Checkout
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("🎉 Checkout successful! Thank you for shopping.");

    cart = [];

    updateCart();

    checkoutModal.style.display = "none";
});

// Start app
displayProducts();
updateCart();