# 🛍️ IMPRECO - E-Commerce

Sistema completo de tienda online con panel de administración y seguimiento de pedidos.

---

## 🔐 CREDENCIALES DE ACCESO

### 👨‍💼 Usuario Administrador (Modo Dios)
**Para acceder al panel de administración:**

- **Email:** `admin@impreco.com`
- **Contraseña:** `admin123`
- **Acceso:** [login.html](login.html) → Redirige automáticamente a [admin.html](admin.html)

**Funcionalidades del Admin:**
- ✅ Gestión completa de productos (Agregar, Editar, Eliminar)
- ✅ Control de stock (Marcar productos sin stock)
- ✅ Gestión de pedidos (Ver, Cambiar estado, Eliminar)
- ✅ Estadísticas en tiempo real
- ✅ Filtros por estado de pedido

---

### 👤 Usuario Cliente (Pruebas)
**Para probar funcionalidades de cliente:**

- **Email:** `cliente@email.com`
- **Contraseña:** `cliente123`
- **Acceso:** [login.html](login.html)

**Funcionalidades del Cliente:**
- ✅ Ver productos disponibles
- ✅ Agregar productos al carrito
- ✅ Procesar compras
- ✅ Ver mis pedidos
- ✅ Seguimiento de envíos

---

## 📦 DATOS DE PRUEBA PRECARGADOS

### Productos Iniciales (4 productos)
1. **Regalos empresariales** - $999.99 - Stock: 10
2. **Filamento PLA 1kg** - $24.99 - Stock: 50
3. **Kit de Herramientas** - $49.99 - Stock: 0 (Sin stock)
4. **Cama de Cristal** - $34.99 - Stock: 25

### Pedidos de Ejemplo (4 pedidos)
1. **Pedido #1001** - Juan Pérez - $2,124.93 - Estado: Pendiente
2. **Pedido #1002** - María García - $119.97 - Estado: En Proceso
3. **Pedido #1003** - Carlos López - $249.90 - Estado: Completado
4. **Pedido #1004** - Ana Martínez - $999.99 - Estado: Cancelado

---

## 🚀 GUÍA DE PRUEBAS

### 1️⃣ Probar como Cliente

#### A. Comprar Productos
1. Ir a [index.html](index.html)
2. Ver productos en la sección "Nuestros Productos"
3. Hacer clic en "Añadir al carrito"
4. Ver contador del carrito actualizarse
5. Ir a [carrito.html](carrito.html)
6. Ajustar cantidades con botones +/-
7. Hacer clic en "Procesar Compra"
8. Ver confirmación con número de pedido

