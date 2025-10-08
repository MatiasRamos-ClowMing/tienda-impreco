// Empresas de envío disponibles
const empresasEnvio = {
    'correo-argentino': {
        nombre: 'Correo Argentino',
        url: 'https://www.correoargentino.com.ar/formularios/e-tracking',
        logo: 'https://via.placeholder.com/80x40/0066cc/ffffff?text=Correo+AR'
    },
    'andreani': {
        nombre: 'Andreani',
        url: 'https://www.andreani.com/#!/personas/tracking',
        logo: 'https://via.placeholder.com/80x40/ff6600/ffffff?text=Andreani'
    },
    'oca': {
        nombre: 'OCA',
        url: 'https://www.oca.com.ar/seguimiento',
        logo: 'https://via.placeholder.com/80x40/00aa00/ffffff?text=OCA'
    }
};

// Generar número de seguimiento aleatorio
function generarNumeroSeguimiento(empresa) {
    const prefijos = {
        'correo-argentino': 'CA',
        'andreani': 'AN',
        'oca': 'OC'
    };
    const prefijo = prefijos[empresa] || 'XX';
    const numero = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `${prefijo}${numero}`;
}

// Obtener pedidos del localStorage
function obtenerPedidos() {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    
    // Agregar información de envío si no existe
    pedidos = pedidos.map(pedido => {
        if (!pedido.envio) {
            const empresas = Object.keys(empresasEnvio);
            const empresaAleatoria = empresas[Math.floor(Math.random() * empresas.length)];
            
            pedido.envio = {
                empresa: empresaAleatoria,
                numeroSeguimiento: generarNumeroSeguimiento(empresaAleatoria),
                estadoEnvio: obtenerEstadoEnvio(pedido.estado)
            };
        }
        return pedido;
    });
    
    // Guardar cambios
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    return pedidos;
}

// Obtener estado de envío según el estado del pedido
function obtenerEstadoEnvio(estadoPedido) {
    const estados = {
        'pendiente': 'Preparando pedido',
        'procesando': 'En camino al centro de distribución',
        'completado': 'Entregado',
        'cancelado': 'Cancelado'
    };
    return estados[estadoPedido] || 'En proceso';
}

// Cargar pedidos en la página
function cargarPedidos() {
    const pedidos = obtenerPedidos();
    const listaPedidos = document.getElementById('listaPedidos');
    
    if (pedidos.length === 0) {
        listaPedidos.innerHTML = `
            <div class="sin-pedidos">
                <i class="bi bi-inbox"></i>
                <h3>No tienes pedidos aún</h3>
                <p class="text-muted">Cuando realices una compra, tus pedidos aparecerán aquí</p>
                <a href="index.html#productos" class="btn btn-primary btn-lg mt-3">
                    <i class="bi bi-shop me-2"></i>Ir a la tienda
                </a>
            </div>
        `;
        return;
    }
    
    // Ordenar pedidos por fecha (más recientes primero)
    pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    listaPedidos.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const empresaInfo = empresasEnvio[pedido.envio.empresa];
        const card = document.createElement('div');
        card.className = 'pedido-card';
        
        card.innerHTML = `
            <div class="pedido-header">
                <div>
                    <div class="pedido-numero">#${pedido.id}</div>
                    <div class="pedido-fecha">
                        <i class="bi bi-calendar3 me-2"></i>${formatearFecha(pedido.fecha)}
                    </div>
                </div>
                <span class="pedido-estado estado-${pedido.estado}">
                    ${obtenerTextoEstado(pedido.estado)}
                </span>
            </div>
            
            <div class="pedido-info">
                <div class="info-item">
                    <i class="bi bi-box-seam"></i>
                    <div class="info-item-content">
                        <h6>Productos</h6>
                        <p>${pedido.productos.length} item(s)</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="bi bi-currency-dollar"></i>
                    <div class="info-item-content">
                        <h6>Total</h6>
                        <p>$${pedido.total.toFixed(2)}</p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="bi bi-truck"></i>
                    <div class="info-item-content">
                        <h6>Empresa de Envío</h6>
                        <p>${empresaInfo.nombre}</p>
                    </div>
                </div>
            </div>
            
            ${pedido.estado !== 'cancelado' ? `
                <div class="seguimiento-box">
                    <div class="seguimiento-empresa">
                        <img src="${empresaInfo.logo}" alt="${empresaInfo.nombre}" class="empresa-logo">
                        <div>
                            <small class="text-muted">Número de seguimiento</small>
                            <div class="seguimiento-numero">${pedido.envio.numeroSeguimiento}</div>
                        </div>
                    </div>
                    <p class="mb-0">
                        <i class="bi bi-geo-alt me-2"></i>
                        <strong>Estado:</strong> ${pedido.envio.estadoEnvio}
                    </p>
                </div>
            ` : ''}
            
            <div class="pedido-actions">
                <button class="btn btn-primary" onclick="verDetallePedido(${pedido.id})">
                    <i class="bi bi-eye me-2"></i>Ver Detalles
                </button>
                ${pedido.estado !== 'cancelado' ? `
                    <a href="${empresaInfo.url}" target="_blank" class="btn btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right me-2"></i>Rastrear Envío
                    </a>
                ` : ''}
                <button class="btn btn-outline-secondary" onclick="descargarFactura(${pedido.id})">
                    <i class="bi bi-download me-2"></i>Descargar Factura
                </button>
            </div>
        `;
        
        listaPedidos.appendChild(card);
    });
}

