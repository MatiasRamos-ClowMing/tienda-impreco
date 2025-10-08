// Credenciales del usuario administrador (modo dios)
const ADMIN_CREDENTIALS = {
    email: 'admin@impreco.com',
    password: 'admin123'
};

// Verificar si el usuario está autenticado como admin
function verificarAutenticacion() {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin || isAdmin !== 'true') {
        window.location.href = 'login.html';
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Base de datos de productos en localStorage
let productos = JSON.parse(localStorage.getItem('productos')) || [
    {
        id: 1,
        nombre: 'Regalos empresariales',
        descripcion: 'Regalos empresariales personalizados',
        precio: 999.99,
        imagen: 'https://via.placeholder.com/300x200/c8b6e2/9b7ec4?text=Regalos+empresariales',
        stock: 10,
        disponible: true
    },
    {
        id: 2,
        nombre: 'Filamento PLA 1kg',
        descripcion: 'Filamento PLA de alta calidad, varios colores disponibles.',
        precio: 24.99,
        imagen: 'https://via.placeholder.com/300x200/ffb380/ff9966?text=Filamento+PLA',
        stock: 50,
        disponible: true
    },
    {
        id: 3,
        nombre: 'Kit de Herramientas',
        descripcion: 'Kit completo para mantenimiento de impresoras 3D.',
        precio: 49.99,
        imagen: 'https://via.placeholder.com/300x200/e6dff2/c8b6e2?text=Kit+de+Herramientas',
        stock: 0,
        disponible: false
    },
    {
        id: 4,
        nombre: 'Cama de Cristal',
        descripcion: 'Cama de cristal templado para mejor adherencia.',
        precio: 34.99,
        imagen: 'https://via.placeholder.com/300x200/ffe6d9/ffb380?text=Cama+de+Cristal',
        stock: 25,
        disponible: true
    }
];

// Guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Cargar productos en la tabla
function cargarProductos() {
    const tbody = document.getElementById('productosTable');
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id}</td>
            <td><img src="${producto.imagen}" alt="${producto.nombre}" class="product-img"></td>
            <td><strong>${producto.nombre}</strong></td>
            <td>${producto.descripcion}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>
                <span class="badge badge-stock ${producto.disponible ? 'badge-disponible' : 'badge-sin-stock'}">
                    ${producto.disponible ? 'Disponible' : 'Sin Stock'}
                </span>
            </td>
            <td>
                <button class="btn btn-action btn-edit btn-sm" onclick="editarProducto(${producto.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-action btn-stock btn-sm" onclick="toggleStock(${producto.id})" title="Cambiar Stock">
                    <i class="bi bi-box"></i>
                </button>
                <button class="btn btn-action btn-delete btn-sm" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    actualizarEstadisticas();
}

// Guardar producto (nuevo o editado)
function guardarProducto() {
    const id = document.getElementById('productId').value;
    const nombre = document.getElementById('productName').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const descripcion = document.getElementById('productDescription').value;
    const imagen = document.getElementById('productImage').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const disponible = document.getElementById('productAvailable').checked;
    
    if (!nombre || !precio || !descripcion || !imagen) {
        alert('Por favor, completa todos los campos');
        return;
    }
    
    if (id) {
        // Editar producto existente
        const index = productos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            productos[index] = {
                id: parseInt(id),
                nombre,
                descripcion,
                precio,
                imagen,
                stock,
                disponible: disponible && stock > 0
            };
        }
    } else {
        // Agregar nuevo producto
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({
            id: nuevoId,
            nombre,
            descripcion,
            precio,
            imagen,
            stock,
            disponible: disponible && stock > 0
        });
    }
    
    guardarProductos();
    cargarProductos();
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    limpiarFormulario();
    
    showAlert('Producto guardado exitosamente', 'success');
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Producto';
    document.getElementById('productId').value = producto.id;
    document.getElementById('productName').value = producto.nombre;
    document.getElementById('productPrice').value = producto.precio;
    document.getElementById('productDescription').value = producto.descripcion;
    document.getElementById('productImage').value = producto.imagen;
    document.getElementById('productStock').value = producto.stock;
    document.getElementById('productAvailable').checked = producto.disponible;
    
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

// Eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        guardarProductos();
        cargarProductos();
        showAlert('Producto eliminado exitosamente', 'success');
    }
}

// Cambiar estado de stock
function toggleStock(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    producto.disponible = !producto.disponible;
    if (!producto.disponible) {
        producto.stock = 0;
    }
    
    guardarProductos();
    cargarProductos();
    
    const mensaje = producto.disponible ? 'Producto marcado como disponible' : 'Producto marcado sin stock';
    showAlert(mensaje, 'info');
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('modalTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Agregar Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

// Actualizar estadísticas
function actualizarEstadisticas() {
    const total = productos.length;
    const enStock = productos.filter(p => p.disponible).length;
    const sinStock = productos.filter(p => !p.disponible).length;
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    
    document.getElementById('totalProductos').textContent = total;
    document.getElementById('productosStock').textContent = enStock;
    document.getElementById('productosSinStock').textContent = sinStock;
    document.getElementById('valorTotal').textContent = `$${valorTotal.toFixed(2)}`;
}

// Navegación entre secciones
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los links
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección correspondiente
            const sectionName = this.getAttribute('data-section');
            document.getElementById(`${sectionName}-section`).classList.add('active');
        });
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
            document.body.removeChild(alertDiv);
        }, 150);
    }, 3000);
}

// Base de datos de pedidos en localStorage
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [
    {
        id: 1001,
        cliente: {
            nombre: 'Juan Pérez',
            email: 'juan@email.com',
            telefono: '+1 234 567 890'
        },
        fecha: '2025-10-05',
        productos: [
            { nombre: 'Regalos empresariales', cantidad: 2, precio: 999.99 },
            { nombre: 'Filamento PLA 1kg', cantidad: 5, precio: 24.99 }
        ],
        total: 2124.93,
        estado: 'pendiente'
    },
    {
        id: 1002,
        cliente: {
            nombre: 'María García',
            email: 'maria@email.com',
            telefono: '+1 234 567 891'
        },
        fecha: '2025-10-06',
        productos: [
            { nombre: 'Kit de Herramientas', cantidad: 1, precio: 49.99 },
            { nombre: 'Cama de Cristal', cantidad: 2, precio: 34.99 }
        ],
        total: 119.97,
        estado: 'procesando'
    },
    {
        id: 1003,
        cliente: {
            nombre: 'Carlos López',
            email: 'carlos@email.com',
            telefono: '+1 234 567 892'
        },
        fecha: '2025-10-04',
        productos: [
            { nombre: 'Filamento PLA 1kg', cantidad: 10, precio: 24.99 }
        ],
        total: 249.90,
        estado: 'completado'
    },
    {
        id: 1004,
        cliente: {
            nombre: 'Ana Martínez',
            email: 'ana@email.com',
            telefono: '+1 234 567 893'
        },
        fecha: '2025-10-03',
        productos: [
            { nombre: 'Regalos empresariales', cantidad: 1, precio: 999.99 }
        ],
        total: 999.99,
        estado: 'cancelado'
    }
];

let filtroActual = 'todos';

