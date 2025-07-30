document.addEventListener('DOMContentLoaded', function () {
    const companySelect = document.getElementById('companyName');
    const branchSelect = document.getElementById('branch');
    const descriptionField = document.getElementById('description');
    const addressField = document.getElementById('address');
    const errorMessage = document.getElementById('branchError');
    const submitBtn = document.getElementById('submitBtn');
    let empresasData = [];
    let sucursalesData = [];
    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.overflowY = 'hidden';
        textarea.style.height = (textarea.scrollHeight + 1) + 'px'; // Suma 1px extra
    }
    companySelect.innerHTML = '<option value="">Cargando empresas...</option>';
    // ===========================
    // Cargar empresas
    // ===========================
    fetch('http://192.168.1.57:8080/datasnap/rest/TServerMethods1/GetEmpresas', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Respuesta de GetEmpresas:', data);
        const estatus = data?.Estatus ?? 99;
        const mensaje = data?.Mensaje || 'Respuesta inesperada';
        if (estatus !== 0) {
            companySelect.innerHTML = `<option value="">${mensaje}</option>`;
            Swal.fire({
                icon: estatus === 1 ? 'info' : 'error',
                title: 'Empresas',
                text: mensaje,
            });
            return;
        }
        const empresas = data?.Empresas || [];
        companySelect.innerHTML = '';
        if (Array.isArray(empresas) && empresas.length > 0) {
            empresasData = empresas;
            companySelect.innerHTML = '<option value="">Seleccione la empresa</option>';
            empresas.forEach(emp => {
                companySelect.innerHTML += `<option value="${emp.IDEmp}">${emp.Empresa}</option>`;
            });
        } else {
            companySelect.innerHTML = '<option value="">No se encontraron empresas</option>';
        }
    })
    .catch(err => {
        console.error('Error al cargar empresas:', err);
        companySelect.innerHTML = '<option value="">Error al cargar empresas</option>';
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las empresas. Revisa la conexión.',
        });
    });
    // ===========================
    // Cambiar empresa -> cargar sucursales
    // ===========================
    companySelect.addEventListener('change', function () {
        const IDEmp = this.value;
        descriptionField.value = '';
        addressField.value = '';
        branchSelect.innerHTML = '<option value="">Seleccione una sucursal</option>';
        if (!IDEmp) return;
        const emp = empresasData.find(e => String(e.IDEmp) === String(IDEmp));
        if (emp) {
            descriptionField.value = emp.Descripcion;
            autoResizeTextarea(descriptionField);
        }
        branchSelect.innerHTML = '<option value="">Cargando sucursales...</option>';
        fetch('http://192.168.1.57:8080/datasnap/rest/TServerMethods1/GetSucursales', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ "IDEmp": IDEmp })
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Respuesta de updateGetSucursales:', data);
            const estatus = data?.Estatus ?? 99;
            const mensaje = data?.Mensaje || 'Respuesta inesperada';
            if (estatus !== 0) {
                branchSelect.innerHTML = `<option value="">${mensaje}</option>`;
                Swal.fire({
                    icon: estatus === 1 ? 'info' : 'error',
                    title: 'Sucursales',
                    text: mensaje,
                });
                return;
            }
            sucursalesData = data.Sucursales || [];
            branchSelect.innerHTML = '<option value="">Seleccione la sucursal</option>';
            sucursalesData.forEach(suc => {
                branchSelect.innerHTML += `<option value="${suc.IDSuc}">${suc.NombreSuc}</option>`;
            });
        })
        .catch(err => {
            console.error('Error al cargar sucursales:', err);
            branchSelect.innerHTML = '<option value="">Error al cargar sucursales</option>';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las sucursales. ' + err.message,
            });
        });
    });
    // ===========================
    // Cambiar sucursal -> mostrar dirección
    // ===========================
    branchSelect.addEventListener('change', function () {
        const IDSuc = this.value;
        addressField.value = '';
        errorMessage.style.display = 'none';
        if (!IDSuc) return;
        const suc = sucursalesData.find(s => String(s.IDSuc) === String(IDSuc));
        if (suc) {
            addressField.value = suc.Direccion;
            autoResizeTextarea(addressField);
        }
    });
    // ===========================
    // Botón siguiente -> Guardar en Config.ini
    // ===========================
    submitBtn.addEventListener('click', function () {
        const IDEmp = companySelect.value;
        const IDSuc = branchSelect.value;
        if (!IDEmp) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debe seleccionar una empresa.',
            });
            return;
        }
        if (!IDSuc) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Debe seleccionar una sucursal.',
            });
            return;
        }
        if (IDSuc === 'sucursal2') {
            errorMessage.style.display = 'block';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ya existe un administrador en esta sucursal.',
            });
            return;
        }
        const dataToSend = { IDEmp: IDEmp, IDSuc: IDSuc };
        console.log('Enviando a SaveSelectedCompanyBranch:', dataToSend);
        fetch('http://192.168.1.57:8080/datasnap/rest/TServerMethods1/SaveSelectedCompanyBranch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Respuesta de SaveSelectedCompanyBranch:', data);
            if (data.Estatus === 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Datos guardados',
                    text: 'La empresa y sucursal seleccionadas fueron guardadas correctamente.',
                }).then(() => {
                    window.location.href = 'reg_admin.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.Mensaje || 'Error desconocido al guardar datos.',
                });
            }
        })
        .catch(err => {
            console.error('Error al guardar IDEmp e IDSuc:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la selección. ' + err.message,
            });
        });
    });
});