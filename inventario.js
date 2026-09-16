// ==========================================
// ETAPA 8 - INVENTARIO GENERAL
// ==========================================


/* ==========================================
   CARGAR INVENTARIO
========================================== */

function cargarInventario(
    lista = null
) {

    const tbody =
        document.getElementById(
            "inventarioTableBody"
        );


    if (!tbody) {

        return;

    }


    const equipos =
        lista ||
        obtenerEquipos();


    tbody.innerHTML = "";


    cargarFiltroTiposInventario();


    if (
        equipos.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="
                        text-align:center;
                        padding:38px;
                        color:#64748b;
                    "
                >

                    <i
                        class="fa-solid fa-box-open"
                        style="
                            display:block;
                            margin-bottom:10px;
                            font-size:27px;
                        "
                    ></i>

                    No hay equipos en el inventario.

                </td>

            </tr>

        `;


        actualizarEstadisticasInventario();


        return;

    }


    equipos.forEach(
        equipo => {

            const ultimaEntrega =
                obtenerUltimaEntregaEquipo(
                    equipo.id
                );


            const ultimaDevolucion =
                obtenerUltimaDevolucionEquipo(
                    equipo.id
                );


            const responsable =
                obtenerResponsableActualEquipo(
                    equipo
                );


            const estadoClase =
                normalizarClaseEstado(
                    equipo.estado
                );


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
                        equipo.modelo ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        equipo.serie
                    )}

                </td>


                <td>

                    <span
                        class="
                            status-equipment
                            ${estadoClase}
                        "
                    >

                        ${escapeHTML(
                            equipo.estado
                        )}

                    </span>

                </td>


                <td>

                    <div
                        class="inventory-responsible"
                    >

                        <strong>
                            ${escapeHTML(
                                responsable.nombre
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                responsable.dni
                            )}
                        </span>

                    </div>

                </td>


                <td>

                    ${crearHTMLMovimientoInventario(
                        ultimaEntrega,
                        "entrega"
                    )}

                </td>


                <td>

                    ${crearHTMLMovimientoInventario(
                        ultimaDevolucion,
                        "devolucion"
                    )}

                </td>


                <td>

                    <div
                        class="equipment-actions"
                    >

                        <button
                            type="button"
                            class="
                                equipment-action-btn
                                delivery-view-btn
                            "
                            title="Ver historial"
                            onclick="
                                abrirHistorialEquipo(
                                    '${equipo.id}'
                                )
                            "
                        >

                            <i
                                class="
                                    fa-solid
                                    fa-clock-rotate-left
                                "
                            ></i>

                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );


    actualizarEstadisticasInventario();

    setTimeout(
    function() {

        inicializarOrdenamientoTablas();

    },
    10
);

}


/* ==========================================
   RESPONSABLE ACTUAL
========================================== */

function obtenerResponsableActualEquipo(
    equipo
) {

    if (
        equipo.estado ===
        "Entregado"
        &&
        equipo.asignadoA
    ) {

        return {

            nombre:
                equipo.asignadoA.trabajador ||
                "Asignado",

            dni:
                equipo.asignadoA.dni
                    ? "DNI: " +
                      equipo.asignadoA.dni
                    : ""

        };

    }


    return {

        nombre:
            "Sin asignar",

        dni:
            ""

    };

}


/* ==========================================
   ULTIMA ENTREGA
========================================== */

function obtenerUltimaEntregaEquipo(
    equipoId
) {

    const entregas =
        obtenerEntregas()
            .filter(
                entrega =>
                    entrega.equipoId ===
                    equipoId
            );


    if (
        entregas.length === 0
    ) {

        return null;

    }


    return entregas[
        entregas.length - 1
    ];

}


/* ==========================================
   ULTIMA DEVOLUCION
========================================== */

function obtenerUltimaDevolucionEquipo(
    equipoId
) {

    const devoluciones =
        obtenerDevoluciones()
            .filter(
                devolucion =>
                    devolucion.equipoId ===
                    equipoId
            );


    if (
        devoluciones.length === 0
    ) {

        return null;

    }


    return devoluciones[
        devoluciones.length - 1
    ];

}


/* ==========================================
   HTML MOVIMIENTO
========================================== */

function crearHTMLMovimientoInventario(
    movimiento,
    tipo
) {

    if (!movimiento) {

        return `
            <span
                style="
                    color:#64748b;
                    font-size:10px;
                "
            >
                Sin registro
            </span>
        `;

    }


    let numero = "-";

    let fecha = "-";


    if (
        tipo === "entrega"
    ) {

        numero =
            movimiento.numero ||
            "-";

        fecha =
            movimiento.fecha ||
            "-";

    }


    else {

        numero =
            movimiento.numero ||
            "-";

        fecha =
            movimiento.fecha ||
            "-";

    }


    return `

        <div
            class="inventory-movement"
        >

            <strong>
                ${escapeHTML(numero)}
            </strong>

            <span>
                ${escapeHTML(fecha)}
            </span>

        </div>

    `;

}


/* ==========================================
   KPIS
========================================== */

function actualizarEstadisticasInventario() {

    const equipos =
        obtenerEquipos();


    const disponibles =
        equipos.filter(
            equipo =>
                equipo.estado ===
                "Disponible"
        ).length;


    const entregados =
        equipos.filter(
            equipo =>
                equipo.estado ===
                "Entregado"
        ).length;


    const mantenimiento =
        equipos.filter(
            equipo =>
                equipo.estado ===
                "Mantenimiento"
        ).length;


    const baja =
        equipos.filter(
            equipo =>
                equipo.estado ===
                "Baja"
        ).length;


    actualizarTextoSeguro(
        "inventarioTotal",
        equipos.length
    );


    actualizarTextoSeguro(
        "inventarioDisponibles",
        disponibles
    );


    actualizarTextoSeguro(
        "inventarioEntregados",
        entregados
    );


    actualizarTextoSeguro(
        "inventarioMantenimiento",
        mantenimiento
    );


    actualizarTextoSeguro(
        "inventarioBaja",
        baja
    );

}


/* ==========================================
   ACTUALIZAR ELEMENTO
========================================== */

function actualizarTextoSeguro(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor;

    }

    obtenerFechaOrdenMovimiento()
    formatearFechaHoraHistorial()
    normalizarClaseEstado()

}


/* ==========================================
   TIPOS DE EQUIPOS
========================================== */

function cargarFiltroTiposInventario() {

    const select =
        document.getElementById(
            "filtroInventarioTipo"
        );


    if (!select) {

        return;

    }


    const valorActual =
        select.value;


    const equipos =
        obtenerEquipos();


    const tipos =
        [
            ...new Set(
                equipos
                    .map(
                        equipo =>
                            equipo.tipo
                    )
                    .filter(Boolean)
            )
        ]
        .sort();


    select.innerHTML = `

        <option value="">
            Todos los equipos
        </option>

    `;


    tipos.forEach(
        tipo => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                tipo;


            option.textContent =
                tipo;


            select.appendChild(
                option
            );

        }
    );


    if (
        tipos.includes(
            valorActual
        )
    ) {

        select.value =
            valorActual;

    }

}


/* ==========================================
   FILTRAR INVENTARIO
========================================== */

function filtrarInventario() {

    const input =
        document.getElementById(
            "buscarInventarioInput"
        );


    const estadoSelect =
        document.getElementById(
            "filtroInventarioEstado"
        );


    const tipoSelect =
        document.getElementById(
            "filtroInventarioTipo"
        );


    if (
        !input ||
        !estadoSelect ||
        !tipoSelect
    ) {

        return;

    }


    const texto =
        input.value
            .trim()
            .toLowerCase();


    const estado =
        estadoSelect.value;


    const tipo =
        tipoSelect.value;


    const equipos =
        obtenerEquipos();


    const filtrados =
        equipos.filter(
            equipo => {

                const responsable =
                    obtenerResponsableActualEquipo(
                        equipo
                    );


                const coincideTexto =

                    String(
                        equipo.codigo || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        equipo.tipo || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        equipo.marca || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        equipo.modelo || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        equipo.serie || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        responsable.nombre || ""
                    )
                    .toLowerCase()
                    .includes(texto)

                    ||

                    String(
                        responsable.dni || ""
                    )
                    .toLowerCase()
                    .includes(texto);


                const coincideEstado =

                    !estado ||

                    equipo.estado ===
                    estado;


                const coincideTipo =

                    !tipo ||

                    equipo.tipo ===
                    tipo;


                return (
                    coincideTexto &&
                    coincideEstado &&
                    coincideTipo
                );

            }
        );


    cargarInventario(
        filtrados
    );

}


/* ==========================================
   LIMPIAR FILTROS
========================================== */

function limpiarFiltrosInventario() {

    const buscar =
        document.getElementById(
            "buscarInventarioInput"
        );


    const estado =
        document.getElementById(
            "filtroInventarioEstado"
        );


    const tipo =
        document.getElementById(
            "filtroInventarioTipo"
        );


    if (buscar) {

        buscar.value = "";

    }


    if (estado) {

        estado.value = "";

    }


    if (tipo) {

        tipo.value = "";

    }


    cargarInventario();

}


/* ==========================================
   EDITAR DESDE INVENTARIO
========================================== */

function abrirEquipoDesdeInventario(
    idEquipo
) {

    mostrarModulo(
        "equipos"
    );


    setTimeout(
        function() {

            editarEquipo(
                idEquipo
            );

        },
        100
    );

}


/* ==========================================
   ABRIR HISTORIAL
========================================== */

function abrirHistorialEquipo(
    idEquipo
) {

    const equipos =
        obtenerEquipos();


    const equipo =
        equipos.find(
            item =>
                item.id === idEquipo
        );


    if (!equipo) {

        alert(
            "No se encontró el equipo."
        );

        return;

    }


    document.getElementById(
        "historialCodigoEquipo"
    ).textContent =
        equipo.codigo || "-";


    document.getElementById(
        "historialTipoEquipo"
    ).textContent =
        equipo.tipo || "-";


    document.getElementById(
        "historialMarcaEquipo"
    ).textContent =
        equipo.marca || "-";


    document.getElementById(
        "historialModeloEquipo"
    ).textContent =
        equipo.modelo || "-";


    document.getElementById(
        "historialSerieEquipo"
    ).textContent =
        equipo.serie || "-";


    document.getElementById(
        "historialEstadoEquipo"
    ).textContent =
        equipo.estado || "-";


    const responsable =
        obtenerResponsableActualEquipo(
            equipo
        );


    document.getElementById(
        "historialResponsableEquipo"
    ).textContent =

        responsable.nombre ||

        "Sin asignar";


    construirTimelineEquipo(
        equipo
    );


    document
        .getElementById(
            "modalHistorialEquipo"
        )
        .classList.remove(
            "hidden"
        );

}


/* ==========================================
   CERRAR HISTORIAL
========================================== */

function cerrarHistorialEquipo() {

    document
        .getElementById(
            "modalHistorialEquipo"
        )
        .classList.add(
            "hidden"
        );

}


/* ==========================================
   TIMELINE
========================================== */

function construirTimelineEquipo(
    equipo
) {

    const contenedor =
        document.getElementById(
            "historialTimeline"
        );


    if (!contenedor) {

        return;

    }


    let movimientos = [];


    /* REGISTRO */

    movimientos.push({

        tipo:
            "registro",

        fecha:
            equipo.fecha || "",

        fechaOrden:
            0,

        titulo:
            "Equipo registrado",

        descripcion:

            "Se registró el equipo " +
            equipo.codigo +
            " en el inventario."

    });


    /* ENTREGAS */

    const entregas =
        obtenerEntregas()
            .filter(
                entrega =>
                    entrega.equipoId ===
                    equipo.id
            );


    entregas.forEach(
        entrega => {

            movimientos.push({

                tipo:
                    "entrega",

                fecha:
                    entrega.fecha ||
                    "",

                fechaOrden:
                    obtenerFechaOrdenMovimiento(
                        entrega.fechaRegistro,
                        entrega.fecha
                    ),

                titulo:

                    "Entrega " +
                    entrega.numero,

                descripcion:

                    "Equipo entregado a " +
                    entrega.trabajador +
                    " - DNI " +
                    entrega.dni +
                    ". Atendido por " +
                    entrega.atendidoPor +
                    "."

            });


            if (
                entrega.firma
            ) {

                movimientos.push({

                    tipo:
                        "firma",

                    fecha:

                        entrega.fechaFirma
                            ? formatearFechaHoraHistorial(
                                entrega.fechaFirma
                            )
                            : entrega.fecha,

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            entrega.fechaFirma,
                            entrega.fecha
                        ),

                    titulo:
                        "Entrega firmada",

                    descripcion:

                        entrega.trabajador +
                        " firmó la recepción del equipo."

                });

            }

        }
    );


    /* DEVOLUCIONES */

    const devoluciones =
        obtenerDevoluciones()
            .filter(
                devolucion =>
                    devolucion.equipoId ===
                    equipo.id
            );


    devoluciones.forEach(
        devolucion => {

            movimientos.push({

                tipo:
                    "devolucion",

                fecha:
                    devolucion.fecha ||
                    "",

                fechaOrden:
                    obtenerFechaOrdenMovimiento(
                        devolucion.fechaRegistro,
                        devolucion.fecha
                    ),

                titulo:

                    "Devolución " +
                    devolucion.numero,

                descripcion:

                    "Equipo devuelto por " +
                    devolucion.trabajador +
                    ". Estado recibido: " +
                    devolucion.estadoRecibido +
                    ". Nuevo estado: " +
                    devolucion.nuevoEstado +
                    "." +

                    (
                        devolucion.observacion
                            ? " Observación: " +
                              devolucion.observacion
                            : ""
                    )

            });

        }
    );


    movimientos.sort(
        (
            a,
            b
        ) =>
            a.fechaOrden -
            b.fechaOrden
    );


    contenedor.innerHTML = "";


    if (
        movimientos.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="history-empty">
                No existen movimientos para este equipo.
            </div>

        `;

        return;

    }


    movimientos.forEach(
        movimiento => {

            const item =
                document.createElement(
                    "div"
                );


            let clase = "register";


            if (
                movimiento.tipo ===
                "entrega"
            ) {

                clase =
                    "delivery";

            }


            if (
                movimiento.tipo ===
                "firma"
            ) {

                clase =
                    "signature";

            }


            if (
                movimiento.tipo ===
                "devolucion"
            ) {

                clase =
                    "return";

            }


            item.className =
                "history-item";


            item.innerHTML = `

                <div
                    class="
                        history-dot
                        ${clase}
                    "
                ></div>


                <div
                    class="
                        history-item-card
                    "
                >

                    <div
                        class="
                            history-item-header
                        "
                    >

                        <strong>
                            ${escapeHTML(
                                movimiento.titulo
                            )}
                        </strong>


                        <span>
                            ${escapeHTML(
                                movimiento.fecha ||
                                "-"
                            )}
                        </span>

                    </div>


                    <p>
                        ${escapeHTML(
                            movimiento.descripcion
                        )}
                    </p>

                </div>

            `;


            contenedor.appendChild(
                item
            );

        }
    );

}


/* ==========================================
   ORDEN DE FECHAS
========================================== */

function obtenerFechaOrdenMovimiento(
    iso,
    fechaSimple
) {

    if (iso) {

        const fecha =
            new Date(iso);


        if (
            !isNaN(
                fecha.getTime()
            )
        ) {

            return fecha.getTime();

        }

    }


    if (fechaSimple) {

        const partes =
            String(fechaSimple)
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


            if (
                !isNaN(
                    fecha.getTime()
                )
            ) {

                return fecha.getTime();

            }

        }

    }


    return 0;

}


/* ==========================================
   FECHA FIRMA
========================================== */

function formatearFechaHoraHistorial(
    fechaISO
) {

    const fecha =
        new Date(
            fechaISO
        );


    if (
        isNaN(
            fecha.getTime()
        )
    ) {

        return "-";

    }


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