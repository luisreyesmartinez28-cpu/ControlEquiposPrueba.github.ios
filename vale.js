// ==========================================
// ETAPA 6 - VALE DE ENTREGA
// ==========================================

let entregaValeActual = null;


/* ==========================================
   ABRIR VALE
========================================== */

function abrirValeEntrega(idEntrega) {

    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id === idEntrega
        );


    if (!entrega) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    entregaValeActual =
        entrega.id;


    cargarDatosVale(
        entrega
    );


    document
        .getElementById(
            "modalValeEntrega"
        )
        .classList.remove(
            "hidden"
        );

}


/* ==========================================
   CERRAR VALE
========================================== */

function cerrarValeEntrega() {

    document
        .getElementById(
            "modalValeEntrega"
        )
        .classList.add(
            "hidden"
        );


    entregaValeActual =
        null;

}


/* ==========================================
   CARGAR DATOS
========================================== */

function cargarDatosVale(entrega) {

    if (!entrega) {
        return;
    }


    // ======================================
    // DATOS GENERALES
    // ======================================

    actualizarTextoVale(
        "valeNumero",
        entrega.numero || "-"
    );


    actualizarTextoVale(
        "valeFecha",
        entrega.fecha || "-"
    );


    actualizarTextoVale(
        "valeEstado",
        formatearEstadoReporte(
            entrega.estado
        )
    );


    actualizarTextoVale(
        "valeAtendido",
        entrega.atendidoPor || "-"
    );


    actualizarTextoVale(
        "valeDni",
        entrega.dni || "-"
    );


    actualizarTextoVale(
        "valeTrabajador",
        entrega.trabajador || "-"
    );


    actualizarTextoVale(
        "valeCargo",
        entrega.cargo || "-"
    );


    actualizarTextoVale(
        "valeArea",
        entrega.area || "-"
    );


    actualizarTextoVale(
        "valeObservacion",
        entrega.observacion || "-"
    );


    actualizarTextoVale(
        "valeFirmaNombre",
        entrega.trabajador || "-"
    );


    actualizarTextoVale(
        "valeFirmaDni",
        entrega.dni || "-"
    );


    actualizarTextoVale(
        "valeAtendidoFirma",
        entrega.atendidoPor || "-"
    );


    actualizarTextoVale(
        "valeFechaGeneracion",
        obtenerFechaHoraActualVale()
    );


    // ======================================
    // EQUIPOS DE LA ENTREGA
    // ======================================

    cargarEquiposEnVale(
        entrega
    );


    // ======================================
    // FIRMA
    // ======================================

    const firmaImagen =
        document.getElementById(
            "valeFirmaImagen"
        );


    const firmaPendiente =
        document.getElementById(
            "valeFirmaPendiente"
        );


    if (
        entrega.firma &&
        firmaImagen
    ) {

        firmaImagen.src =
            entrega.firma;


        firmaImagen.classList.remove(
            "hidden"
        );


        if (firmaPendiente) {

            firmaPendiente.classList.add(
                "hidden"
            );

            firmaPendiente.style.display =
            "none";

        }

    }

    else {

        if (firmaImagen) {

            firmaImagen.removeAttribute(
                "src"
            );


            firmaImagen.classList.add(
                "hidden"
            );

            firmaImagen.style.display =
            "none";

        }


        if (firmaPendiente) {

            firmaPendiente.classList.remove(
                "hidden"
            );

            firmaPendiente.style.display =
            "flex";

        }

    }

}


/* ==========================================
   FECHA Y HORA
========================================== */

