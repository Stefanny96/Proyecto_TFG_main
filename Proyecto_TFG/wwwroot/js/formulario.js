// Llamar las funciones cuando la página esté completamente cargada
window.onload = function () {
  generarNumeroSolicitud(); // Generar el número de solicitud
  generarFechaSolicitud(); // Generar la fecha de solicituD
  inicializarSelect2Proveedores();
  inicializarSelect2Provincias();
};

// Función para generar el número de solicitud
function generarNumeroSolicitud() {
  /*const fecha = new Date();
    const numeroSolicitud = `SP-${fecha.getFullYear().toString().slice(-2)}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}${fecha.getHours().toString().padStart(2, '0')}${fecha.getMinutes().toString().padStart(2, '0')}${fecha.getSeconds().toString().padStart(2, '0')}`;
    document.getElementById("numeroSolicitud").value = numeroSolicitud;*/

  const email = document.getElementById("txtEmailSolicitante").value;

  // Obtener la fecha y hora actual
  const timestamp = Date.now(); // Número de milisegundos desde 1970

  // Generar un hash simple del correo electrónico
  const hash = email
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) // Sumar códigos ASCII
    .toString(16); // Convertir a hexadecimal

  // Combinar los elementos para formar el número único
  const numeroSolicitud = `SOL-${hash}-${timestamp}`;

  document.getElementById("numeroSolicitud").value = numeroSolicitud;
}

// Función para generar la fecha de solicitud
function generarFechaSolicitud() {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, "0"); // Asegurarse de que el día tenga 2 dígitos
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // El mes comienza en 0, así que sumamos 1
  const anio = fecha.getFullYear();
  document.getElementById("fechaSolicitud").value = `${dia}/${mes}/${anio}`; // Formato DD/MM/YYYY
}

function agregarLinea() {
  let idProveedorSeleccionado =
    document.getElementById("selectProveedor").value;

  if (idProveedorSeleccionado != 0) {
    let fila = document.createElement("tr");
    fila.innerHTML = `
          <td><input type="text" class="form-control codigoProducto txtProductos" placeholder="Código del producto" readonly /></td>
          <td>
              <select class="form-control select2 selectProducto" style="width: 100%;"></select>
          </td>
          <td><input type="number" class="form-control cantidadProducto txtProductos" placeholder="Cantidad" oninput="manejarCambioCantidad(this)"/></td>
          <td>
              <div class="input-precio">
                  <input type="number" class="form-control precioUnitarioProducto txtProductos" placeholder="Precio unitario" oninput="actualizarSubtotal(this)" readonly />
                  <span class="simbolo-euro">€</span>
              </div>
          </td>
          <td>
              <div class="input-precio">
                  <input type="number" class="form-control subtotalProducto txtProductos" placeholder="Subtotal" readonly />
                  <span class="simbolo-euro">€</span>
              </div>
          </td>
          <td>
              <button type="button" class="btnEliminarProducto" onclick="eliminarFila(this)">Eliminar</button>
          </td>
      `;

    document.getElementById("detallePedido").appendChild(fila);

    rellenarSelectProducto(fila); // Cargar los productos disponibles
  } else {
    alert("No ha seleccionado ningún proveedor");
  }
}

// Lista global para almacenar los IDs de los productos ya seleccionados
let productosSeleccionados = [];

function rellenarSelectProducto(fila) {
  let selectFilaProducto = fila.querySelector(".selectProducto");
  let idProveedorSeleccionado =
    document.getElementById("selectProveedor").value;

  leerJsonProductos(function (data) {
    // Filtrar productos del proveedor seleccionado
    let productosFiltrados = data.filter(
      (producto) =>
        producto.proveedor.proveedor_id == idProveedorSeleccionado &&
        !productosSeleccionados.includes(producto.producto_id) // Excluir los seleccionados
    );

    // Convertir los productos filtrados en formato compatible con Select2
    let productos = productosFiltrados.map((producto) => ({
      id: producto.producto_id,
      text: producto.nombre,
    }));

    // Inicializar el Select2 con un placeholder
    $(selectFilaProducto).select2({
      placeholder: "Seleccione producto", // Placeholder visible por defecto
      data: productos,
    });

    // Forzar que no haya un producto seleccionado al inicio
    $(selectFilaProducto).val(null).trigger("change");

    // Configurar evento de selección
    $(selectFilaProducto)
      .off("select2:select")
      .on("select2:select", function (e) {
        let seleccionado = e.params.data;

        // Agregar el producto seleccionado a la lista global
        productosSeleccionados.push(seleccionado.id);

        // Mostrar información del producto en la fila actual
        let productoSeleccionado = productosFiltrados.find(
          (producto) => producto.producto_id == seleccionado.id
        );
        if (productoSeleccionado) {
          mostrarInformacionProducto(productoSeleccionado, fila);
        }
      });
  });
}

