$(document).ready(function(){
    $("#BtnEnd").click(function() {
         // Recolectar los datos del formulario
    var formData = {
        ticketValidity: $('#ticketValidity').val(),
        validAttempts: $('#validAttempts').val(),
        unitProducts: $('#unitProducts').val(),
        alertMethod: $('#alertMethod').val(),
        alertEmail: $('#alertEmail').val(),
        ColorPri: $('#colorPrimario').val(),
        ColorSec: $('#colorSecundario').val(),
        PassLife: $('#PassLife').val(),
        IP: $('#IP').val(),
        Puerto: $('#Puerto').val(),
        digitalSignature: $('#digitalSignature').is(':checked') ? 'Sí' : 'No',
        cartPhotos: $('#cartPhotos').is(':checked') ? 'Sí' : 'No',
        pdfTickets: $('#pdfTickets').is(':checked') ? 'Sí' : 'No',
        SecMod: $('#SecMod').is(':checked') ? 'Sí' : 'No',
        A2F: $('#A2F').is(':checked') ? 'Sí' : 'No'
    }
        
    // Enviar los datos via AJAX POST
    $.ajax({
        url: 'grafica.php', // Reemplaza con tu URL de destino
        type: 'POST',
        dataType: 'json', // Esperamos una respuesta JSON
        data: {form_data:formData} ,
        success: function(response) {
            // Manejar la respuesta exitosa
            console.log('Respuesta del servidor:', response);
            alert('Datos enviados correctamente');
        },
        error: function(xhr, status, error) {
            // Manejar errores
            console.error('Error en la petición:', status, error);
            alert('Ocurrió un error al enviar los datos');
        }
    });
});
});



