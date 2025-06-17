// --- Datos de Productos (puedes expandir esta lista) ---
const products = [
    { id: 1, name: 'Fernet Branca + Coca Cola', price: 8000.00, image: 'images/fernet.jpg' },
    { id: 2, name: 'Gin Tonic', price: 8000.00, image: 'images/gintonic.jpg' },
    { id: 3, name: 'Cuba Libre', price: 8000.00, image: 'images/cuba.jpg' },
    { id: 4, name: 'Whiscola', price: 8000.00, image: 'images/whiscola1.jpg' },
    { id: 5, name: 'Vodka + Speed', price: 8000.00, image: 'images/vodka1.jpg' },
    { id: 6, name: 'Jagger + Speed o Sprite', price: 11000.00, image: 'images/jagger.jpg' },
    { id: 7, name: 'Gin Tonic Premiun', price: 11000.00, image: 'images/tonicpre.jpg' },
    { id: 8, name: 'Jack Daniels + Coca o Speed', price: 11000.00, image: 'images/jack1.jpg' },
    { id: 9, name: 'Absolut + Jugo o Speed', price: 11000.00, image: 'images/absolut.jpg' },
    { id: 10, name: 'Johnnie Walker + Coca o Speed', price: 11000.00, image: 'images/johnnie.jpg' }, ];

let cart = []; // Array para almacenar los productos en el carrito

// --- Carrusel de Imágenes ---
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlides(n) {
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }
    slides.forEach((slide, index) => {
        slide.style.display = (index === slideIndex) ? 'block' : 'none';
    });
}

function moveSlide(n) {
    showSlides(slideIndex += n);
}

// Iniciar el carrusel
showSlides(slideIndex);
setInterval(() => moveSlide(1), 3000); // Cambia de imagen cada 5 segundos

// --- Cargar Productos en la Sección de Pedido ---
const productGrid = document.querySelector('.product-grid');

function loadProducts() {
    productGrid.innerHTML = ''; // Limpiar productos existentes
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productGrid.appendChild(productItem);
    });
}

// --- Funcionalidades del Carrito de Compras ---
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }
}

// Funciones para aumentar/disminuir cantidad
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        renderCart();
    }
}

function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartTotalAmount.textContent = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>Precio: $<span>${item.price.toFixed(2)}</span></p>
            </div>
            <div class="quantity-control">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <input type="number" value="${item.quantity}" min="1" readonly>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        total += item.price * item.quantity;
    });
    cartTotalAmount.textContent = total.toFixed(2);
}

// --- Envío del Pedido por WhatsApp ---
const orderForm = document.getElementById('order-form');
// const sendOrderButton = document.getElementById('send-order-button'); // No es necesario si se usa el evento submit del formulario

orderForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const name = document.getElementById('name').value;
//    const address = document.getElementById('address').value;
//    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de enviar el pedido.');
        return;
    }

    // Validar campos del formulario
    if (!name || !paymentMethod) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
    }

    let orderDetails = `¡Hola TRAGO EXPRESS! Soy ${name} y me gustaría hacer un pedido:\n\n`;
    // orderDetails += `Dirección de entrega: ${address}\n`;
    // orderDetails += `Teléfono de contacto: ${phone}\n\n`;
    orderDetails += `--- Detalle del Pedido ---\n`;

    let totalOrderPrice = 0;
    cart.forEach(item => {
        // Incluir la imagen del producto en el mensaje de WhatsApp es complejo y no es soportado directamente por la API de WhatsApp para texto.
        // Podrías enviar la URL de la imagen si tuvieras un servidor que la alojara.
        // Por ahora, solo enviaremos el texto.
        orderDetails += `- ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
        totalOrderPrice += item.price * item.quantity;
    });

    orderDetails += `\nTotal a Pagar: $${totalOrderPrice.toFixed(2)}\n\n`;
    orderDetails += `Método de Pago: ${paymentMethod === 'cash' ? 'Efectivo' :
                                       paymentMethod === 'transfer' ? 'Transferencia Bancaria' :
                                       paymentMethod === 'credit-card' ? 'Tarjeta de Crédito' :
                                       'Tarjeta de Débito'}\n\n`;
    orderDetails += `¡Gracias!`;

    // Número de WhatsApp (reemplaza con tu número de teléfono de WhatsApp, ej. '5491112345678')
    const whatsappNumber = '5493644717120';

    // Codificar el mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(orderDetails);

    // Abrir WhatsApp con el mensaje predefinido
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    // Mostrar mensaje de agradecimiento y limpiar el carrito/formulario
    const thankYouMessage = document.createElement('div');
    thankYouMessage.id = 'thank-you-message';
    thankYouMessage.innerHTML = `
        <h3>¡Gracias por tu pedido, ${name}!</h3>
        <p>En breve nos pondremos en contacto contigo para confirmar.</p>
        <p>Tu pedido se ha enviado a TRAGO EXPRESS vía WhatsApp.</p>
    `;
    // Asegurarse de que el mensaje se agregue al contenedor principal (main)
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.appendChild(thankYouMessage);
    }
    thankYouMessage.style.display = 'block';

    // Opcional: limpiar el carrito y el formulario después de enviar el pedido
    cart = [];
    renderCart();
    orderForm.reset();
    document.getElementById('payment-method').value = ''; // Limpiar el select
    
    // Desplazarse al mensaje de agradecimiento
    thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        thankYouMessage.style.display = 'none'; // Ocultar el mensaje después de un tiempo
        thankYouMessage.remove(); // Eliminar el elemento del DOM
    }, 10000); // 10 segundos
});


// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderCart(); // Asegurarse de que el carrito se renderice vacío al inicio
    showSlides(slideIndex); // Asegura que el carrusel se muestre al cargar
});
