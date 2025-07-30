document.addEventListener("DOMContentLoaded", function () {
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const email = document.getElementById("email");
    const usuario = document.getElementById("usuario");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const message = document.getElementById("passwordMessage");
    const registerBtn = document.getElementById("registerBtn");
    // Elementos de requisitos
    const reqLength = document.getElementById("req-length");
    const reqMayus = document.getElementById("req-mayus");
    const reqNum = document.getElementById("req-num");
    const reqEspecial = document.getElementById("req-especial");
    function correoValido(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    function validarContrasena(password) {
        const minLength = 8;
        const maxLength = 20;
        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);
        const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const longitudValida = password.length >= minLength && password.length <= maxLength;
        const contrasenasDebiles = ["12345678", "password", "admin", "qwerty", "abc123"];
        if (contrasenasDebiles.includes(password.toLowerCase())) {
            return { valido: false, mensaje: "Contraseña demasiado común. Elige una más segura." };
        }
        if (!longitudValida) return { valido: false, mensaje: "La contraseña debe tener entre 8 y 20 caracteres." };
        if (!tieneMayuscula) return { valido: false, mensaje: "Debe contener al menos una letra mayúscula." };
        if (!tieneNumero) return { valido: false, mensaje: "Debe contener al menos un número." };
        if (!tieneEspecial) return { valido: false, mensaje: "Debe contener al menos un carácter especial." };
        return { valido: true };
    }
    function validatePasswords() {
        if (confirmPassword.value === "") {
            message.innerHTML = "";
            return false;
        }
        if (password.value === confirmPassword.value) {
            message.innerHTML = `<i class="fas fa-circle-check me-1"></i> Las contraseñas coinciden`;
            message.classList.remove("text-danger");
            message.classList.add("text-success");
            return true;
        } else {
            message.innerHTML = `<i class="fas fa-circle-xmark me-1"></i> Las contraseñas no coinciden`;
            message.classList.remove("text-success");
            message.classList.add("text-danger");
            return false;
        }
    }
    confirmPassword.addEventListener("input", validatePasswords);
    password.addEventListener("input", () => {
        validatePasswords();
        actualizarRequisitos(password.value);
    });
    function actualizarRequisitos(val) {
        // Longitud
        actualizarCampo(reqLength, val.length >= 8 && val.length <= 20, "Entre 8 y 20 caracteres");
        actualizarCampo(reqMayus, /[A-Z]/.test(val), "Al menos una letra mayúscula");
        actualizarCampo(reqNum, /[0-9]/.test(val), "Al menos un número");
        actualizarCampo(reqEspecial, /[!@#$%^&*(),.?\":{}|<>]/.test(val), "Al menos un carácter especial");
    }
    function actualizarCampo(el, condicion, texto) {
        const icono = condicion 
            ? '<i class="fas fa-circle-check"></i>'
            : '<i class="fas fa-circle-xmark"></i>';
        // Cambiar solo el contenido, manteniendo las clases originales
        el.innerHTML = `${icono} <span>${texto}</span>`;
        // Cambiar color con clases de Bootstrap
        if (condicion) {
            el.classList.remove("text-danger");
            el.classList.add("text-success");
        } else {
            el.classList.remove("text-success");
            el.classList.add("text-danger");
        }
    }
    registerBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (
            nombre.value.trim() === "" ||
            apellido.value.trim() === "" ||
            email.value.trim() === "" ||
            usuario.value.trim() === "" ||
            password.value.trim() === "" ||
            confirmPassword.value.trim() === ""
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Debes completar todos los campos antes de continuar.'
            });
            return;
        }
        if (!correoValido(email.value.trim())) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Ingresa un correo con formato correcto: ejemplo@dominio.com'
            }).then(() => {
                email.focus();
            });
            return;
        }
        const resultadoPassword = validarContrasena(password.value.trim());
        if (!resultadoPassword.valido) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña inválida',
                text: resultadoPassword.mensaje
            }).then(() => {
                password.focus();
            });
            return;
        }
        if (!validatePasswords()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden. Corrige antes de continuar.'
            }).then(() => {
                password.value = "";
                confirmPassword.value = "";
                message.innerHTML = "";
                password.focus();
            });
            return;
        }
        try {
            const VarJSON = JSON.stringify({
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                email: email.value.trim(),
                usuario: usuario.value.trim(),
                password: password.value.trim()
            });
            $.ajax({
                type: 'POST',
                url: 'http://192.168.1.23:8080/datasnap/rest/TServerMethods1/RegistrarUsuario',
                data: VarJSON,
                contentType: 'application/json',
                dataType: 'json'
            })
            .done(function (data) {
                switch (data.codigo) {
                    case "0":
                        Swal.fire({
                            title: "Registro exitoso",
                            text: data.mensaje,
                            icon: "success",
                            confirmButtonText: "Continuar"
                        }).then(() => {
                            window.location.href = "../checador_ticket/reg_empl.html";
                        });
                        break;
                    case "1":
                        Swal.fire("Campos incompletos", data.mensaje, "warning");
                        break;
                    case "2":
                        Swal.fire("Usuario duplicado", data.mensaje, "error");
                        break;
                    case "3":
                        Swal.fire("Error de conexión", data.mensaje, "error");
                        break;
                    case "4":
                    default:
                        Swal.fire("Error interno", data.mensaje, "error");
                        break;
                }
            })
            .fail(function (xhr, status, error) {
                Swal.fire("Error", "Fallo de conexión o error interno", "error");
            });

        } catch (error) {
            Swal.fire("Error inesperado", error.message || error, "error");
        }
    });
});