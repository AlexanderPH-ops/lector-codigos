$(document).ready(function () {
    // --------- ALERTA GUARDAR CAMBIOS
    $('#BtnGuardar').on('click', function () {
        const correo = $('input[placeholder="Correo"]').val().trim();
        const usuario = $('input[placeholder="Usuario"]').val().trim();
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Validar campos vacíos
        if (correo === "" || usuario === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Debes completar el correo y el usuario antes de guardar.'
            });
            return;
        }
        // Validar formato del correo
        if (!regexCorreo.test(correo)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'El formato del correo es incorrecto. Ejemplo: usuario@dominio.com'
            });
            return;
        }
        // Si todo está correcto
        Swal.fire({
            title: 'Cambios guardados',
            text: 'Los cambios se guardaron correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    // Redirecciones de menú
    $('#configuracion').on('click', function () {
        window.location.href = '../checador_ticket/sys_config.html';
    });
    $('#paneladmin').on('click', function () {
        window.location.href = '../checador_ticket/panel_admin.html';
    });
    $('#registroempleado').on('click', function (e) {
        e.preventDefault();
        $('#modalRegistroEmpleado').modal('show');
    });
    $('#cuenta').on('click', function () {
        window.location.href = '../checador_ticket/info_cuenta.html';
    });
});
// --------- VALIDACIÓN DE CAMBIO DE CONTRASEÑA
document.addEventListener("DOMContentLoaded", function () {
    const newPassword = document.getElementById("newPassword");
    const confirmNewPassword = document.getElementById("confirmNewPassword");
    const modalMessage = document.getElementById("modalPasswordMessage");
    const btnGuardarPassword = document.getElementById("btnGuardarPassword");
    const mainPassword = document.getElementById("mainPassword");
    // Función para validar contraseñas
    function validateModalPasswords() {
        if (confirmNewPassword.value === "") {
            modalMessage.innerHTML = "";
            modalMessage.classList.remove("text-success", "text-danger");
            return false;
        }
        if (newPassword.value === confirmNewPassword.value) {
            modalMessage.innerHTML = `<i class="fas fa-check-circle me-1"></i> Las contraseñas coinciden`;
            modalMessage.classList.remove("text-danger");
            modalMessage.classList.add("text-success");
            return true;
        } else {
            modalMessage.innerHTML = `<i class="fas fa-times-circle me-1"></i> Las contraseñas no coinciden`;
            modalMessage.classList.remove("text-success");
            modalMessage.classList.add("text-danger");
            return false;
        }
    }
    newPassword.addEventListener("input", validateModalPasswords);
    confirmNewPassword.addEventListener("input", validateModalPasswords);
    btnGuardarPassword.addEventListener("click", function () {
        if (!validateModalPasswords()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden. Corrige antes de continuar.'
            }).then(() => {
                newPassword.value = "";
                confirmNewPassword.value = "";
                modalMessage.innerHTML = "";
                modalMessage.classList.remove("text-success", "text-danger");
                newPassword.focus();
            });
            return;
        }
        mainPassword.value = newPassword.value;
        // Cerrar modal
        const modalElement = document.getElementById("modalCambioContrasena");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'La contraseña ha sido actualizada correctamente.'
        });
        // Reset campos
        newPassword.value = "";
        confirmNewPassword.value = "";
        modalMessage.innerHTML = "";
        modalMessage.classList.remove("text-success", "text-danger");
    });
    // Mostrar/ocultar contraseña principal
    const toggleMainPassword = document.getElementById("toggleMainPassword");
    toggleMainPassword.addEventListener("click", function () {
        const icon = toggleMainPassword.querySelector("i");
        if (mainPassword.type === "password") {
            mainPassword.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            mainPassword.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});