#### B. Ver Mis Pedidos
1. Ir a [mis-pedidos.html](mis-pedidos.html)
2. Ver lista de todos los pedidos
3. Buscar pedido por número (ej: #1001)
4. Hacer clic en "Ver Detalles"
5. Ver información completa:
   - Timeline de seguimiento
   - Número de seguimiento (Correo Argentino/Andreani/OCA)
   - Estado del envío
   - Productos incluidos
6. Hacer clic en "Rastrear Envío" (abre sitio de la empresa)
7. Descargar factura (simulado)

---

### 2️⃣ Probar como Administrador

#### A. Iniciar Sesión como Admin
1. Ir a [login.html](login.html)
2. Ingresar:
   - Email: `admin@impreco.com`
   - Contraseña: `admin123`
3. Automáticamente redirige a [admin.html](admin.html)

#### B. Gestionar Productos
1. En el panel, ir a "Productos"
2. Ver tabla con todos los productos
3. **Agregar producto:**
   - Clic en "Agregar Producto"
   - Llenar formulario
   - Guardar
   - Ver producto en la web inmediatamente
4. **Editar producto:**
   - Clic en botón de editar (lápiz)
   - Modificar datos
   - Guardar
5. **Marcar sin stock:**
   - Clic en botón de stock (caja)
   - Ver cambio de estado
6. **Eliminar producto:**
   - Clic en botón eliminar (basura)
   - Confirmar
   - Producto desaparece de la web

#### C. Gestionar Pedidos
1. En el panel, ir a "Pedidos"
2. Ver estadísticas:
   - Pendientes
   - En Proceso
   - Completados
   - Total Ventas
3. **Filtrar pedidos:**
   - Clic en botones: Todos, Pendientes, En Proceso, Completados, Cancelados
4. **Ver detalle:**
   - Clic en ojo (ver detalles)
   - Ver información completa del cliente
   - Ver productos del pedido
5. **Cambiar estado:**
   - Clic en botón de cambiar estado (flechas circulares)
   - Estado cambia: Pendiente → En Proceso → Completado → Cancelado
6. **Eliminar pedido:**
   - Clic en basura
   - Confirmar eliminación

#### D. Ver Estadísticas
1. En el panel, ir a "Estadísticas"
2. Ver métricas:
   - Total de productos
   - Productos en stock
   - Productos sin stock
   - Valor total del inventario

---

## 🔄 FLUJO COMPLETO DE COMPRA

### Paso a Paso:
1. **Cliente navega** → [index.html](index.html)
2. **Ve productos** → Cargados desde localStorage
3. **Agrega al carrito** → Se guarda en localStorage
4. **Va al carrito** → [carrito.html](carrito.html)
5. **Procesa compra** → Crea pedido
6. **Stock se actualiza** → Automáticamente
7. **Pedido aparece en:**
   - [mis-pedidos.html](mis-pedidos.html) (Cliente)
   - [admin.html](admin.html) → Pedidos (Admin)
8. **Cliente puede rastrear** → Con número de seguimiento

---

## 🚚 EMPRESAS DE ENVÍO

Los pedidos se asignan aleatoriamente a:

1. **Correo Argentino**
   - Prefijo: CA
   - Ejemplo: CA123456789
   - Link: https://www.correoargentino.com.ar/formularios/e-tracking

2. **Andreani**
   - Prefijo: AN
   - Ejemplo: AN987654321
   - Link: https://www.andreani.com/#!/personas/tracking

3. **OCA**
   - Prefijo: OC
   - Ejemplo: OC555666777
   - Link: https://www.oca.com.ar/seguimiento

---

## 🎨 CARACTERÍSTICAS DEL DISEÑO

- **Colores:** Violeta Pastel (#c8b6e2) y Naranja Pastel (#ffb380)
- **Framework:** Bootstrap 5
- **Iconos:** Bootstrap Icons
- **Animaciones:** Suaves y modernas
- **Responsive:** Adaptable a móviles, tablets y escritorio

---

## 📱 PÁGINAS DISPONIBLES

1. **[index.html](index.html)** - Página principal con productos
2. **[login.html](login.html)** - Inicio de sesión
3. **[registro.html](registro.html)** - Crear cuenta
4. **[carrito.html](carrito.html)** - Carrito de compras
5. **[mis-pedidos.html](mis-pedidos.html)** - Seguimiento de pedidos
6. **[admin.html](admin.html)** - Panel de administración

---

## 💾 ALMACENAMIENTO

Todo se guarda en **localStorage**:
- `productos` - Lista de productos
- `pedidos` - Lista de pedidos
- `carrito` - Productos en el carrito
- `isAdmin` - Estado de sesión admin

---

## 🧪 CASOS DE PRUEBA SUGERIDOS

### ✅ Prueba 1: Compra Completa
1. Agregar 3 productos diferentes al carrito
2. Modificar cantidades
3. Procesar compra
4. Verificar que aparece en "Mis Pedidos"
5. Ver número de seguimiento
6. Verificar que el stock se actualizó

### ✅ Prueba 2: Gestión de Productos (Admin)
1. Login como admin
2. Agregar un producto nuevo
3. Verificar que aparece en index.html
4. Editar el producto
5. Marcarlo sin stock
6. Verificar que no se puede comprar
7. Eliminarlo

### ✅ Prueba 3: Seguimiento de Pedido
1. Ir a "Mis Pedidos"
2. Buscar pedido #1001
3. Ver detalles completos
4. Verificar timeline de seguimiento
5. Hacer clic en "Rastrear Envío"
6. Descargar factura

### ✅ Prueba 4: Sincronización
1. Como admin, cambiar estado de pedido #1002
2. Ir a "Mis Pedidos" (como cliente)
3. Verificar que el estado se actualizó
4. Ver que el timeline cambió

---

## 🎯 FUNCIONALIDADES DESTACADAS

- ✨ **Sincronización en tiempo real** entre admin y cliente
- 🔄 **Actualización automática de stock** al comprar
- 📦 **Números de seguimiento únicos** por pedido
- 🚚 **Integración con empresas reales** de envío
- 💳 **Proceso de compra completo** con validaciones
- 📊 **Estadísticas en tiempo real** en el panel admin
- 🔍 **Búsqueda de productos** funcional
- 🎨 **Animaciones suaves** en todas las interacciones
- 📱 **100% Responsive** en todos los dispositivos

---

## 🆘 SOPORTE

Si encuentras algún problema:
1. Abre la consola del navegador (F12)
2. Revisa los errores en la pestaña "Console"
3. Verifica que localStorage esté habilitado
4. Recarga la página (Ctrl + F5)

---

## 🎉 ¡LISTO PARA PROBAR!

Comienza por iniciar sesión como administrador y explora todas las funcionalidades.

**¡Disfruta probando el sistema completo!** 🚀
