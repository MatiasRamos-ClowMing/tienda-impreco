// Obtener carrito desde localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

// Guardar carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar contador del carrito en el badge
function actualizarBadgeCarrito() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

// Cargar productos del carrito
function cargarCarrito() {
    const carrito = obtenerCarrito();
    const carritoVacio = document.getElementById('carritoVacio');
    const carritoConProductos = document.getElementById('carritoConProductos');
    
    if (carrito.length === 0) {
        carritoVacio.style.display = 'block';
        carritoConProductos.innerHTML = '';
        actualizarResumen();
        return;
    }
    
    carritoVacio.style.display = 'none';
    carritoConProductos.innerHTML = '';
    
    carrito.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-img">
            <div class="carrito-item-info">
                <div class="carrito-item-titulo">${item.nombre}</div>
                <div class="carrito-item-precio">$${item.precio.toFixed(2)} c/u</div>
            </div>
            <div class="carrito-item-cantidad">
                <div class="cantidad-control">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">
                        <i class="bi bi-dash"></i>
                    </button>
                    <input type="number" class="cantidad-input" value="${item.cantidad}" readonly>
                    <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
                <div class="mt-2">
                    <strong>Subtotal: $${(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})" title="Eliminar">
                <i class="bi bi-trash"></i>
            </button>
        `;
        carritoConProductos.appendChild(itemDiv);
    });
    
    actualizarResumen();
}

// Cambiar cantidad de un producto
function cambiarCantidad(index, cambio) {
    const carrito = obtenerCarrito();
    
    if (carrito[index]) {
        carrito[index].cantidad += cambio;
        
        // No permitir cantidad menor a 1
        if (carrito[index].cantidad < 1) {
            carrito[index].cantidad = 1;
        }
        
        // Verificar stock disponible
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const producto = productos.find(p => p.id === carrito[index].id);
        
        if (producto && carrito[index].cantidad > producto.stock) {
            showAlert(`Solo hay ${producto.stock} unidades disponibles`, 'warning');
            carrito[index].cantidad = producto.stock;
        }
        
        guardarCarrito(carrito);
        cargarCarrito();
        actualizarBadgeCarrito();
    }
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    if (confirm('¿Deseas eliminar este producto del carrito?')) {
        const carrito = obtenerCarrito();
        carrito.splice(index, 1);
        guardarCarrito(carrito);
        cargarCarrito();
        actualizarBadgeCarrito();
        showAlert('Producto eliminado del carrito', 'info');
    }
}

// Vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        localStorage.removeItem('carrito');
        cargarCarrito();
        actualizarBadgeCarrito();
        showAlert('Carrito vaciado', 'info');
    }
}

// Actualizar resumen del pedido
function actualizarResumen() {
    const carrito = obtenerCarrito();
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidadItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Calcular envío (gratis si es mayor a $50)
    const envio = subtotal >= 50 ? 0 : 10;
    const total = subtotal + envio;
    
    // Actualizar elementos del DOM
    document.getElementById('cantidadItems').textContent = cantidadItems;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = envio === 0 ? 'GRATIS' : `$${envio.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Procesar compra
function procesarCompra() {
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        showAlert('El carrito está vacío', 'warning');
        return;
    }
    
    // Verificar stock antes de procesar
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    let stockSuficiente = true;
    
    for (let item of carrito) {
        const producto = productos.find(p => p.id === item.id);
        if (!producto || producto.stock < item.cantidad) {
            showAlert(`Stock insuficiente para ${item.nombre}`, 'error');
            stockSuficiente = false;
            break;
        }
    }
    
    if (!stockSuficiente) return;
    
    // Crear pedido
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 50 ? 0 : 10;
    const total = subtotal + envio;
    
    const nuevoPedido = {
        id: pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1001,
        cliente: {
            nombre: 'Cliente Web',
            email: 'cliente@email.com',
            telefono: '+1 234 567 890'
        },
        fecha: new Date().toISOString().split('T')[0],
        productos: carrito.map(item => ({
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        })),
        total: total,
        estado: 'pendiente'
    };
    
    // Actualizar stock de productos
    carrito.forEach(item => {
        const productoIndex = productos.findIndex(p => p.id === item.id);
        if (productoIndex !== -1) {
            productos[productoIndex].stock -= item.cantidad;
            if (productos[productoIndex].stock <= 0) {
                productos[productoIndex].disponible = false;
                productos[productoIndex].stock = 0;
            }
        }
    });
    
    // Guardar cambios
    pedidos.push(nuevoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.setItem('productos', JSON.stringify(productos));
    
    // Mostrar modal de confirmación
    document.getElementById('numeroPedido').textContent = `#${nuevoPedido.id}`;
    const modal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    modal.show();
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    
    // Recargar después de cerrar el modal
    document.getElementById('confirmacionModal').addEventListener('hidden.bs.modal', function () {
        window.location.href = 'index.html';
    });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(alertDiv)) {
                document.body.removeChild(alertDiv);
            }
        }, 150);
    }, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarCarrito();
    actualizarBadgeCarrito();
    
    // Botón procesar compra
    document.getElementById('btnProcesarCompra').addEventListener('click', procesarCompra);
    
    // Botón vaciar carrito
    document.getElementById('btnVaciarCarrito').addEventListener('click', vaciarCarrito);
});