function manejarCambioCantidad(input) {
  let fila = input.closest("tr");
  let selectProducto = $(fila).find(".selectProducto").val();

  leerJsonProductos(function (data) {
    let productoSeleccionado = data.find(
      (producto) => producto.producto_id == selectProducto
    );

    if (productoSeleccionado) {
      let maxUnidades = Math.min(
        productoSeleccionado.unidades_disponibles,
        productoSeleccionado.stock_maximo
      );
      let minUnidades = 1; // Cantidad mínima permitida

      if (input.value > maxUnidades) {
        input.value = maxUnidades; // Ajustar al máximo permitido
        //alert(`No puedes seleccionar más de ${maxUnidades} unidades para este producto.`);
      } else if (input.value < minUnidades) {
        input.value = minUnidades; // Ajustar al mínimo permitido
        //alert(`Debes seleccionar al menos ${minUnidades} unidad(es) de este producto.`);
      }
    }

    // Actualizar el subtotal después de validar la cantidad
    actualizarSubtotal(input);
  });
}

function eliminarProducto(btn) {
  let fila = btn.closest("tr");
  let selectFilaProducto = fila.querySelector(".selectProducto");

  // Obtener el ID del producto seleccionado en la fila (si existe)
  let idProductoSeleccionado = $(selectFilaProducto).val();
  if (idProductoSeleccionado) {
    // Eliminar el producto de la lista global de seleccionados solo para esa fila
    productosSeleccionados = productosSeleccionados.filter(
      (id) => id != idProductoSeleccionado
    );
  }

  // Eliminar la fila del DOM
  fila.remove();

  // Actualizar todos los Select2 para reflejar los cambios
  actualizarTodosLosSelects();
}

function actualizarTodosLosSelects() {
  let filas = document.querySelectorAll("#detallePedido tr");

  filas.forEach((fila) => {
    let selectFilaProducto = fila.querySelector(".selectProducto");

    leerJsonProductos(function (data) {
      let idProveedorSeleccionado =
        document.getElementById("selectProveedor").value;

      // Filtrar productos disponibles
      let productosFiltrados = data.filter(
        (producto) =>
          producto.proveedor.proveedor_id == idProveedorSeleccionado &&
          !productosSeleccionados.includes(producto.producto_id)
      );

      let productos = productosFiltrados.map((producto) => ({
        id: producto.producto_id,
        text: producto.nombre,
      }));

      // Actualizar el Select2
      $(selectFilaProducto).select2({
        data: productos,
        placeholder:
          productos.length > 0
            ? "Seleccione producto"
            : "No hay productos disponibles",
      });

      // No restablecer el valor del select aquí, solo actualízalo si es necesario
      if (!$(selectFilaProducto).val()) {
        $(selectFilaProducto).val(null).trigger("change");
      }
    });
  });
}

function mostrarInformacionProducto(producto, fila) {
  // Seleccionar elementos por clase y establecer los valores
  let codigoProducto = fila.querySelector(".codigoProducto");
  if (codigoProducto) codigoProducto.value = `${producto.codigo}`;

  let precioUnitarioProducto = fila.querySelector(".precioUnitarioProducto");
  if (precioUnitarioProducto)
    precioUnitarioProducto.value = `${producto.precio_unitario}`;

  let cantidadProducto = fila.querySelector(".cantidadProducto");
  if (cantidadProducto && cantidadProducto.value > 0)
    actualizarSubtotal(cantidadProducto);
}

function actualizarSubtotal(inputCantidad) {
  // Obtener la fila en la que está el campo de cantidad
  let fila = inputCantidad.closest("tr");

  // Seleccionar los elementos de cantidad, precio unitario y subtotal
  let cantidadProducto = fila.querySelector(".cantidadProducto");
  let precioUnitarioProducto = fila.querySelector(".precioUnitarioProducto");
  let subtotalProducto = fila.querySelector(".subtotalProducto");

  // Asegurarse de que los campos no sean nulos y calcular el subtotal
  if (cantidadProducto && precioUnitarioProducto && subtotalProducto) {
    let cantidad = parseFloat(cantidadProducto.value) || 0;
    let precioUnitario = parseFloat(precioUnitarioProducto.value) || 0;

    // Calcular el subtotal
    let subtotal = cantidad * precioUnitario;

    // Actualizar el campo de subtotal
    subtotalProducto.value = subtotal.toFixed(2); // Mostrar con 2 decimales
  }

  // Calcular el total del pedido
  calcularTotalPedido();
}

