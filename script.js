document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cart-list");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    let cart = [];
    let removedItems = [];

    // Fetch Cart Data from API
    async function fetchCartData() {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
            const data = await response.json();
            cart = data.items;
            mergeRemovedItems();
            updateCartDisplay();
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    // Merge Removed Items Back Into Cart
    function mergeRemovedItems() {
        removedItems = JSON.parse(localStorage.getItem("removedItems")) || [];
        removedItems.forEach((item) => {
            if (!cart.some((cartItem) => cartItem.id === item.id)) {
                cart.push(item);
            }
        });
        removedItems = [];
        localStorage.removeItem("removedItems");
    }

    // Update Cart Display
    function updateCartDisplay() {
        cartList.innerHTML = "";
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = (item.price / 100) * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                    <div class="quantity-container">
                        <button class="decrease-qty" data-index="${index}">➖</button>
                        <span class="cart-qty">${item.quantity}</span>
                        <button class="increase-qty" data-index="${index}">➕</button>
                    </div>
                    <p>Subtotal: ₹${itemTotal.toFixed(2)}</p>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartList.appendChild(cartItem);
        });

        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`;
        saveCartToLocalStorage();
    }

    // Handle Quantity Increase & Decrease
    cartList.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (event.target.classList.contains("increase-qty")) {
            cart[index].quantity++;
        } else if (event.target.classList.contains("decrease-qty")) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        }
        updateCartDisplay();
    });

    // Handle Item Removal
    cartList.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.dataset.index;
            removedItems.push(cart[index]);
            localStorage.setItem("removedItems", JSON.stringify(removedItems));
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    // Save Cart Data to Local Storage
    function saveCartToLocalStorage() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Load Cart Data from Local Storage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            cart = JSON.parse(storedCart);
            mergeRemovedItems();
            updateCartDisplay();
        } else {
            fetchCartData();
        }
    }

    // Handle Checkout
    checkoutBtn.addEventListener("click", () => {
        alert("Proceeding to checkout...");
    });

    // Initialize Cart
    loadCartFromLocalStorage();
});
