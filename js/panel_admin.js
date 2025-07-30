$(document).ready(function() {
  $("#datepicker").datepicker({
    dateFormat: "dd/mm/yy",
    showButtonPanel: true,
    firstDay: 1,
    changeMonth: true,
    changeYear: true,
    yearRange: "1900:2030",
    currentText: 'Hoy',
    closeText: 'Cerrar',
    onSelect: function(dateText, inst) {
      $(this).val(dateText).blur();
    },
    beforeShow: function(input, inst) {
      setTimeout(function() {
        inst.dpDiv.find('.ui-datepicker-current')
          .addClass('btn btn-sm btn-outline-secondary')
          .on('click', function() {
            $("#datepicker").datepicker("setDate", new Date()).blur();
            $("#datepicker").datepicker("hide");
          });
        inst.dpDiv.find('.ui-datepicker-close')
          .addClass('btn btn-sm btn-primary');
      }, 1);
    }
  }).keydown(function(e) {
    e.preventDefault();
    return false;
  });
    // Actualizamos el texto del botón cuando se selecciona una fecha
    $('#filter-date').on('changeDate', function(e) {
        const fechaFormateada = e.format('dd/mm/yyyy');
        $(this).text('Filtro: ' + fechaFormateada);
        
        // Aquí puedes usar la fecha para filtrar
        console.log('Fecha seleccionada:', e.date);
    });
    $('#filter-alert').click(function() {
        alert('alertas filtradas');
        // O si prefieres mostrarlo en la consola:
        // console.log('Mensaje que quieres mostrar');
    });
    $('#BtnUpdate').click(function() {
        const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "success",
  title: "Informacion Actualizada al: ",
  text: datepicker.value
});
    });
    $('#configuracion').on('click', function () {
        window.location.href = '../checador_ticket/sys_config.html';
    });
    $('#paneladmin').on('click', function () {
            window.location.href = '../checador_ticket/panel_admin.html';
    });
    $('#registroempleado').on('click', function () {
            e.preventDefault();
    });

    $('#cuenta').on('click', function () {
            window.location.href = '../checador_ticket/info_cuenta.html';
    });
     // ------------- ALERTAS REGISTRO DE EMPLEADOS
    $('#add-empl').on('click', function () {
      const EmplEmail = document.getElementById('EmplEmail').value;
            const EmplUser = document.getElementById('EmplUser').value;
            const EmplPass = document.getElementById('EmplPass').value;
            if (EmplEmail && EmplUser && EmplPass ) {
                Swal.fire({
      title: 'Usuario agregado',
      text: 'El usuario ha sido agregado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
            }
            else{
                Swal.fire({
      title: '¡Campos faltantes!',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
            }
    })
    $('#edit-empl').on('click', function () {
      const EmplEmail = document.getElementById('EmplEmail').value;
            const EmplUser = document.getElementById('EmplUser').value;
            const EmplPass = document.getElementById('EmplPass').value;
            if (EmplEmail && EmplUser && EmplPass ) {
                Swal.fire({
      title: 'Usuario editado',
      text: 'El usuario ha sido editado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
            }
            else{
                Swal.fire({
      title: '¡Campos faltantes!',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
            }
    ;})
    $('#delete-empl').on('click', function () {
    Swal.fire({
      title: 'Usuario eliminado',
      text: 'El usuario ha sido eliminado correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });})
    $('#KickUser').on('click', function () {
    Swal.fire({
      title: 'Sesiones cerradas',
      text: 'Todas las sesiones han sido cerradas correctamente.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });})
  // Filtros de gráficos
  $('#RevDay').click(function() {
    updateCharts('day');
  });
  $('#RevWeek').click(function() {
    updateCharts('week');
  });
  $('#RevMonth').click(function() {
    updateCharts('month');
  });
  $('#RevYear').click(function() {
    updateCharts('year');
  });
});
// ------------------------ CONFIGURACIÓN DE GRÁFICAS ------------------------
// Configuración común para ambas gráficas
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: {
      display: true,
      font: { size: 18 }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          if (context.chart.config.type === 'pie') {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
          return `${label}: ${value}`;
        }
      }
    }
  }
};
// Datos iniciales grafica de pastel
const pieData = {
  labels: ['Tickets Aprobados', 'Tickets Anómalos'],
  datasets: [{
    data: [75, 25],
    backgroundColor: ['#36a2eb', '#ff6384'],
    borderWidth: 1
  }]
};
const pieConfig = {
  type: 'doughnut',
  data: pieData,
  options: {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Gráfica de Tickets Aprobados y Anómalos'
      }
    }
  }
};
// Datos para la gráfica de barras
const barData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Repetidos',
      data: [12, 10, 8, 15, 14, 16, 18, 20, 15, 12, 10, 9],
      backgroundColor: '#ff6384',
      borderColor: '#cc4f6b',
      borderWidth: 1
    },
    {
      label: 'Falsos',
      data: [8, 7, 10, 9, 12, 15, 14, 13, 11, 10, 8, 7],
      backgroundColor: '#ff9f40',
      borderColor: '#cc7f33',
      borderWidth: 1
    }
  ]
};
const barConfig = {
  type: 'bar',
  data: barData,
  options: {
    indexAxis: 'y',
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        ...commonOptions.plugins.title,
        text: 'Distribución Detallada de Tickets'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Cantidad de Tickets' },
        stacked: false
      },
      y: {
        title: { display: true, text: 'Meses del Año' },
        stacked: false
      }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  }
};
// Variables globales para las instancias de las gráficas
let ticketsChartInstance;
let anomalousTicketsChartInstance;
document.addEventListener('DOMContentLoaded', function() {
  const ctxPie = document.getElementById('ticketsChart').getContext('2d');
  const ctxBar = document.getElementById('anomalousTicketsChart').getContext('2d');
  
  ticketsChartInstance = new Chart(ctxPie, pieConfig);
  anomalousTicketsChartInstance = new Chart(ctxBar, barConfig);
});
// ------------------------ FUNCIÓN DE ACTUALIZACIÓN ------------------------
function updateCharts(filterType) {
  let newLabels = [];
  let randomData = () => Array.from({ length: newLabels.length }, () => Math.floor(Math.random() * 50) + 1);
  if (filterType === 'day') {
    // 24 horas
    newLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    ticketsChartInstance.data.datasets[0].data = [15, 5];
    yAxisTitle = 'Horas del Día';
  } 
  else if (filterType === 'week') {
    // Días de la semana
    newLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    ticketsChartInstance.data.datasets[0].data = [50, 10];
    yAxisTitle = 'Días de la Semana';
  } 
  else if (filterType === 'month') {
    // Semanas del mes
    newLabels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    ticketsChartInstance.data.datasets[0].data = [200, 30];
    yAxisTitle = 'Semanas del Mes';
  } 
  else if (filterType === 'year') {
    // Meses del año
    newLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    ticketsChartInstance.data.datasets[0].data = [2000, 400];
    yAxisTitle = 'Meses del Año';
  }
  // Actualizamos la gráfica de barras
  anomalousTicketsChartInstance.data.labels = newLabels;
  anomalousTicketsChartInstance.data.datasets.forEach((dataset) => {
    dataset.data = randomData();
  });
  anomalousTicketsChartInstance.options.scales.y.title.text = yAxisTitle;
  ticketsChartInstance.update();
  anomalousTicketsChartInstance.update();
}