function obtenerFechaHoraActualVale() {

    const fecha =
        new Date();


    return fecha.toLocaleString(
        "es-PE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* ==========================================
   IMPRIMIR
========================================== */

function imprimirValeEntrega() {

    if (!entregaValeActual) {

        alert(
            "No hay un vale seleccionado."
        );

        return;

    }


    imprimirDocumentoVale();

}


/* ==========================================
   GENERAR PDF
========================================== */

function generarPDFValeEntrega() {

    if (!entregaValeActual) {

        alert(
            "No hay un vale seleccionado."
        );

        return;

    }


    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id ===
                entregaValeActual
        );


    if (!entrega) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    imprimirDocumentoVale();

}


/* ==========================================
   CREAR DOCUMENTO PARA IMPRESION
========================================== */

function imprimirDocumentoVale() {

    const documento =
        document.getElementById(
            "valeEntregaDocumento"
        );


    if (!documento) {

        alert(
            "No se encontró el documento."
        );

        return;

    }


    const contenido =
        documento.outerHTML;


    const estilos =
        obtenerEstilosValeImpresion();


    const ventana =
        window.open(
            "",
            "_blank",
            "width=1000,height=800"
        );


    if (!ventana) {

        alert(
            "El navegador bloqueó la ventana de impresión."
        );

        return;

    }


    ventana.document.write(`

        <!DOCTYPE html>

        <html lang="es">

        <head>

            <meta charset="UTF-8">

            <title>
                ${obtenerTituloVale()}
            </title>

            <style>

                ${estilos}

            </style>

        </head>


        <body>

            ${contenido}

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
   TITULO ARCHIVO
========================================== */

function obtenerTituloVale() {

    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id ===
                entregaValeActual
        );


    if (!entrega) {

        return "Vale_Entrega";

    }


    return (
        "Vale_" +
        entrega.numero
    );

}


/* ==========================================
   ESTILOS DE IMPRESION
========================================== */

function obtenerEstilosValeImpresion() {

    return `

        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;

            width: 100%;

            background: #ffffff;

            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .vale-document {
            width: 100%;

            max-width: 194mm;

            min-height: 275mm;

            margin: 0 auto;

            padding: 8mm;

            background: #ffffff;

            border: 1.5px solid #0b1728;

            box-sizing: border-box;

            overflow: visible;
        }


        .vale-header {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 20px;

            padding-bottom: 18px;

            border-bottom:
                2px solid #0d2c4d;

        }


        .vale-company {

            display: flex;

            align-items: center;

            gap: 15px;

        }


        .brand-logo {
            width: 92px;
            height: 92px;

            display: flex;
            align-items: center;
            justify-content: center;

            flex-shrink: 0;

            padding: 5px;

            overflow: hidden;

            border-radius: 16px;

            background: transparent;
        }


        .sidebar-logo-img {
            width: 100%;
            height: 100%;

            display: block;

            object-fit: contain;

            border-radius: 12px;
        }


        .vale-company h1 {

            margin: 0;

            color: #0d2c4d;

            font-size: 19px;

        }


        .vale-company p {

            margin: 4px 0 0;

            color: #64748b;

            font-size: 9px;

        }


        .vale-number {

            min-width: 140px;

            padding: 10px;

            text-align: center;

            border:
                2px solid #0d2c4d;

        }


        .vale-number span {

            display: block;

            font-size: 8px;

        }


        .vale-number strong {

            display: block;

            margin-top: 4px;

            font-size: 18px;

        }


        .vale-title {

            padding: 20px 0;

            text-align: center;

        }


        .vale-title h2 {

            margin: 0;

            font-size: 17px;

        }


        .vale-title p {

            margin-top: 4px;

            color: #64748b;

            font-size: 9px;

        }


        .vale-section {

            margin-bottom: 17px;

        }


        .vale-section-title {

            margin-bottom: 8px;

            padding: 6px 9px;

            color: white;

            background: #0d2c4d;

            font-size: 8px;

            font-weight: bold;

        }


        .vale-data-grid {

            display: grid;

            grid-template-columns:
                repeat(3,1fr);

            border:
                1px solid #cbd5e1;

        }


        .vale-data-grid.two-columns {

            grid-template-columns:
                repeat(2,1fr);

        }


        .vale-data-grid > div {

            min-height: 48px;

            padding: 9px;

            border-right:
                1px solid #cbd5e1;

            border-bottom:
                1px solid #cbd5e1;

        }


        .vale-data-grid span {

            display: block;

            color: #64748b;

            font-size: 7px;

            font-weight: bold;

            text-transform: uppercase;

        }


        .vale-data-grid strong {

            display: block;

            margin-top: 4px;

            font-size: 9px;

        }


        .vale-equipment-table {

            width: 100%;

            border-collapse:
                collapse;

        }


        .vale-equipment-table th {

            padding: 7px;

            color: white;

            background: #1e3a5f;

            border:
                1px solid #94a3b8;

            font-size: 7px;

        }


        .vale-equipment-table td {

            padding: 10px 6px;

            border:
                1px solid #94a3b8;

            text-align: center;

            font-size: 8px;

        }


        .vale-observation {

            min-height: 50px;

            padding: 10px;

            border:
                1px solid #cbd5e1;

            font-size: 9px;

        }


        .vale-signature-section {

            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 60px;

            margin-top: 35px;

        }


        .vale-signature-box,
        .vale-attendant-box {

            min-height: 130px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: flex-end;

            text-align: center;

        }


        .vale-signature-image {

            width: 220px;

            height: 80px;

            display: flex;

            align-items: center;

            justify-content: center;

        }


        .vale-signature-image img {

            max-width: 210px;

            max-height: 78px;

            object-fit: contain;

        }


        .vale-no-signature {

            color: #94a3b8;

            font-size: 9px;

            font-weight: bold;

        }


        .vale-signature-line {

            width: 230px;

            border-top:
                1px solid black;

        }


        .vale-signature-box strong,
        .vale-attendant-box strong {

            margin-top: 6px;

            font-size: 9px;

        }


        .vale-signature-box span,
        .vale-attendant-box span {

            margin-top: 3px;

            color: #475569;

            font-size: 8px;

        }


        .vale-signature-box small {

            margin-top: 4px;

            font-size: 7px;

        }


        .vale-attendant-icon {

            width: 45px;

            height: 45px;

            margin-bottom: 25px;

            display: flex;

            align-items: center;

            justify-content: center;

            border:
                1px solid #94a3b8;

            border-radius: 50%;

        }


        .vale-footer {

            display: flex;

            justify-content: space-between;

            margin-top: 25px;

            padding-top: 8px;

            color: #64748b;

            border-top:
                1px solid #cbd5e1;

            font-size: 6px;

        }

        .hidden {
            display: none !important;
        }


        .vale-no-signature.hidden {
            display: none !important;
        }


        .vale-signature-image.hidden {
            display: none !important;
        }

        .vale-equipment-table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            font-size: 7px;
        }

        .vale-equipment-table th,
        .vale-equipment-table td {
            padding: 5px 3px;
            text-align: center;
            vertical-align: middle;
            word-break: break-word;
            overflow-wrap: anywhere;
        }

        .vale-equipment-table th:nth-child(1),
        .vale-equipment-table td:nth-child(1) {
            width: 5%;
        }

        .vale-equipment-table th:nth-child(2),
        .vale-equipment-table td:nth-child(2) {
            width: 11%;
        }

        .vale-equipment-table th:nth-child(3),
        .vale-equipment-table td:nth-child(3) {
            width: 12%;
        }

        .vale-equipment-table th:nth-child(4),
        .vale-equipment-table td:nth-child(4) {
            width: 10%;
        }

        .vale-equipment-table th:nth-child(5),
        .vale-equipment-table td:nth-child(5) {
            width: 12%;
        }

        .vale-equipment-table th:nth-child(6),
        .vale-equipment-table td:nth-child(6) {
            width: 15%;
        }

        .vale-equipment-table th:nth-child(7),
        .vale-equipment-table td:nth-child(7) {
            width: 15%;
        }

        .vale-equipment-table th:nth-child(8),
        .vale-equipment-table td:nth-child(8) {
            width: 20%;
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

    `;

}

function actualizarTextoVale(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor;

    }

}

function obtenerDevolucionEquipoVale(
    entrega,
    equipoEntrega
) {

    const devoluciones =
        obtenerDevoluciones();


    const devolucionEncontrada =
        devoluciones.find(
            devolucion => {

                // ======================================
                // NUEVO FORMATO: devolucion.equipos[]
                // ======================================

                if (
                    Array.isArray(
                        devolucion.equipos
                    )
                ) {

                    return devolucion.equipos
                        .some(
                            equipo =>

                                equipo.equipoId ===
                                    equipoEntrega.equipoId

                                ||

                                (
                                    equipo.serie &&
                                    equipoEntrega.serie &&
                                    String(
                                        equipo.serie
                                    ).toLowerCase() ===
                                    String(
                                        equipoEntrega.serie
                                    ).toLowerCase()
                                )
                        );

                }


                // ======================================
                // FORMATO ANTIGUO
                // ======================================

                return (

                    devolucion.equipoId ===
                        equipoEntrega.equipoId

                    ||

                    (
                        devolucion.serie &&
                        equipoEntrega.serie &&
                        String(
                            devolucion.serie
                        ).toLowerCase() ===
                        String(
                            equipoEntrega.serie
                        ).toLowerCase()
                    )

                );

            }
        );


    return devolucionEncontrada || null;

}

function cargarEquiposEnVale(
    entrega
) {

    const tbody =
        document.getElementById(
            "valeEquiposTableBody"
        );


    if (!tbody) {

        console.warn(
            "No existe #valeEquiposTableBody"
        );

        return;

    }


    const equipos =
        obtenerEquiposDeEntrega(
            entrega
        );


    tbody.innerHTML = "";


    if (
        equipos.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:20px;
                    "
                >
                    No hay equipos registrados.
                </td>

            </tr>

        `;

        return;

    }


    equipos.forEach(
        (
            equipo,
            index
        ) => {

            const devolucion =
                obtenerDevolucionEquipoVale(
                    entrega,
                    equipo
                );


            const fechaDevolucion =
                devolucion
                    ? (
                        devolucion.fecha ||
                        "-"
                    )
                    : "-";


            const recepcionadoPor =
                devolucion
                    ? (
                        devolucion.recibidoPor ||
                        "-"
                    )
                    : "-";


            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    ${escapeHTML(
                        equipo.codigoEquipo ||
                        equipo.codigo ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        equipo.tipoEquipo ||
                        equipo.tipo ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        equipo.marca ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        equipo.modelo ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        equipo.serie ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        fechaDevolucion
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        recepcionadoPor
                    )}

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}