// Funcionalidad para mostrar/ocultar contraseña
document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility para login
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const password = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (password.type === 'password') {
                password.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                password.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    // Toggle password visibility para registro
    const togglePasswordReg = document.getElementById('togglePasswordReg');
    if (togglePasswordReg) {
        togglePasswordReg.addEventListener('click', function() {
            const password = document.getElementById('passwordReg');
            const icon = this.querySelector('i');
            
            if (password.type === 'password') {
                password.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                password.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    // Toggle confirm password visibility
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const password = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            
            if (password.type === 'password') {
                password.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                password.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }

    // Validación del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Verificar si es el usuario administrador
            if (email === 'admin@impreco.com' && password === 'admin123') {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('userName', 'Administrador');
                localStorage.setItem('userEmail', email);
                showAlert('¡Bienvenido Administrador!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
                return;
            }
            
            // Usuario cliente de prueba
            if (email === 'cliente@email.com' && password === 'cliente123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', 'Cliente Demo');
                localStorage.setItem('userEmail', email);
                showAlert('¡Bienvenido!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                return;
            }
            
            // Aquí iría la lógica de autenticación para otros usuarios
            console.log('Login:', { email, password });
            
            // Por defecto, iniciar sesión como usuario genérico
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', email.split('@')[0]);
            localStorage.setItem('userEmail', email);
            
            // Mostrar mensaje de éxito
            showAlert('¡Inicio de sesión exitoso!', 'success');
            
            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }

    // Validación del formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const passwordReg = document.getElementById('passwordReg');
        const confirmPassword = document.getElementById('confirmPassword');
        const passwordError = document.getElementById('passwordError');

        // Validar contraseñas en tiempo real
        confirmPassword.addEventListener('input', function() {
            if (passwordReg.value !== confirmPassword.value) {
                passwordError.style.display = 'block';
                confirmPassword.classList.add('is-invalid');
            } else {
                passwordError.style.display = 'none';
                confirmPassword.classList.remove('is-invalid');
            }
        });

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('emailReg').value;
            const telefono = document.getElementById('telefono').value;
            const password = passwordReg.value;
            const confirmPass = confirmPassword.value;
            const terms = document.getElementById('terms').checked;
            
            // Validar que las contraseñas coincidan
            if (password !== confirmPass) {
                passwordError.style.display = 'block';
                confirmPassword.classList.add('is-invalid');
                showAlert('Las contraseñas no coinciden', 'danger');
                return;
            }
            
            // Validar longitud de contraseña
            if (password.length < 8) {
                showAlert('La contraseña debe tener al menos 8 caracteres', 'warning');
                return;
            }
            
            // Validar términos y condiciones
            if (!terms) {
                showAlert('Debes aceptar los términos y condiciones', 'warning');
                return;
            }
            
            // Aquí iría la lógica de registro
            console.log('Registro:', { nombre, apellido, email, telefono, password });
            
            // Guardar información del usuario
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', `${nombre} ${apellido}`);
            localStorage.setItem('userEmail', email);
            
            // Mostrar mensaje de éxito
            showAlert('¡Cuenta creada exitosamente!', 'success');
            
            // Redirigir al inicio después de 1.5 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
});

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
    
    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 150);
    }, 3000);
}
