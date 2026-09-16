// ==========================================
// ETAPA 10 - REPORTES
// ==========================================

let tipoReporteActual = "equipos";

let datosReporteActual = [];


/* ==========================================
   CAMBIAR REPORTE
========================================== */

function cambiarTipoReporte(tipo) {

    tipoReporteActual =
        tipo;


    document
        .querySelectorAll(
            ".report-type-card"
        )
        .forEach(
            boton => {

                boton.classList.remove(
                    "active"
                );

            }
        );


    const botonActivo =
        document.getElementById(
            tipo === "equipos"
                ? "btnReporteEquipos"
                : tipo === "entregas"
                    ? "btnReporteEntregas"
                    : "btnReporteDevoluciones"
        );


    if (botonActivo) {

        botonActivo.classList.add(
            "active"
        );

    }


    actualizarTextoSeguro(
        "reporteTipoActual",
        obtenerNombreTipoReporte(tipo)
    );


    actualizarTextoSeguro(
        "tituloFiltroReporte",
        "Reporte de " +
        obtenerNombreTipoReporte(tipo)
    );


    configurarEstadosReporte();


    aplicarFiltrosReporte();

}


/* ==========================================
   NOMBRE REPORTE
========================================== */

function obtenerNombreTipoReporte(tipo) {

    if (
        tipo === "equipos"
    ) {

        return "Equipos";

    }


    if (
        tipo === "entregas"
    ) {

        return "Entregas";

    }


    return "Devoluciones";

}


/* ==========================================
   ESTADOS SEGUN REPORTE
========================================== */