// Buscar pedido por número
function buscarPedido() {
    const input = document.getElementById('buscarPedidoInput').value.trim();
    
    if (!input) {
        showAlert('Por favor ingresa un número de pedido', 'warning');
        return;
    }
    
    // Remover el # si existe
    const numeroPedido = parseInt(input.replace('#', ''));
    
    if (isNaN(numeroPedido)) {
        showAlert('Número de pedido inválido', 'error');
        return;
    }
    
    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === numeroPedido);
    
    if (pedido) {
        verDetallePedido(numeroPedido);
    } else {
        showAlert('Pedido no encontrado', 'error');
    }
}

// Ver detalle del pedido en modal
function verDetallePedido(pedidoId) {
    const pedidos = obtenerPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (!pedido) {
        showAlert('Pedido no encontrado', 'error');
        return;
    }
    
    const empresaInfo = empresasEnvio[pedido.envio.empresa];
    
    // Llenar información del modal
    document.getElementById('modalPedidoId').textContent = pedido.id;
    document.getElementById('modalFecha').textContent = formatearFecha(pedido.fecha);
    document.getElementById('modalEstado').innerHTML = `<span class="pedido-estado estado-${pedido.estado}">${obtenerTextoEstado(pedido.estado)}</span>`;
    document.getElementById('modalTotal').textContent = `$${pedido.total.toFixed(2)}`;
    document.getElementById('modalEmpresa').textContent = empresaInfo.nombre;
    document.getElementById('modalSeguimiento').textContent = pedido.envio.numeroSeguimiento;
    document.getElementById('modalEstadoEnvio').textContent = pedido.envio.estadoEnvio;
    document.getElementById('linkSeguimiento').href = empresaInfo.url;
    
    // Cargar productos
    const tbody = document.getElementById('modalProductos');
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
    
    // Cargar timeline
    cargarTimeline(pedido);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('detallePedidoModal'));
    modal.show();
}

// Cargar timeline de seguimiento
function cargarTimeline(pedido) {
    const timeline = document.getElementById('timelineSeguimiento');
    
    const eventos = [
        {
            titulo: 'Pedido Recibido',
            descripcion: 'Tu pedido ha sido recibido y está siendo procesado',
            fecha: pedido.fecha,
            completado: true
        },
        {
            titulo: 'Preparando Envío',
            descripcion: 'Estamos preparando tu pedido para el envío',
            fecha: pedido.fecha,
            completado: pedido.estado !== 'pendiente'
        },
        {
            titulo: 'En Camino',
            descripcion: `Tu pedido está en camino con ${empresasEnvio[pedido.envio.empresa].nombre}`,
            fecha: pedido.fecha,
            completado: pedido.estado === 'completado'
        },
        {
            titulo: 'Entregado',
            descripcion: 'Tu pedido ha sido entregado exitosamente',
            fecha: pedido.estado === 'completado' ? pedido.fecha : null,
            completado: pedido.estado === 'completado'
        }
    ];
    
    timeline.innerHTML = '';
    
    eventos.forEach((evento, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const iconClass = evento.completado ? 'completed' : (index === 1 && pedido.estado === 'procesando' ? 'active' : '');
        
        item.innerHTML = `
            <div class="timeline-icon ${iconClass}">
                <i class="bi ${evento.completado ? 'bi-check' : 'bi-circle'}"></i>
            </div>
            <div class="timeline-content">
                <h6>${evento.titulo}</h6>
                <p>${evento.descripcion}</p>
                ${evento.fecha ? `<div class="time">${formatearFecha(evento.fecha)}</div>` : ''}
            </div>
        `;
        
        timeline.appendChild(item);
    });
}

// Descargar factura (simulado)
function descargarFactura(pedidoId = null) {
    if (!pedidoId) {
        const modalId = document.getElementById('modalPedidoId').textContent;
        pedidoId = parseInt(modalId);
    }
    
    showAlert(`Descargando factura del pedido #${pedidoId}...`, 'info');
    
    // Aquí iría la lógica real para generar y descargar la factura
    setTimeout(() => {
        showAlert('Factura descargada exitosamente', 'success');
    }, 1500);
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

// Actualizar contador del carrito
function actualizarBadgeCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
    }
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
    cargarPedidos();
    actualizarBadgeCarrito();
    
    // Enter en el buscador
    document.getElementById('buscarPedidoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarPedido();
        }
    });
});
