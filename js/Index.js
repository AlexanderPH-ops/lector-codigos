$(document).ready(function(){
    // ----------- Redirecciones de Botones ----------- //
    $('#btnPDF').on('click', function () {
        window.location.href = 'PDF/';
    });
    $('#btnFirma').on('click', function () {
        window.location.href = '';
    });
    $('#btnConfirmar').on('click', function () {
        window.location.href = '';
    });
    $('#btnReportar').on('click', function () {
        window.location.href = '';
    });
    $('#configuracion').on('click', function () {
        window.location.href = '../checador_ticket/sys_config.html';
    });
    $('#paneladmin').on('click', function () {
        window.location.href = '../checador_ticket/panel_admin.html';
    });
    $('#registroempleado').on('click', function (e) {
        e.preventDefault();
    });
    $('#cuenta').on('click', function () {
        window.location.href = '../checador_ticket/info_cuenta.html';
    });
    // ----------- FUNCIONES ----------- //
    function camposEmpleadosVacios() {
        const email = $('#EmplEmail').text().trim();
        const user = $('#EmplUser').text().trim();
        const pass = $('#EmplPass').text().trim();
        return (email === '' || user === '' || pass === '');
    }
    function correoValido(correo) {
        // Expresión regular para validar formato básico de correo
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }
    function limpiarCamposEmpleados() {
        $('#EmplEmail').text('');
        $('#EmplUser').text('');
        $('#EmplPass').text('');
    }

    // --------- Libreria de SCANER
    $(document).ready(function () {
    // Variable global para el lector
    let codeReader;

    $('#btnScan').on('click', function () {
        const qrReaderDiv = $('#qr-reader');
        qrReaderDiv.show();

        // Si ya existe un lector, detenerlo antes de crear uno nuevo
        if (codeReader) {
            codeReader.reset();
            codeReader = null;
        }

        codeReader = new ZXing.BrowserBarcodeReader();

        // Buscar camaras disponibles
        codeReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se encontró cámara',
                        text: 'No hay cámaras disponibles en este dispositivo.'
                    });
                    qrReaderDiv.hide();
                    return;
                }

                // Elegir la camara trasera (solo si es posible w)
                let selectedDeviceId = videoInputDevices[0].deviceId;
                for (const device of videoInputDevices) {
                    if (device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('trasera')) {
                        selectedDeviceId = device.deviceId;
                        break;
                    }
                }

                // Iniciar escaneo continuo
                codeReader.decodeFromVideoDevice(selectedDeviceId, 'qr-reader', (result, err) => {
                    if (result) {
                        // Se detecto un código válido
                        $('#ticketFolio').text(result.text);
                        // Detener escaneo y ocultar lector
                        codeReader.reset();
                        qrReaderDiv.hide();
                    }
                    // err puede ser ignorado mientras sea de tipo "no code found"
                });
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al acceder a la cámara',
                    text: err.message || err
                });
                qrReaderDiv.hide();
            });
    });
});

    // ----------- ALERTAS Y VALIDACIONES DE EMPLEADOS ----------- //
    $('#add-empl').on('click', function () {
        const email = $('#EmplEmail').text().trim();
        if (camposEmpleadosVacios()) {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Debes completar todos los campos para agregar un usuario.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        } else if (!correoValido(email)) {
            Swal.fire({
                title: 'Correo no válido',
                text: 'Por favor ingresa un correo con el formato: ejemplo@dominio.com',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Usuario agregado',
                text: 'El usuario ha sido agregado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                limpiarCamposEmpleados();
            });
        }
    });
    $('#edit-empl').on('click', function () {
        const email = $('#EmplEmail').text().trim();

        if (camposEmpleadosVacios()) {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Debes completar todos los campos para editar un usuario.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        } else if (!correoValido(email)) {
            Swal.fire({
                title: 'Correo no válido',
                text: 'Por favor ingresa un correo con el formato: ejemplo@dominio.com',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Usuario editado',
                text: 'El usuario ha sido editado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                limpiarCamposEmpleados();
            });
        }
    });
    $('#delete-empl').on('click', function () {
        const user = $('#EmplUser').text().trim();
        if (user === '') {
            Swal.fire({
                title: 'No se pudo eliminar',
                text: 'Debes seleccionar un usuario para eliminar.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            Swal.fire({
                title: 'Usuario eliminado',
                text: 'El usuario ha sido eliminado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                limpiarCamposEmpleados();
            });
        }
    });
    // ------------ ALERTAS PARA INDEX ------------
    $('#procesarTic').on('click', function () {
        Swal.fire({
            title: 'Ticket procesado',
            text: 'El ticket ha sido procesado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    $('#procesarFir').on('click', function () {
        Swal.fire({
            title: 'Firma realizada',
            text: 'El ticket ha sido firmado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    $('#btnRev').on('click', function () {
        Swal.fire({
            title: 'Ticket revisado',
            text: 'El ticket ha sido revisado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    $('#cerrarses').on('click', function () {
        Swal.fire({
            title: "¿Estás seguro de cerrar sesión?",
            showDenyButton: true,
            confirmButtonText: "Aceptar",
            denyButtonText: `Cancelar`
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../checador_ticket/inicio_sesion.html";
            }
        });
    });
    $('#btnEscalar').on('click', function () {
        Swal.fire({
            title: 'Reporte realizado',
            text: 'El reporte ha sido enviado al supervisor.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    $('#btnExportar').on('click', function () {
        Swal.fire({
            title: 'Exportación realizada',
            text: 'Se ha realizado la exportación correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });

});