// Llamar las funciones cuando la página esté completamente cargada
window.onload = function () {
    generarNumeroSolicitud(); // Generar el número de solicitud
    generarFechaSolicitud();  // Generar la fecha de solicituD
    document.getElementById("btnLimpiarProducto").addEventListener("click",limpiarProducto);
};

// Función para generar el número de solicitud
function generarNumeroSolicitud() {
    const fecha = new Date();
    const numeroSolicitud = `SP-${fecha.getFullYear().toString().slice(-2)}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}${fecha.getHours().toString().padStart(2, '0')}${fecha.getMinutes().toString().padStart(2, '0')}${fecha.getSeconds().toString().padStart(2, '0')}`;
    document.getElementById("numeroSolicitud").value = numeroSolicitud;
}

// Función para generar la fecha de solicitud
function generarFechaSolicitud() {
    const fecha = new Date();
    const dia = fecha.getDate().toString().padStart(2, '0'); // Asegurarse de que el día tenga 2 dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // El mes comienza en 0, así que sumamos 1
    const anio = fecha.getFullYear();
    document.getElementById("fechaSolicitud").value = `${dia}/${mes}/${anio}`; // Formato DD/MM/YYYY
}

// Función para agregar una nueva línea al detalle del pedido
function agregarLinea() {
    let botonLimpiarProducto = document.getElementById("btnLimpiarProducto");
    botonLimpiarProducto.removeEventListener("click",limpiarProducto);
    botonLimpiarProducto.innerHTML = "Eliminar";
    botonLimpiarProducto.addEventListener("click",eliminarProducto);

    const fila = document.createElement("tr");
    fila.innerHTML = `
        <td><input type="text" class="form-control codigoProducto" placeholder="Código del producto" readonly /></td>
        <td><input type="text" class="form-control descripcion" placeholder="Descripción del producto" /></td>
        <td><input type="number" class="form-control cantidad" placeholder="Cantidad" oninput="actualizarSubtotal(this)" /></td>
        <td>
            <div class="input-precio">
                <input type="number" class="form-control precioUnitario" placeholder="Precio unitario" oninput="actualizarSubtotal(this)" readonly />
                <span class="simbolo-euro">€</span>
            </div>
        </td>
        <td>
            <div class="input-precio">
                <input type="number" class="form-control subtotal" placeholder="Subtotal" readonly />
                <span class="simbolo-euro">€</span>
            </div>
        </td>
        <td>
            <button type="button" id="btnEliminarProducto" onclick="eliminarProducto()">Eliminar</button>
        </td>
    `;

    document.getElementById("detallePedido").appendChild(fila);
}

function limpiarProducto(){
    let listaTxtDetallesProductos = [...document.getElementsByClassName("txtProductos")];
    listaTxtDetallesProductos.forEach(txtProduct => {
        txtProduct.value = "";
    });
}

function eliminarProducto(){
    alert("Hola");
}


