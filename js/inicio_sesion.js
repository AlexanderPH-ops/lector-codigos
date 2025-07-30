$(document).ready(function() {
    $("#btnLogin").click(function() {
//var datosEnviarJSON = '{"Codigo":"'+$("#usuario").val()+'","Password":"'+$("#password").val()+'"}';
//var datosEnviarJSON = '{"Usuario":"test","Password":"1234"}';
function showErrores(title,text){
            Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            showConfirmButton: true
            });
    }
var datosEnviarJSON = JSON.stringify({
            Usuario: $("#usuario").val(),
            Password: $("#password").val(),
            
        });
   // alert(datosEnviarJSON);
        $.ajax({
            url: 'http://192.168.1.22:8080/datasnap/rest/TServerMethods1/UsuarioLogin',
            type: 'POST',
            data: datosEnviarJSON,
            timeout:3000, //3 second timeout
            //contentType: "application/json",
            //dataType: "json",
            success: function(response)
            {
            // Verificamos el campo "estatus" de la respuesta
                if (response.Estatus === 0) {
                        Swal.fire({
                        icon: 'success',
                        title: "Login exitoso.",
                        text: "Redirigiendo...",
                        timer: 1000,
                        didOpen: () => Swal.showLoading(),
                        showConfirmButton: true
                        });
                    if (response.Redirect) {
                         window.location.href = response.Redirect;
                    }
                } 
                else if (response.Estatus === 1) {
                    showErrores('Usuario no existe.', 'Regístrate primero.');
                } 
                else if (response.Estatus === 2) {
                    showErrores('Credenciales incorrectas.', 'Verifica cada campo.');
                } 
                else if (response.Estatus === 3) {
                    showErrores('Tu cuenta está inactiva.', 'Contacta al supervisor.');
                } 
                else if (response.Estatus === 99) {
                    showErrores('Error desconocido.', 'Intántalo más tarde.');
                }             
            },
            error: function(xhr, status, error) 
            {
                alert('Ocurrio un error: ' + error);
            } 
        });
    });
});
document.getElementById('verificarConexion').addEventListener('click', async function() {
    // Función para mostrar diálogo de carga
function showLoadingDialog(ip, puerto) {
    return Swal.fire({
        title: 'Verificando conexión...',
        html: `Conectando a <strong>${ip}:${puerto}</strong><br><br>`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
    });
}
// Función para enviar la solicitud
async function sendRequest(options, swalInstance) {
    return new Promise((resolve, reject) => {
        // Configurar timeout para cancelación manual
        let requestTimeout;
        let wasCancelled = false;
        // Manejar clic en cancelar
        if (swalInstance) {
            const cancelButton = Swal.getActions().querySelector('.swal2-cancel');
            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    wasCancelled = true;
                    clearTimeout(requestTimeout);
                    Swal.close();
                    reject(new Error('Operación cancelada por el usuario.'));
                });
            }
        }
        // Configurar timeout para la solicitud
        requestTimeout = setTimeout(() => {
            if (!wasCancelled) {
                showRetryDialog('Tiempo de espera agotado', 'La conexión ha excedido el tiempo de espera.');
                reject(new Error('Timeout'));
            }
        }, options.timeout + 1000); // 1 segundo más que el timeout de AJAX
        // Realizar la petición AJAX
        $.ajax({
            url: options.url,
            type: options.type,
            data: options.data,
            timeout: options.timeout,
            success: function(response, textStatus, xhr) {
                clearTimeout(requestTimeout);
                if (wasCancelled) return;
                // Verificación corregida del estado de la respuesta
                if (xhr.status === 200) {
                    // Validación adicional del contenido de la respuesta si es necesario
                    if (typeof response === 'object' && response !== null) {
                        resolve(response);
                    } else {
                        // El servidor respondió con 200 pero el contenido no es JSON válido
                        try {
                            const parsedResponse = JSON.parse(response);
                            resolve(parsedResponse);
                        } catch (e) {
                            showRetryDialog('Respuesta inválida', 'El servidor respondió pero con un formato inesperado.');
                            reject(new Error('Formato de respuesta inválido'));
                        }
                    }
                } else {
                    showRetryDialog('Error en la respuesta', 'El servidor no respondió correctamente.');
                    reject(new Error(`Estado HTTP inesperado: ${xhr.status}`));
                }
            },
            error: function(xhr, status, error) {
                clearTimeout(requestTimeout);
                if (wasCancelled) return;
                
                if (xhr.status === 200) {
                    // Caso especial: jQuery podría llamar a 'error' incluso con estado 200
                    // si no puede parsear la respuesta como JSON
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        showRetryDialog('Respuesta inválida', 'El servidor respondió pero no pudimos interpretar la respuesta.');
                        reject(new Error('Error parseando respuesta JSON'));
                    }
                } else {
                    showRetryDialog('Error de conexión', `No se pudo conectar al servidor. Error: ${error}`);
                    reject(new Error(`Error de conexión: ${error}`));
                }
            }
        });
    });
}
// Función para mostrar diálogo de reintento
function showRetryDialog(title, text) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: 'Reintentar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('verificarConexion').click();
        }
    });
}
    try {
        // Obtener valores de los inputs
        const ip = document.getElementById('ip').value.trim();
        const puerto = document.getElementById('puerto').value.trim();
        // Validar campos obligatorios
        if (!ip || !puerto) {
             Swal.fire({
             icon: 'warning',
             title: 'Faltan datos',
             text: 'Ingresa la IP y el puerto antes de verificar.'
            });
            return;
        }
        // Mostrar diálogo de carga
        const swalInstance = showLoadingDialog(ip, puerto);
        const requestOptions = {
            url: `http://${ip}:${puerto}/datasnap/rest/TServerMethods1/UsuarioLogin`,
            type: 'POST',
            data: '{"Usuario":""}',
            timeout: 3000
        };
        // Realizar la petición
        const response = await sendRequest(requestOptions, swalInstance);
        // Manejar respuesta exitosa
        Swal.fire({
        icon: 'success',
        title: 'Conexión exitosa',
        text: `El servidor responde en ${ip}:${puerto}`,
        showConfirmButton: true
    }); 
    } catch (error) {
        // El manejo de errores ya está incluido en sendRequest
    }
});