// Guardar pedidos en localStorage
function guardarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Cargar pedidos en la tabla
function cargarPedidos() {
    const tbody = document.getElementById('pedidosTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const pedidosFiltrados = filtroActual === 'todos' 
        ? pedidos 
        : pedidos.filter(p => p.estado === filtroActual);
    
    pedidosFiltrados.forEach(pedido => {
        const tr = document.createElement('tr');
        const cantidadProductos = pedido.productos.reduce((sum, p) => sum + p.cantidad, 0);
        
        tr.innerHTML = `
            <td><strong>#${pedido.id}</strong></td>
            <td>${pedido.cliente.nombre}</td>
            <td>${formatearFecha(pedido.fecha)}</td>
            <td>${cantidadProductos} item(s)</td>
            <td><strong>$${pedido.total.toFixed(2)}</strong></td>
            <td>
                <span class="badge badge-pedido badge-${pedido.estado}">
                    ${obtenerTextoEstado(pedido.estado)}
                </span>
            </td>
            <td>
                <button class="btn btn-action btn-sm" style="background-color: var(--violeta-pastel); color: white;" 
                        onclick="verDetallePedido(${pedido.id})" title="Ver Detalles">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-action btn-sm btn-edit" 
                        onclick="cambiarEstadoPedido(${pedido.id})" title="Cambiar Estado">
                    <i class="bi bi-arrow-repeat"></i>
                </button>
                <button class="btn btn-action btn-sm btn-delete" 
                        onclick="eliminarPedido(${pedido.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    actualizarEstadisticasPedidos();
}

// Filtrar pedidos por estado
function filtrarPedidos(estado) {
    filtroActual = estado;
    cargarPedidos();
}

// Ver detalle del pedido
function verDetallePedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    document.getElementById('detallePedidoId').textContent = pedido.id;
    document.getElementById('detalleCliente').textContent = pedido.cliente.nombre;
    document.getElementById('detalleEmail').textContent = pedido.cliente.email;
    document.getElementById('detalleTelefono').textContent = pedido.cliente.telefono;
    document.getElementById('detalleFecha').textContent = formatearFecha(pedido.fecha);
    document.getElementById('detalleEstado').innerHTML = `<span class="badge badge-pedido badge-${pedido.estado}">${obtenerTextoEstado(pedido.estado)}</span>`;
    document.getElementById('detalleTotal').textContent = `$${pedido.total.toFixed(2)}`;
    
    const tbody = document.getElementById('detalleProductos');
    tbody.innerHTML = '';
    
    pedido.productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td><strong>$${(producto.cantidad * producto.precio).toFixed(2)}</strong></td>
        `;
        tbody.appendChild(tr);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('detallePedidoModal'));
    modal.show();
}

// Cambiar estado del pedido
function cambiarEstadoPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    const estados = ['pendiente', 'procesando', 'completado', 'cancelado'];
    const estadoActualIndex = estados.indexOf(pedido.estado);
    const nuevoEstado = estados[(estadoActualIndex + 1) % estados.length];
    
    pedido.estado = nuevoEstado;
    guardarPedidos();
    cargarPedidos();
    
    showAlert(`Estado del pedido #${id} cambiado a: ${obtenerTextoEstado(nuevoEstado)}`, 'info');
}

// Eliminar pedido
function eliminarPedido(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        pedidos = pedidos.filter(p => p.id !== id);
        guardarPedidos();
        cargarPedidos();
        showAlert('Pedido eliminado exitosamente', 'success');
    }
}

// Actualizar estadísticas de pedidos
function actualizarEstadisticasPedidos() {
    const pendientes = pedidos.filter(p => p.estado === 'pendiente').length;
    const procesando = pedidos.filter(p => p.estado === 'procesando').length;
    const completados = pedidos.filter(p => p.estado === 'completado').length;
    const totalVentas = pedidos
        .filter(p => p.estado === 'completado')
        .reduce((sum, p) => sum + p.total, 0);
    
    const elemPendientes = document.getElementById('pedidosPendientes');
    const elemProcesando = document.getElementById('pedidosProcesando');
    const elemCompletados = document.getElementById('pedidosCompletados');
    const elemTotalVentas = document.getElementById('totalVentas');
    
    if (elemPendientes) elemPendientes.textContent = pendientes;
    if (elemProcesando) elemProcesando.textContent = procesando;
    if (elemCompletados) elemCompletados.textContent = completados;
    if (elemTotalVentas) elemTotalVentas.textContent = `$${totalVentas.toFixed(2)}`;
}

// Formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Obtener texto del estado
function obtenerTextoEstado(estado) {
    const textos = {
        'pendiente': 'Pendiente',
        'procesando': 'En Proceso',
        'completado': 'Completado',
        'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación (comentado para desarrollo)
    // verificarAutenticacion();
    
    // Cargar productos
    cargarProductos();
    
    // Cargar pedidos
    cargarPedidos();
    
    // Configurar navegación
    setupNavigation();
    
    // Limpiar formulario al cerrar modal
    document.getElementById('addProductModal').addEventListener('hidden.bs.modal', limpiarFormulario);
});