function calcularTotalPedido() {
  let total = 0;

  // Obtener todas las filas del detalle del pedido
  let filas = document.querySelectorAll("#detallePedido tr");

  // Recorrer las filas y sumar los subtotales
  filas.forEach((fila) => {
    let subtotalProducto = fila.querySelector(".subtotalProducto");
    if (subtotalProducto) {
      let subtotal = parseFloat(subtotalProducto.value) || 0;
      console.log(`Subtotal: ${subtotal}`); // Verifica el valor de cada subtotal
      total += subtotal;
    }
  });

  // Actualizar el campo total del pedido
  let totalPedido = document.getElementById("totalPedido");
  if (totalPedido) {
    totalPedido.value = total.toFixed(2); // Mostrar con 2 decimales
  }
}

function limpiarFilas() {
  let tablaPedido = document.getElementById("detallePedido");
  let listaFilas = [...tablaPedido.getElementsByTagName("tr")];

  listaFilas.forEach((fila) => {
    fila.remove();
  });
}

function eliminarFila(boton) {
  let fila = boton.closest("tr");
  let selectFilaProducto = fila.querySelector(".selectProducto");

  // Obtener el ID del producto seleccionado en la fila (si existe)
  let idProductoSeleccionado = $(selectFilaProducto).val();
  if (idProductoSeleccionado) {
    // Eliminar el producto de la lista global de seleccionados
    productosSeleccionados = productosSeleccionados.filter(
      (id) => id != idProductoSeleccionado
    );
  }

  // Eliminar la fila del DOM
  fila.remove();

  // Actualizar todos los Select2 para reflejar los cambios
  actualizarTodosLosSelects();

  // Recalcular el total del pedido
  calcularTotalPedido();
}

function leerJsonProveedores(callback) {
  //Usamos callback para manejar la asincronia, tambien se puede usar promesas pero esta manera me parece mas facil
  $.ajax({
    url: "/js/datosProveedores.json", // Ruta al archivo JSON
    method: "GET",
    dataType: "json",
    success: function (data) {
      callback(data); // Llamar al callback con los datos obtenidos
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar el JSON proveedores:", error);
    },
  });
}

function leerJsonProductos(callback) {
  $.ajax({
    url: "/js/datosProductos.json", // Ruta al archivo JSON
    method: "GET",
    dataType: "json",
    success: function (data) {
      callback(data); // Llamar al callback con los datos obtenidos
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar el JSON productos:", error);
    },
  });
}

function leerJsonProvinciasEspania(callback){
  $.ajax({
    url: "/js/provinciasEspania.json", // Ruta al archivo JSON
    method: "GET",
    dataType: "json",
    success: function (data) {
      callback(data); // Llamar al callback con los datos obtenidos
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar el JSON provincias:", error);
    },
  });
}

function inicializarSelect2Provincias(){
  leerJsonProvinciasEspania(function (data){
    let provincias = data.map((provincia) => ({
      id: provincia.id, // ID para referencia
      text: provincia.nombre // Nombre visible en el dropdown
    }));

    // Inicializa Select2
    $("#selectProvincias").select2({
      placeholder: "Seleccione provincia",
      data: provincias,
    });
  });
} 

// Función para inicializar Select2 de proveedores
function inicializarSelect2Proveedores() {
  leerJsonProveedores(function (data) {
    let proveedores = data.map((proveedor) => ({
      id: proveedor.proveedor_id, // ID para referencia
      text: proveedor.nombre_razon_social, // Nombre visible en el dropdown
    }));

    // Inicializa Select2
    $("#selectProveedor").select2({
      placeholder: "Buscar proveedor...",
      data: proveedores,
    });

    // Manejar selección de un proveedor
    $("#selectProveedor").on("select2:select", function (e) {
      let seleccionado = e.params.data;

      // Filtrar el proveedor seleccionado por su ID
      let proveedorSeleccionado = data.find(
        (proveedor) => proveedor.proveedor_id == seleccionado.id
      );

      // Mostrar la información del proveedor en un div
      mostrarInformacionProveedor(proveedorSeleccionado);

      // Eliminar lineas de producto cuando cambias de proveedor
      limpiarFilas();

      //Para que se muestre cuando seleccionas proveedor
      agregarLinea();
    });
  });
}

function mostrarInformacionProveedor(proveedor) {
  const html = `
        <div class="proveedor-info mt-3">
            <table class="table">
            <thead>
                <tr>
                    <th>NIF/CIF</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${proveedor.nif_cif}</td>
                    <td>${proveedor.nombre_razon_social}</td>
                    <td>${proveedor.direccion.calle}, ${proveedor.direccion.ciudad}, ${proveedor.direccion.pais}, ${proveedor.direccion.codigo_postal}</td>
                    <td>${proveedor.telefono}</td>
                    <td>${proveedor.correo_electronico}</td>
                </tr>
            </tbody>
            </table>
        </div>
    `;

  // Insertamos el HTML en un contenedor
  $("#divInformacionProveedor").html(html);
}
