// Referencias a elementos
const $ = (id) => document.getElementById(id);
const btnAdd = $('add-empl');
const btnEdit = $('edit-empl');
const btnDelete = $('delete-empl');
const btnNext = $('next');
const EmplEmail = $('EmplEmail');
const EmplUser = $('EmplUser');
const EmplPass = $('EmplPass');
const reqLength = $('req-length');
const reqMayus = $('req-mayus');
const reqNum = $('req-num');
const reqEspecial = $('req-especial');
// Eventos de botones
btnAdd.addEventListener('click', () => {
    if (EmplEmail.value && EmplUser.value && EmplPass.value) {
        alert(`Usuario: ${EmplUser.value}\nPassword: ${EmplPass.value}\nEmail: ${EmplEmail.value}`);
    } else {
        alert("¡Campos faltantes!");
    }
});
btnEdit.addEventListener('click', () => alert("Usuario editado"));
btnDelete.addEventListener('click', () => alert("Usuario eliminado"));
btnNext.addEventListener('click', () => window.location.href = "index.html");
// Validación de contraseña
EmplPass.addEventListener('input', () => {
    const val = EmplPass.value;
    actualizarCampo(reqLength, val.length >= 8 && val.length <= 20, "Entre 8 y 20 caracteres");
    actualizarCampo(reqMayus, /[A-Z]/.test(val), "Al menos una letra mayúscula");
    actualizarCampo(reqNum, /[0-9]/.test(val), "Al menos un número");
    actualizarCampo(reqEspecial, /[!@#$%^&*(),.?\":{}|<>]/.test(val), "Al menos un carácter especial");
});
function actualizarCampo(el, condicion, texto) {
    const icono = condicion
        ? '<i class="fas fa-circle-check"></i>'
        : '<i class="fas fa-circle-xmark"></i>';

    el.innerHTML = `${icono} <span>${texto}</span>`;
    el.classList.toggle("text-success", condicion);
    el.classList.toggle("text-danger", !condicion);
}