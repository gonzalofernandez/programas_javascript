"use strict";
var miApp = miApp || {},
    MENSAJE_ERROR = "Los datos introducidos son incorrectos, por favor" +
            " revíselos.",
    SENTIDO_ASC = "asc",
    SENTIDO_DESC = "desc",
    inicioTabla = "<tr><td>",
    orejeras = "</td><td>",
    finalTabla = "</td></tr>",
    COLUMNA_CHECK = 6,
    COLUMNA_NOMBRE_CUENTA = 0,
    NOMBRE_CUENTA = 0,
    nomSer,
    nomSis,
    nomDir,
    filasTabla,
    filaDatosCuenta,
    servidor,
    nombreCuenta,
    nombreUsuario,
    fechaIngreso,
    saldo,
    tipoCuenta,
    tipoFiltro,
    saldoMedio,
    puntosCuenta,
    botonBorrarCuentas,
    botonFiltrarCuentas,
    botonCrearCuenta,
    botonesGestion,
    botonOrdenAscendente,
    botonOrdenDescendente,
    botonObtenerEstadisticas,
    filasEstadistica,
    botonBuscarCuentas,
    campoBuscarCuentas;

function $(elemento) {
    return document.getElementById(elemento);
}
//Habilita o deshabilita botones
function controlarBotones(
    nomSer,
    botonFiltrarCuentas,
    botonBorrarCuentas,
    botonCrearCuenta,
    botonOrdenDescendente,
    botonOrdenAscendente,
    botonBuscarCuentas
) {
    var valor = !!(!nomSer.textContent);
    botonFiltrarCuentas.disabled = valor;
    botonBorrarCuentas.disabled = valor;
    botonCrearCuenta.disabled = valor;
    botonOrdenDescendente.disabled = valor;
    botonOrdenAscendente.disabled = valor;
    botonBuscarCuentas.disabled = valor;
}
//Asignaciones y operaciones al iniciar la aplicación
function inicializar() {
    filasTabla = $("tbody_cuentas");
    filaDatosCuenta = $("tbody_datos_cuenta");
    servidor = $("servidores");
    nombreCuenta = $("nombre_cuenta");
    nombreUsuario = $("nombre_usuario");
    fechaIngreso = $("fecha");
    saldo = $("saldo");
    puntosCuenta = $("puntos_cuenta");
    tipoCuenta = $("tipo_cuenta");
    nomSer = $("nomser");
    nomSis = $("nomsis");
    nomDir = $("nomdir");
    tipoFiltro = $("tipo_filtro");
    saldoMedio = $("saldo_medio");
    botonFiltrarCuentas = $("boton_filtrar");
    botonBorrarCuentas = $("boton_borrar");
    botonCrearCuenta = $("boton_crear");
    botonesGestion = $("botones_gestion");
    botonOrdenAscendente = $("boton_orden_ascendente");
    botonOrdenDescendente = $("boton_orden_descendente");
    botonObtenerEstadisticas = $("boton_obtener_estadisticas");
    filasEstadistica = $("zona_estadisticas");
    botonBuscarCuentas = $("boton_buscar");
    campoBuscarCuentas = $("campo_buscar");
    //Escribe el nombre del sistema en la parte superior
    $("letrero").insertAdjacentHTML("beforeend", miApp.obtenerNombreSistema());
    //Controla qué botones deben estar habilitados al principio
    controlarBotones(
        nomSer,
        botonFiltrarCuentas,
        botonBorrarCuentas,
        botonCrearCuenta,
        botonOrdenDescendente,
        botonOrdenAscendente,
        botonBuscarCuentas
    );
}


//FUNCIONES DE AYUDA
//Borrar cuentas
function resetearTabla() {
    filasTabla.innerHTML = "";
}
//Pintar checkbox
function pintarCheckBox(celdaReferencia) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    celdaReferencia.appendChild(checkbox);
}
//Insertar fila
function insertarFila(cuenta) {
    filasTabla.insertAdjacentHTML(
        "beforeend",
        inicioTabla + cuenta.nombreCuenta + orejeras +
                cuenta.nombreUsuario + orejeras +
                cuenta.fechaIngreso + orejeras +
                cuenta.saldo + orejeras +
                cuenta.tipoCuenta + orejeras +
                cuenta.puntos + finalTabla
    );
    pintarCheckBox(filasTabla.lastElementChild);
}
//Borrar datos del servidor
function borrarDatosServidor() {
    nomDir.innerHTML = "";
    nomSer.innerHTML = "";
    nomSis.innerHTML = "";
}
//Insertar datos del servidor
function insertarDatosServidor(servidor) {
    nomSer.insertAdjacentHTML("afterbegin", servidor.nombre);
    nomSis.insertAdjacentHTML("afterbegin", servidor.sistemaOperativo);
    nomDir.insertAdjacentHTML("afterbegin", servidor.direccionIp);
}
//Borrar datos de una cuenta creada
function borrarDatosCuentaNueva() {
    nombreCuenta.innerHTML = "";
    nombreUsuario.innerHTML = "";
    saldo.innerHTML = "";
    fechaIngreso.innerHTML = "";
}
//Ordena las cuentas mostradas
function ordenarCuentas(sentido) {
    var filasCompletas = [],
        filasParaInsertar = [],
        filasActuales = Array.from(filasTabla.children);
    filasActuales.forEach(function (fila) {
        return this.push(Array.from(fila.children));
    }, filasCompletas);
    filasCompletas.sort(function (a, b) {
        var resultado;
        if (sentido === SENTIDO_ASC) {
            if (a[4].textContent < b[4].textContent) {
                resultado = -1;
            } else if (a[4].textContent > b[4].textContent) {
                resultado = 1;
            } else {
                resultado = 0;
            }
        } else {
            if (a[4].textContent > b[4].textContent) {
                resultado = -1;
            } else if (a[4].textContent < b[4].textContent) {
                resultado = 1;
            } else {
                resultado = 0;
            }
        }
        return resultado;
    }, sentido);
    filasCompletas.forEach(function (fila) {
        var datos = {
            nombreCuenta: fila[0].textContent,
            nombreUsuario: fila[1].textContent,
            fechaIngreso: fila[2].textContent,
            saldo: fila[3].textContent,
            tipoCuenta: fila[4].textContent,
            puntos: fila[5].textContent
        };
        return filasParaInsertar.push(datos);
    });
    return filasParaInsertar;
}
//Asigna el valor correspondiente al tramo
function asignarValor(indice, tramos) {
    var valor;
    if (indice === "Tramo_1") {
        valor = tramos.Tramo_1;
    } else if (indice === "Tramo_2") {
        valor = tramos.Tramo_2;
    } else {
        valor = tramos.Tramo_3;
    }
    return valor;
}


