// Cargar productos desde localStorage
function cargarProductosWeb() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const productosContainer = document.querySelector('#productos .row.g-4');
    
    if (!productosContainer) return;
    
    // Limpiar productos existentes
    productosContainer.innerHTML = '';
    
    // Filtrar solo productos disponibles
    const productosDisponibles = productos.filter(p => p.disponible);
    
    if (productosDisponibles.length === 0) {
        productosContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox" style="font-size: 4rem; color: var(--violeta-pastel);"></i>
                <h3 class="mt-3">No hay productos disponibles</h3>
                <p class="text-muted">Pronto agregaremos nuevos productos</p>
            </div>
        `;
        return;
    }
    
    // Crear tarjetas de productos
    productosDisponibles.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        
        col.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <div class="mt-auto">
                        <p class="h4 text-primary mb-3">$${producto.precio.toFixed(2)}</p>
                        ${producto.stock > 0 
                            ? `<button class="btn btn-primary w-100" onclick="agregarAlCarrito(${producto.id})">
                                <i class="bi bi-cart-plus"></i> Añadir al carrito
                               </button>`
                            : `<button class="btn btn-secondary w-100" disabled>
                                <i class="bi bi-x-circle"></i> Sin Stock
                               </button>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        productosContainer.appendChild(col);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        showAlert('Producto no encontrado', 'error');
        return;
    }
    
    if (producto.stock <= 0) {
        showAlert('Producto sin stock', 'warning');
        return;
    }
    
    // Obtener carrito actual
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        // Verificar que no exceda el stock
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
        } else {
            showAlert('No hay más stock disponible', 'warning');
            return;
        }
    } else {
        // Agregar nuevo producto al carrito
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    showAlert(`${producto.nombre} agregado al carrito`, 'success');
    
    // Actualizar contador del carrito
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    updateCartCount(totalItems);
}

// Verificar y mostrar usuario logueado
function mostrarUsuarioLogueado() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || localStorage.getItem('isAdmin');
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn && userName) {
        // Buscar el botón de "Iniciar Sesión"
        const loginButton = document.querySelector('a[href="login.html"]');
        
        if (loginButton) {
            // Reemplazar el botón de login con el nombre del usuario
            loginButton.innerHTML = `
                <i class="bi bi-person-circle me-1"></i>
                <span>${userName}</span>
            `;
            loginButton.href = '#';
            loginButton.classList.remove('btn-outline-light');
            loginButton.classList.add('btn-outline-light', 'user-logged');
            
            // Agregar menú desplegable al hacer clic
            loginButton.addEventListener('click', function(e) {
                e.preventDefault();
                mostrarMenuUsuario(this);
            });
        }
    }
}

// Mostrar menú de usuario
function mostrarMenuUsuario(button) {
    const existingMenu = document.querySelector('.user-dropdown-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const isAdmin = localStorage.getItem('isAdmin');
    const userEmail = localStorage.getItem('userEmail');
    
    const menu = document.createElement('div');
    menu.className = 'user-dropdown-menu';
    menu.innerHTML = `
        <div class="user-menu-header">
            <i class="bi bi-person-circle"></i>
            <div>
                <strong>${localStorage.getItem('userName')}</strong>
                <small>${userEmail}</small>
            </div>
        </div>
        <hr>
        ${isAdmin ? '<a href="admin.html"><i class="bi bi-speedometer2"></i> Panel Admin</a>' : ''}
        <a href="mis-pedidos.html"><i class="bi bi-box-seam"></i> Mis Pedidos</a>
        <a href="carrito.html"><i class="bi bi-cart"></i> Mi Carrito</a>
        <hr>
        <a href="#" onclick="cerrarSesion()"><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</a>
    `;
    
    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(menu);
    
    // Cerrar menú al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== button) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    showAlert('Sesión cerrada exitosamente', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Inicializar tooltips de Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos desde localStorage
    cargarProductosWeb();
    
    // Mostrar usuario logueado
    mostrarUsuarioLogueado();
    
    // Inicializar tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Actualizar contador del carrito
    updateCartCount();

    // Añadir funcionalidad de búsqueda
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});

// Función para actualizar el contador del carrito
function updateCartCount(total = null) {
    const cartCount = document.querySelector('.badge.bg-danger');
    if (cartCount) {
        if (total !== null) {
            cartCount.textContent = total;
        } else {
            // Cargar desde localStorage
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
            cartCount.textContent = totalItems;
        }
    }
}

// Función para mostrar notificaciones
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 150);
    }, 3000);
}

// Smooth scrolling para los enlaces del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Función para manejar la búsqueda de productos
function handleSearch(event) {
    event.preventDefault();
    
    const searchInput = event.target.querySelector('input[type="search"]');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        showAlert('Por favor, ingresa un término de búsqueda', 'warning');
        return;
    }
    
    // Obtener todas las tarjetas de productos
    const productCards = document.querySelectorAll('#productos .card');
    let foundProducts = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        const productDescription = card.querySelector('.card-text').textContent.toLowerCase();
        
        // Verificar si el término de búsqueda está en el nombre o descripción
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.parentElement.style.display = 'block';
            foundProducts++;
        } else {
            card.parentElement.style.display = 'none';
        }
    });
    
    // Scroll a la sección de productos
    const productSection = document.querySelector('#productos');
    if (productSection) {
        productSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Mostrar mensaje según los resultados
    if (foundProducts === 0) {
        showAlert(`No se encontraron productos con "${searchTerm}"`, 'info');
    } else {
        showAlert(`Se encontraron ${foundProducts} producto(s)`, 'success');
    }
}

// Función para resetear la búsqueda (mostrar todos los productos)
function resetSearch() {
    const productCards = document.querySelectorAll('#productos .card');
    productCards.forEach(card => {
        card.parentElement.style.display = 'block';
    });
}