function configurarEstadosReporte() {

    const select =
        document.getElementById(
            "estadoReporte"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Todos los estados
        </option>

    `;


    let estados = [];


    if (
        tipoReporteActual ===
        "equipos"
    ) {

        estados = [

            "Disponible",

            "Entregado",

            "Mantenimiento",

            "Baja"

        ];

    }


    else if (
        tipoReporteActual ===
        "entregas"
    ) {

        estados = [

            "PENDIENTE_FIRMA",

            "FIRMADO",

            "DEVUELTO"

        ];

    }


    else {

        estados = [

            "Bueno",

            "Regular",

            "Dañado",

            "Mantenimiento"

        ];

    }


    estados.forEach(
        estado => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                estado;


            option.textContent =
                formatearEstadoReporte(
                    estado
                );


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   ESTADO LEGIBLE
========================================== */

function formatearEstadoReporte(
    estado
) {

    if (
        estado ===
        "PENDIENTE_FIRMA"
    ) {

        return "Pendiente de firma";

    }


    if (
        estado ===
        "FIRMADO"
    ) {

        return "Firmado";

    }


    if (
        estado ===
        "DEVUELTO"
    ) {

        return "Devuelto";

    }


    return estado || "-";

}


/* ==========================================
   OBTENER DATOS BASE
========================================== */

function obtenerDatosBaseReporte() {

    if (
        tipoReporteActual ===
        "equipos"
    ) {

        return obtenerEquipos();

    }


    if (
        tipoReporteActual ===
        "entregas"
    ) {

        return obtenerEntregas();

    }


    return obtenerDevoluciones();

}


/* ==========================================
   APLICAR FILTROS
========================================== */

function aplicarFiltrosReporte() {

    const buscar =
        document.getElementById(
            "buscarReporte"
        );


    const fechaDesde =
        document.getElementById(
            "fechaDesdeReporte"
        );


    const fechaHasta =
        document.getElementById(
            "fechaHastaReporte"
        );


    const estado =
        document.getElementById(
            "estadoReporte"
        );


    if (
        !buscar ||
        !fechaDesde ||
        !fechaHasta ||
        !estado
    ) {

        return;

    }


    const texto =
        buscar.value
            .trim()
            .toLowerCase();


    const desde =
        fechaDesde.value;


    const hasta =
        fechaHasta.value;


    const estadoSeleccionado =
        estado.value;


    const datos =
        obtenerDatosBaseReporte();


    const filtrados =
        datos.filter(
            item => {

                const coincideTexto =
                    buscarTextoReporte(
                        item,
                        texto
                    );


                const fechaItem =
                    obtenerFechaItemReporte(
                        item
                    );


                const coincideDesde =
                    !desde ||
                    (
                        fechaItem &&
                        fechaItem >=
                        convertirFechaFiltro(
                            desde
                        )
                    );


                const coincideHasta =
                    !hasta ||
                    (
                        fechaItem &&
                        fechaItem <=
                        convertirFechaFiltroFinal(
                            hasta
                        )
                    );


                const coincideEstado =
                    validarEstadoReporte(
                        item,
                        estadoSeleccionado
                    );


                return (
                    coincideTexto &&
                    coincideDesde &&
                    coincideHasta &&
                    coincideEstado
                );

            }
        );


    datosReporteActual =
        filtrados;


    renderizarReporte(
        filtrados
    );


    actualizarTextoSeguro(
        "reporteTotalRegistros",
        filtrados.length
    );

}


/* ==========================================
   BUSQUEDA
========================================== */

function buscarTextoReporte(
    item,
    texto
) {

    if (!texto) {

        return true;

    }


    let campos = [];


    if (
        tipoReporteActual ===
        "equipos"
    ) {

        campos = [

            item.codigo,

            item.tipo,

            item.marca,

            item.modelo,

            item.serie,

            item.estado,

            item.ubicacion

        ];

    }


    else if (
        tipoReporteActual ===
        "entregas"
    ) {

        campos = [

            item.numero,

            item.dni,

            item.trabajador,

            item.cargo,

            item.area,

            obtenerTextoCodigosReporte(item),

            obtenerTextoEquiposReporte(item),

            obtenerTextoSeriesReporte(item),

            item.atendidoPor

        ];

    }


    else {

        campos = [

            item.numero,

            item.numeroEntrega,

            item.dni,

            item.trabajador,

            obtenerTextoCodigosReporte(item),

            obtenerTextoEquiposReporte(item),

            obtenerTextoSeriesReporte(item),

            obtenerEstadoRecibidoReporte(item),

            obtenerNuevoEstadoReporte(item),

            item.recibidoPor

        ];

    }


    return campos.some(
        campo =>
            String(
                campo || ""
            )
            .toLowerCase()
            .includes(
                texto
            )
    );

}


/* ==========================================
   FECHA ITEM
========================================== */

function obtenerFechaItemReporte(
    item
) {

    if (
        item.fechaRegistro
    ) {

        const fecha =
            new Date(
                item.fechaRegistro
            );


        if (
            !isNaN(
                fecha.getTime()
            )
        ) {

            return fecha.getTime();

        }

    }


    if (
        item.fecha
    ) {

        const partes =
            String(
                item.fecha
            )
            .split("/");


        if (
            partes.length === 3
        ) {

            const fecha =
                new Date(
                    Number(partes[2]),
                    Number(partes[1]) - 1,
                    Number(partes[0])
                );


            return fecha.getTime();

        }

    }


    return null;

}


/* ==========================================
   FECHA FILTRO
========================================== */

function convertirFechaFiltro(
    fecha
) {

    const [
        anio,
        mes,
        dia
    ] =
        fecha.split("-");


    return new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        0,
        0,
        0
    ).getTime();

}


function convertirFechaFiltroFinal(
    fecha
) {

    const [
        anio,
        mes,
        dia
    ] =
        fecha.split("-");


    return new Date(
        Number(anio),
        Number(mes) - 1,
        Number(dia),
        23,
        59,
        59
    ).getTime();

}


/* ==========================================
   ESTADO
========================================== */

function validarEstadoReporte(
    item,
    estado
) {

    if (!estado) {

        return true;

    }


    if (
        tipoReporteActual ===
        "equipos"
    ) {

        return (
            item.estado ===
            estado
        );

    }


    if (
        tipoReporteActual ===
        "entregas"
    ) {

        return (
            item.estado ===
            estado
        );

    }


    return (
        item.estadoRecibido ===
        estado
    );

}


/* ==========================================
   RENDERIZAR REPORTE
========================================== */

function renderizarReporte(
    datos
) {

    const thead =
        document.getElementById(
            "reporteTableHead"
        );


    const tbody =
        document.getElementById(
            "reporteTableBody"
        );


    if (
        !thead ||
        !tbody
    ) {

        return;

    }


    thead.innerHTML = "";

    tbody.innerHTML = "";


    if (
        tipoReporteActual ===
        "equipos"
    ) {

        renderizarReporteEquipos(
            datos,
            thead,
            tbody
        );

    }


    else if (
        tipoReporteActual ===
        "entregas"
    ) {

        renderizarReporteEntregas(
            datos,
            thead,
            tbody
        );

    }


    else {

        renderizarReporteDevoluciones(
            datos,
            thead,
            tbody
        );

    }

    

}


/* ==========================================
   REPORTE EQUIPOS
========================================== */

function renderizarReporteEquipos(
    datos,
    thead,
    tbody
) {

    thead.innerHTML = `

        <tr>

            <th>Código</th>

            <th>Equipo</th>

            <th>Marca</th>

            <th>Modelo</th>

            <th>Serie</th>

            <th>Ubicación</th>

            <th>Estado</th>

            <th>Fecha registro</th>

        </tr>

    `;


    if (
        datos.length === 0
    ) {

        mostrarReporteVacio(
            tbody,
            8
        );

        return;

    }


    datos.forEach(
        equipo => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            equipo.codigo
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        equipo.tipo
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        equipo.marca
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        equipo.modelo || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        equipo.serie
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        equipo.ubicacion || "-"
                    )}
                </td>

                <td>

                    <span
                        class="
                            status-equipment
                            ${normalizarClaseEstado(
                                equipo.estado
                            )}
                        "
                    >

                        ${escapeHTML(
                            equipo.estado
                        )}

                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        equipo.fecha || "-"
                    )}
                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   REPORTE ENTREGAS
========================================== */

function renderizarReporteEntregas(
    datos,
    thead,
    tbody
) {

    thead.innerHTML = `

        <tr>

            <th>N° Entrega</th>

            <th>Fecha</th>

            <th>DNI</th>

            <th>Trabajador</th>

            <th>Equipo</th>

            <th>Serie</th>

            <th>Atendido por</th>

            <th>Estado</th>

        </tr>

    `;


    if (
        datos.length === 0
    ) {

        mostrarReporteVacio(
            tbody,
            8
        );

        return;

    }


    datos.forEach(
        entrega => {

            const fila =
                document.createElement(
                    "tr"
                );

            const textoEquipos =
                obtenerTextoEquiposReporte(
                    entrega
                );
            


            const textoSeries =
                obtenerTextoSeriesReporte(
                    entrega
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            entrega.numero
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        entrega.fecha || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        entrega.dni
                    )}
                </td>

                <td>

                    <strong>
                        ${escapeHTML(
                            entrega.trabajador
                        )}
                    </strong>

                    <small
                        style="
                            display:block;
                            margin-top:3px;
                            color:#64748b;
                        "
                    >

                        ${escapeHTML(
                            entrega.cargo ||
                            entrega.area ||
                            ""
                        )}

                    </small>

                </td>

                <td>

                    ${escapeHTML(
                    textoEquipos
                    )}

                    <small
                        style="
                            display:block;
                            margin-top:3px;
                            color:#64748b;
                        "
                    >

                    </small>

                </td>

                <td>
                    ${escapeHTML(
                    textoSeries
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        entrega.atendidoPor || "-"
                    )}
                </td>

                <td>

                    <span
                        class="status-equipment"
                    >

                        ${escapeHTML(
                            formatearEstadoReporte(
                                entrega.estado
                            )
                        )}

                    </span>

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   REPORTE DEVOLUCIONES
========================================== */

function renderizarReporteDevoluciones(
    datos,
    thead,
    tbody
) {

    thead.innerHTML = `

        <tr>

            <th>N° Devolución</th>

            <th>Fecha</th>

            <th>N° Entrega</th>

            <th>DNI</th>

            <th>Trabajador</th>

            <th>Equipo</th>

            <th>Estado recibido</th>

            <th>Recibido por</th>

        </tr>

    `;


    if (
        datos.length === 0
    ) {

        mostrarReporteVacio(
            tbody,
            9
        );

        return;

    }


    datos.forEach(
        devolucion => {

            const fila =
                document.createElement(
                    "tr"
                );

            const textoEquipos =
                obtenerTextoEquiposReporte(
                    devolucion
                );


            const textoSeries =
                obtenerTextoSeriesReporte(
                    devolucion
                );

            const numeroEntrega =
                obtenerNumerosEntregaDevolucion(
                    devolucion
                );

            const estadoRecibido =
                obtenerEstadoRecibidoDevolucion(
                    devolucion
                );


            fila.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            devolucion.numero
                        )}
                    </strong>

                </td>


                <td>
                    ${escapeHTML(
                        devolucion.fecha || "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        numeroEntrega
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        devolucion.dni
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        devolucion.trabajador
                    )}
                </td>


                <td>

                    ${escapeHTML(
                    textoEquipos
                    )}

                    <small
                        style="
                            display:block;
                            color:#64748b;
                            margin-top:3px;
                        "
                    >

                        ${escapeHTML(
                        textoSeries
                        )}

                    </small>

                </td>


                <td>

                    <span
                        class="
                            return-condition
                            ${normalizarClaseEstado(
                                estadoRecibido
                            )}
                        "
                    >

                        ${escapeHTML(
                            estadoRecibido
                        )}

                    </span>

                </td>

                <td>
                    ${escapeHTML(
                        devolucion.recibidoPor
                    )}
                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   REPORTE VACIO
========================================== */

function mostrarReporteVacio(
    tbody,
    columnas
) {

    tbody.innerHTML = `

        <tr>

            <td
                colspan="${columnas}"
                style="
                    text-align:center;
                    padding:40px;
                    color:#64748b;
                "
            >

                <i
                    class="fa-solid fa-chart-column"
                    style="
                        display:block;
                        margin-bottom:10px;
                        font-size:27px;
                    "
                ></i>

                No existen registros para los filtros seleccionados.

            </td>

        </tr>

    `;

}


/* ==========================================
   LIMPIAR FILTROS
========================================== */

function limpiarFiltrosReporte() {

    document.getElementById(
        "buscarReporte"
    ).value = "";


    document.getElementById(
        "fechaDesdeReporte"
    ).value = "";


    document.getElementById(
        "fechaHastaReporte"
    ).value = "";


    document.getElementById(
        "estadoReporte"
    ).value = "";


    aplicarFiltrosReporte();

}


/* ==========================================
   EXPORTAR EXCEL
========================================== */

function exportarReporteExcel() {

    if (
        datosReporteActual.length === 0
    ) {

        alert(
            "No existen registros para exportar."
        );

        return;

    }


    if (
        typeof XLSX ===
        "undefined"
    ) {

        alert(
            "No se cargó la librería de Excel."
        );

        return;

    }


    const datosExcel =
        convertirDatosReporteExcel();


    const hoja =
        XLSX.utils.json_to_sheet(
            datosExcel
        );


    const libro =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        obtenerNombreTipoReporte(
            tipoReporteActual
        )
    );


    const fecha =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    XLSX.writeFile(
        libro,
        "Reporte_" +
        obtenerNombreTipoReporte(
            tipoReporteActual
        ) +
        "_" +
        fecha +
        ".xlsx"
    );

}


/* ==========================================
   CONVERTIR DATOS EXCEL
========================================== */

function convertirDatosReporteExcel() {

    if (
        tipoReporteActual ===
        "equipos"
    ) {

        return datosReporteActual.map(
            equipo => ({

                "Código":
                    equipo.codigo,

                "Equipo":
                    equipo.tipo,

                "Marca":
                    equipo.marca,

                "Modelo":
                    equipo.modelo || "",

                "Serie":
                    equipo.serie,

                "Ubicación":
                    equipo.ubicacion || "",

                "Estado":
                    equipo.estado,

                "Fecha Registro":
                    equipo.fecha || ""

            })
        );

    }


    if (
        tipoReporteActual ===
        "entregas"
    ) {

        return datosReporteActual.map(
            entrega => ({

                "N° Entrega":
                    entrega.numero,

                "Fecha":
                    entrega.fecha,

                "DNI":
                    entrega.dni,

                "Trabajador":
                    entrega.trabajador,

                "Cargo":
                    entrega.cargo || "",

                "Área":
                    entrega.area || "",

                "Código Equipo":
                    obtenerTextoCodigosReporte(
                        entrega
                    ),

                "Equipo":
                    obtenerTextoEquiposReporte(
                        entrega
                    ),

                "Marca":
                    entrega.marca,

                "Modelo":
                    entrega.modelo || "",

                "Serie":
                    obtenerTextoSeriesReporte(
                        entrega
                    ),

                "Atendido por":
                    entrega.atendidoPor,

                "Estado":
                    formatearEstadoReporte(
                        entrega.estado
                    )

            })
        );

    }


    return datosReporteActual.map(
    devolucion => ({

        "N° Devolución":
            devolucion.numero || "",

        "Fecha":
            devolucion.fecha || "",

        "N° Entrega":
            devolucion.numeroEntrega || "",

        "DNI":
            devolucion.dni || "",

        "Trabajador":
            devolucion.trabajador || "",

        "Código Equipo":
            obtenerTextoCodigosReporte(
                devolucion
            ),

        "Equipo":
            obtenerTextoEquiposReporte(
                devolucion
            ),

        "Serie":
            obtenerTextoSeriesReporte(
                devolucion
            ),

        "Estado recibido":
            obtenerEstadoRecibidoReporte(
                devolucion
            ),

        "Nuevo estado":
            obtenerNuevoEstadoReporte(
                devolucion
            ),

        "Observaciones":
            devolucion.observacion || "",

        "Recibido por":
            devolucion.recibidoPor || ""

    })
);

}


/* ==========================================
   GENERAR PDF
========================================== */

function generarReportePDF() {

    if (
        datosReporteActual.length === 0
    ) {

        alert(
            "No existen registros para generar el reporte."
        );

        return;

    }


    const ventana =
        window.open(
            "",
            "_blank",
            "width=1200,height=800"
        );


    if (!ventana) {

        alert(
            "El navegador bloqueó la ventana de impresión."
        );

        return;

    }


    const fecha =
        new Date()
            .toLocaleString(
                "es-PE"
            );


    const tablaHTML =
        crearTablaReportePDF();


    ventana.document.write(`

        <!DOCTYPE html>

        <html lang="es">

        <head>

            <meta charset="UTF-8">

            <title>
                Reporte ${obtenerNombreTipoReporte(tipoReporteActual)}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 15mm;

                    color: #111827;

                    background: white;

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;
                }


                .report-print-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    gap: 20px;

                    padding-bottom: 15px;

                    border-bottom:
                        2px solid #0d2c4d;
                }


                .report-print-header h1 {
                    margin: 0;

                    color: #0d2c4d;

                    font-size: 20px;
                }


                .report-print-header p {
                    margin: 4px 0 0;

                    color: #64748b;

                    font-size: 9px;
                }


                .report-print-info {
                    text-align: right;

                    font-size: 8px;

                    color: #475569;
                }


                .report-print-title {
                    padding: 18px 0;

                    text-align: center;
                }


                .report-print-title h2 {
                    margin: 0;

                    font-size: 16px;
                }


                .report-print-title span {
                    display: block;

                    margin-top: 5px;

                    color: #64748b;

                    font-size: 8px;
                }


                table {
                    width: 100%;

                    border-collapse:
                        collapse;
                }


                th {
                    padding: 7px 5px;

                    color: white;

                    background:
                        #0d2c4d;

                    border:
                        1px solid #94a3b8;

                    font-size: 7px;

                    text-align: center;
                }


                td {
                    padding: 7px 5px;

                    border:
                        1px solid #cbd5e1;

                    font-size: 7px;

                    text-align: center;
                }


                .report-print-footer {
                    display: flex;
                    justify-content: space-between;

                    margin-top: 15px;

                    padding-top: 8px;

                    border-top:
                        1px solid #cbd5e1;

                    color: #64748b;

                    font-size: 7px;
                }


                @page {
                    size: A4 portrait;
                    margin: 8mm;
                }


                @media print {

                    body {
                        padding: 0;
                    }

                }

            </style>

        </head>

        <body>

            <div class="report-print-header">

                <div>

                    <h1>
                        CONTROL DE EQUIPOS
                    </h1>

                    <p>
                        Sistema de Gestión Tecnológica
                    </p>

                </div>


                <div class="report-print-info">

                    Generado:
                    ${escapeHTML(fecha)}

                    <br>

                    Total registros:
                    ${datosReporteActual.length}

                </div>

            </div>


            <div class="report-print-title">

                <h2>
                    REPORTE DE
                    ${obtenerNombreTipoReporte(tipoReporteActual).toUpperCase()}
                </h2>

                <span>
                    Reporte generado desde el Sistema de Control de Equipos
                </span>

            </div>


            ${tablaHTML}


            <div class="report-print-footer">

                <span>
                    Sistema de Control de Equipos
                </span>

                <span>
                    ${datosReporteActual.length}
                    registro(s)
                </span>

            </div>

        </body>

        </html>

    `);


    ventana.document.close();


    ventana.focus();


    setTimeout(
        function() {

            ventana.print();

        },
        500
    );

}


/* ==========================================
   TABLA PDF
========================================== */

function crearTablaReportePDF() {

    const datos =
        convertirDatosReporteExcel();


    if (
        datos.length === 0
    ) {

        return "";

    }


    const columnas =
        Object.keys(
            datos[0]
        );


    let html = `

        <table>

            <thead>

                <tr>

    `;


    columnas.forEach(
        columna => {

            html += `

                <th>
                    ${escapeHTML(columna)}
                </th>

            `;

        }
    );


    html += `

                </tr>

            </thead>

            <tbody>

    `;


    datos.forEach(
        fila => {

            html += "<tr>";


            columnas.forEach(
                columna => {

                    html += `

                        <td>
                            ${escapeHTML(
                                String(
                                    fila[columna] ??
                                    ""
                                )
                            )}
                        </td>

                    `;

                }
            );


            html += "</tr>";

        }
    );


    html += `

            </tbody>

        </table>

    `;


    return html;

}

function cargarReportes() {

    cambiarTipoReporte(
        tipoReporteActual ||
        "equipos"
    );

}

function obtenerTextoEquiposReporte(item) {

    // FORMATO NUEVO: varios equipos
    if (
        Array.isArray(item.equipos) &&
        item.equipos.length > 0
    ) {

        return item.equipos
            .map(
                equipo =>
                    equipo.tipoEquipo ||
                    equipo.tipo ||
                    "-"
            )
            .join(", ");

    }


    // FORMATO ANTIGUO: un solo equipo
    return (
        item.tipoEquipo ||
        item.tipo ||
        "-"
    );
}


function obtenerTextoSeriesReporte(item) {

    // FORMATO NUEVO
    if (
        Array.isArray(item.equipos) &&
        item.equipos.length > 0
    ) {

        return item.equipos
            .map(
                equipo =>
                    equipo.serie ||
                    "-"
            )
            .join(", ");

    }


    // FORMATO ANTIGUO
    return (
        item.serie ||
        "-"
    );
}


function obtenerTextoCodigosReporte(item) {

    if (
        Array.isArray(item.equipos) &&
        item.equipos.length > 0
    ) {

        return item.equipos
            .map(
                equipo =>
                    equipo.codigoEquipo ||
                    equipo.codigo ||
                    "-"
            )
            .join(", ");

    }


    return (
        item.codigoEquipo ||
        item.codigo ||
        "-"
    );
}

function obtenerEstadoRecibidoReporte(
    devolucion
) {

    return obtenerEstadoRecibidoDevolucion(
        devolucion
    );

    if (
        Array.isArray(devolucion.equipos) &&
        devolucion.equipos.length > 0
    ) {

        return devolucion.equipos
            .map(
                equipo =>
                    equipo.estadoRecibido ||
                    "-"
            )
            .join(", ");

    }


    return (
        devolucion.estadoRecibido ||
        "-"
    );
}


function obtenerNuevoEstadoReporte(
    devolucion
) {

    if (
        Array.isArray(devolucion.equipos) &&
        devolucion.equipos.length > 0
    ) {

        return devolucion.equipos
            .map(
                equipo =>
                    equipo.nuevoEstado ||
                    "-"
            )
            .join(", ");

    }


    return (
        devolucion.nuevoEstado ||
        "-"
    );
}

function obtenerDetalleEquiposReporteDevolucion(
    devolucion
) {

    const equipos =
        Array.isArray(
            devolucion.equipos
        )
        ? devolucion.equipos
        : [];


    if (
        equipos.length === 0
    ) {

        return `

            ${escapeHTML(
                devolucion.tipoEquipo ||
                "-"
            )}

            <br>

            <small>
                ${escapeHTML(
                    devolucion.serie ||
                    "-"
                )}
            </small>

        `;

    }


    return equipos
        .map(
            equipo => `

                <div class="report-return-item">

                    <strong>
                        ${escapeHTML(
                            equipo.tipoEquipo ||
                            "-"
                        )}
                    </strong>

                    <span>
                        Serie:
                        ${escapeHTML(
                            equipo.serie ||
                            "-"
                        )}
                    </span>

                    <span>
                        Estado:
                        ${escapeHTML(
                            equipo.estadoRecibido ||
                            "-"
                        )}
                    </span>

                </div>

            `
        )
        .join("");

}