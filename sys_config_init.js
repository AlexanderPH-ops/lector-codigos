$(document).ready(function() {
    // 1. Obtener valores al cambiar el color (tiempo real)
    $("#colorPrimario, #colorSecundario").on("input", function() {
        const id = $(this).attr("id");
        const valor = $(this).val();
        console.log(`${id}: ${valor}`);
    });
    // 2. Obtener valores al hacer clic en "Guardar" (ejemplo práctico)
    $("#BtnEnd").click(function() {
        const colorPrimario = $("#colorPrimario").val(); // Ejemplo: "#0d6efd"
        const colorSecundario = $("#colorSecundario").val(); // Ejemplo: "#9c27b0"
        console.log("Valores guardados:", {
            primario: colorPrimario,
            secundario: colorSecundario
        });
        // Puedes usarlos para:
        // - Cambiar estilos dinámicamente
        $("body").css("--color-primario", colorPrimario);
        $("body").css("--color-secundario", colorSecundario);
        // - Enviar al servidor vía AJAX
        $.ajax({
            url: "/guardar-colores",
            method: "POST",
            data: {
                primario: colorPrimario,
                secundario: colorSecundario
            },
            success: function(response) {
                alert("Colores guardados correctamente.");
            }
        });
    });
});
/* Contador
    //Constantes, extrae el valor actual del input
const att = document.getElementById('validAttempts');
function sumar() {
    att.value = parseInt(att.value || 0) + 1; // Usa "|| 0" por si el campo está vacío
}
function restar() {
  const currentValue = parseInt(att.value || 0);
  att.value = currentValue > 0 ? currentValue - 1 : 0; // Evita números negativos
}
    //Eventos de los botones 
document.getElementById('BtnUpAtt').addEventListener('click', sumar);
document.getElementById('BtnDownAtt').addEventListener('click', restar);*/
// Función para incrementar valores
function incrementar(inputId) {
  const input = document.getElementById(inputId);
  input.value = parseInt(input.value || 0) + 1;
}
// Función para decrementar valores (no permite negativos)
function decrementar(inputId) {
  const input = document.getElementById(inputId);
  const valorActual = parseInt(input.value || 0);
  input.value = valorActual > 0 ? valorActual - 1 : 0;
}
// Asignación de eventos para cada contador
// 1. Ticket Validity
document.getElementById('BtnUpVal').addEventListener('click', () => incrementar('ticketValidity'));
document.getElementById('BtnDownVal').addEventListener('click', () => decrementar('ticketValidity'));
// 2. Valid Attempts
document.getElementById('BtnUpAtt').addEventListener('click', () => incrementar('validAttempts'));
document.getElementById('BtnDownAtt').addEventListener('click', () => decrementar('validAttempts'));
// 3. Unit Products
document.getElementById('BtnUpUni').addEventListener('click', () => incrementar('unitProducts'));
document.getElementById('BtnDownUni').addEventListener('click', () => decrementar('unitProducts'));
document.getElementById('BtnEnd').addEventListener('click', function() {
    const ticketValidity = document.getElementById('ticketValidity').value;
    const validAttempts = document.getElementById('validAttempts').value;
    const unitProducts = document.getElementById('unitProducts').value;
    const alertMethod = document.getElementById('alertMethod').value;
    const alertEmail = document.getElementById('alertEmail').value;
    const digitalSignature = document.getElementById('digitalSignature').checked ? 'Sí' : 'No';
    const cartPhotos = document.getElementById('cartPhotos').checked ? 'Sí' : 'No';
    const pdfTickets = document.getElementById('pdfTickets').checked ? 'Sí' : 'No';
    const ColorPri = document.getElementById("colorPrimario").value;
    const ColorSec = document.getElementById("colorSecundario").value;
    alert(`Validez del ticket: ${ticketValidity}
        Intentos maximos: ${validAttempts}
        Productos unitarios: ${unitProducts}
        Método de alerta: ${alertMethod}
        Correo para alertas: ${alertEmail}
        Firma digital: ${digitalSignature}
        Fotos del carrito: ${cartPhotos}
        Tickets en PDF: ${pdfTickets}
        color primario: ${ColorPri}
        colo secundario: ${ColorSec}`);
    });
    $(document).ready(function() {
    // Cuando se hace clic en el botón de Logo
    $("#BtnLogo").click(function() {
        $("#inputLogo").click(); // Simula clic en el input file
    });
    // Cuando se hace clic en el botón de Isologo
    $("#BtnIso").click(function() {
        $("#inputIso").click(); // Simula clic en el input file
    });
    // Cuando se selecciona una imagen para el Logo
    $("#inputLogo").change(function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $("#previewLogo").attr("src", e.target.result).show();
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
    // Cuando se selecciona una imagen para el Isologo
    $("#inputIso").change(function(e) {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $("#previewIso").attr("src", e.target.result).show();
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
});