//BOTONES
function seleccionarServidor() {
    var servidorElegido = miApp.elegirServidor(servidor.value);
    borrarDatosServidor(nomDir, nomSer, nomDir);
    insertarDatosServidor(servidorElegido);
    resetearTabla();
    miApp.recuperarCuentas(servidorElegido).forEach(insertarFila);
    //Habilita botones una vez elegido el servidor
    controlarBotones(
        nomSer,
        botonFiltrarCuentas,
        botonBorrarCuentas,
        botonCrearCuenta,
        botonOrdenDescendente,
        botonOrdenAscendente,
        botonBuscarCuentas
    );
}

function crearCuenta() {
    var servidorElegido = miApp.elegirServidor(servidor.value),
        idNombreCuenta = nombreCuenta.value,
        idNombreUsuario = nombreUsuario.value,
        idFechaIngreso = fechaIngreso.value,
        idSaldo = saldo.value,
        idPuntos = puntosCuenta.value,
        idTipoCuenta = tipoCuenta.value,
        cuentaNueva = {
            nombre_de_cuenta: idNombreCuenta,
            nombre_de_usuario: idNombreUsuario,
            fecha_ingreso: idFechaIngreso,
            saldo_cuenta: idSaldo,
            puntos: idPuntos,
            tipo_de_cuenta: idTipoCuenta
        };
    if (filaDatosCuenta.children.length > 1) {
        filaDatosCuenta.lastElementChild.remove();
    }
    if (miApp.ingresarCuentas(cuentaNueva, servidorElegido)) {
        resetearTabla();
        miApp.recuperarCuentas(servidorElegido).forEach(insertarFila);
        borrarDatosCuentaNueva();
    } else {
        filaDatosCuenta.insertAdjacentHTML(
            "beforeend",
            `<tr><td colspan=6><h2>${MENSAJE_ERROR}</h2>${finalTabla}`
        );
    }
}

function borrarCuentas() {
    var cuentasChecked = [],
        servidorElegido = miApp.elegirServidor(servidor.value),
        filasCuentas = Array.from(filasTabla.children);
    filasCuentas.forEach(function (fila) {
        var celdasFila = Array.from(fila.children);
        if (celdasFila[COLUMNA_CHECK].checked) {
            cuentasChecked.push(celdasFila[NOMBRE_CUENTA].textContent);
        }
    });
    miApp.eliminarCuentas(servidorElegido, cuentasChecked);
    resetearTabla();
    miApp.recuperarCuentas(servidorElegido).forEach(insertarFila);
}

function filtrarCuentas() {
    var servidorElegido = miApp.elegirServidor(servidor.value);
    resetearTabla();
    miApp.seleccionarCuentas(servidorElegido, tipoFiltro.value).forEach(insertarFila);
}

function obtenerSaldoMedio() {
    saldoMedio.innerHTML = miApp.obtenerSaldoMedio();
}

function ordenarAsc() {
    var filasParaInsertar = ordenarCuentas(SENTIDO_ASC);
    resetearTabla();
    filasParaInsertar.forEach(insertarFila);
}

function ordenarDesc() {
    var filasParaInsertar = ordenarCuentas(SENTIDO_DESC);
    resetearTabla();
    filasParaInsertar.forEach(insertarFila);
}

function obtenerEstadisticas() {
    var tramos = miApp.obtenerEstadisticas(),
        nombreTramos = Object.keys(tramos);
    filasEstadistica.innerHTML = "";
    nombreTramos.forEach(function (elemento) {
        filasEstadistica.insertAdjacentHTML(
            "beforeend",
            `${inicioTabla}${elemento}: ${asignarValor(elemento, tramos)}` +
                    ` cuentas${orejeras}${finalTabla}`
        );
    });
}

function localizarCuentas() {
    resetearTabla();
    miApp.buscarCuentas(campoBuscarCuentas).forEach(insertarFila);
}
