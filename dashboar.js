// ==========================================
// ETAPA 9 - DASHBOARD GENERAL
// ==========================================


/* ==========================================
   CARGAR DASHBOARD
========================================== */

function cargarDashboard() {

    const equipos =
        obtenerEquipos();


    const entregas =
        obtenerEntregas();


    const devoluciones =
        obtenerDevoluciones();


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


    const pendientesFirma =
        entregas.filter(
            entrega =>
                entrega.estado ===
                "PENDIENTE_FIRMA"
        ).length;


    /* KPIS */

    actualizarTextoSeguro(
        "dashboardTotalEquipos",
        equipos.length
    );


    actualizarTextoSeguro(
        "dashboardDisponibles",
        disponibles
    );


    actualizarTextoSeguro(
        "dashboardEntregados",
        entregados
    );


    actualizarTextoSeguro(
        "dashboardMantenimiento",
        mantenimiento
    );


    actualizarTextoSeguro(
        "dashboardPendientesFirma",
        pendientesFirma
    );


    actualizarTextoSeguro(
        "dashboardTotalEntregas",
        entregas.length
    );


    actualizarTextoSeguro(
        "dashboardTotalDevoluciones",
        devoluciones.length
    );


    actualizarTextoSeguro(
        "dashboardBaja",
        baja
    );


    /* RESUMEN */

    actualizarTextoSeguro(
        "dashboardResumenDisponible",
        disponibles
    );


    actualizarTextoSeguro(
        "dashboardResumenEntregado",
        entregados
    );


    actualizarTextoSeguro(
        "dashboardResumenMantenimiento",
        mantenimiento
    );


    actualizarTextoSeguro(
        "dashboardResumenBaja",
        baja
    );


    /* PORCENTAJE */

    actualizarPorcentajeAsignados(
        equipos.length,
        entregados
    );


    /* USUARIO */

    cargarUsuarioDashboard();


    /* FECHA */

    cargarFechaDashboard();


    /* TABLAS */

    cargarUltimasEntregasDashboard();

    cargarUltimasDevolucionesDashboard();


    /* ACTIVIDAD */

    cargarActividadDashboard();

}


/* ==========================================
   USUARIO
========================================== */

function cargarUsuarioDashboard() {

    const sesion =
        obtenerSesionActual();


    const elemento =
        document.getElementById(
            "dashboardUsuario"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =

        sesion
            ? (
                sesion.nombre ||
                sesion.usuario ||
                "Usuario"
            )
            : "Usuario";

}


/* ==========================================
   FECHA
========================================== */

function cargarFechaDashboard() {

    const elemento =
        document.getElementById(
            "dashboardFecha"
        );


    if (!elemento) {

        return;

    }


    const fecha =
        new Date();


    elemento.textContent =
        fecha.toLocaleDateString(
            "es-PE",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}


/* ==========================================
   PORCENTAJE ASIGNADO
========================================== */

function actualizarPorcentajeAsignados(
    total,
    entregados
) {

    const porcentaje =

        total > 0

            ? Math.round(
                (
                    entregados /
                    total
                ) * 100
            )

            : 0;


    actualizarTextoSeguro(
        "dashboardPorcentajeAsignado",
        porcentaje + "%"
    );


    const circulo =
        document.querySelector(
            ".distribution-circle"
        );


    if (circulo) {

        const grados =
            porcentaje * 3.6;


        circulo.style.setProperty(
            "--assignment-angle",
            grados + "deg"
        );

    }

}


/* ==========================================
   ULTIMAS ENTREGAS
========================================== */

function cargarUltimasEntregasDashboard() {

    const tbody =
        document.getElementById(
            "dashboardUltimasEntregas"
        );


    if (!tbody) {

        return;

    }


    const entregas =
        obtenerEntregas();


    const ultimas =
        [...entregas]
            .sort(
                (
                    a,
                    b
                ) =>
                    obtenerFechaOrdenMovimiento(
                        b.fechaRegistro,
                        b.fecha
                    )
                    -
                    obtenerFechaOrdenMovimiento(
                        a.fechaRegistro,
                        a.fecha
                    )
            )
            .slice(
                0,
                5
            );


    tbody.innerHTML = "";


    if (
        ultimas.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="3"
                    class="dashboard-empty"
                >
                    No hay entregas registradas.
                </td>

            </tr>

        `;

        return;

    }


    ultimas.forEach(
        entrega => {

            const fila =
                document.createElement(
                    "tr"
                );


            let textoEstado =
                "Pendiente";


            let claseEstado =
                "mantenimiento";


            if (
                entrega.estado ===
                "FIRMADO"
            ) {

                textoEstado =
                    "Firmado";

                claseEstado =
                    "disponible";

            }


            if (
                entrega.estado ===
                "DEVUELTO"
            ) {

                textoEstado =
                    "Devuelto";

                claseEstado =
                    "entregado";

            }


            fila.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            entrega.numero
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            entrega.fecha ||
                            "-"
                        )}
                    </small>

                </td>


                <td>

                    ${escapeHTML(
                        entrega.trabajador
                    )}

                    <small>
                        DNI:
                        ${escapeHTML(
                            entrega.dni
                        )}
                    </small>

                </td>

                <td>

                    <span
                        class="
                            status-equipment
                            ${claseEstado}
                        "
                    >
                        ${textoEstado}
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
   ULTIMAS DEVOLUCIONES
========================================== */

function cargarUltimasDevolucionesDashboard() {

    const tbody =
        document.getElementById(
            "dashboardUltimasDevoluciones"
        );


    if (!tbody) {

        return;

    }


    const devoluciones =
        obtenerDevoluciones();


    const ultimas =
        [...devoluciones]
            .sort(
                (
                    a,
                    b
                ) =>
                    obtenerFechaOrdenMovimiento(
                        b.fechaRegistro,
                        b.fecha
                    )
                    -
                    obtenerFechaOrdenMovimiento(
                        a.fechaRegistro,
                        a.fecha
                    )
            )
            .slice(
                0,
                5
            );


    tbody.innerHTML = "";


    if (
        ultimas.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="dashboard-empty"
                >
                    No hay devoluciones registradas.
                </td>

            </tr>

        `;

        return;

    }


    ultimas.forEach(
        devolucion => {

            const fila =
                document.createElement(
                    "tr"
                );

            fila.innerHTML = `

                <td>

                    <strong>
                        ${escapeHTML(
                            devolucion.numero
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            devolucion.fecha ||
                            "-"
                        )}
                    </small>

                </td>


                <td>

                    ${escapeHTML(
                        devolucion.trabajador
                    )}

                    <small>
                        DNI:
                        ${escapeHTML(
                            devolucion.dni
                        )}
                    </small>

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   ACTIVIDAD GENERAL
========================================== */

function cargarActividadDashboard() {

    const contenedor =
        document.getElementById(
            "dashboardActividad"
        );


    if (!contenedor) {

        return;

    }


    let actividades = [];


    /* EQUIPOS REGISTRADOS */

    obtenerEquipos()
        .forEach(
            equipo => {

                actividades.push({

                    tipo:
                        "register",

                    icono:
                        "fa-laptop",

                    titulo:
                        "Equipo registrado",

                    descripcion:

                        equipo.codigo +
                        " - " +
                        equipo.tipo +
                        " " +
                        equipo.marca,

                    fechaTexto:
                        equipo.fecha ||
                        "-",

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            equipo.fechaRegistro,
                            equipo.fecha
                        )

                });

            }
        );


    /* ENTREGAS */

    obtenerEntregas()
        .forEach(
            entrega => {

                actividades.push({

                    tipo:
                        "delivery",

                    icono:
                        "fa-hand-holding",

                    titulo:

                        "Entrega " +
                        entrega.numero,

                    descripcion:

                        " entregado a " +
                        entrega.trabajador,

                    fechaTexto:
                        entrega.fecha ||
                        "-",

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            entrega.fechaRegistro,
                            entrega.fecha
                        )

                });


                if (
                    entrega.firma &&
                    entrega.fechaFirma
                ) {

                    actividades.push({

                        tipo:
                            "signature",

                        icono:
                            "fa-signature",

                        titulo:

                            "Entrega firmada",

                        descripcion:

                            entrega.trabajador +
                            " firmó " +
                            entrega.numero,

                        fechaTexto:
                            formatearFechaHoraHistorial(
                                entrega.fechaFirma
                            ),

                        fechaOrden:
                            obtenerFechaOrdenMovimiento(
                                entrega.fechaFirma,
                                entrega.fecha
                            )

                    });

                }

            }
        );


    /* DEVOLUCIONES */

    obtenerDevoluciones()
        .forEach(
            devolucion => {

                actividades.push({

                    tipo:
                        "return",

                    icono:
                        "fa-rotate-left",

                    titulo:

                        "Devolución " +
                        devolucion.numero,

                    descripcion:

                        " devuelto por " +
                        devolucion.trabajador,

                    fechaTexto:
                        devolucion.fecha ||
                        "-",

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            devolucion.fechaRegistro,
                            devolucion.fecha
                        )

                });

            }
        );


    actividades.sort(
        (
            a,
            b
        ) =>
            b.fechaOrden -
            a.fechaOrden
    );


    actividades =
        actividades.slice(
            0,
            8
        );


    contenedor.innerHTML = "";


    if (
        actividades.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="dashboard-empty">

                <i
                    class="fa-solid fa-clock-rotate-left"
                    style="
                        display:block;
                        margin-bottom:8px;
                        font-size:22px;
                    "
                ></i>

                Todavía no hay actividad registrada.

            </div>

        `;

        return;

    }


    actividades.forEach(
        actividad => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "dashboard-activity-item";


            elemento.innerHTML = `

                <div
                    class="
                        dashboard-activity-icon
                        ${actividad.tipo}
                    "
                >

                    <i
                        class="
                            fa-solid
                            ${actividad.icono}
                        "
                    ></i>

                </div>


                <div
                    class="
                        dashboard-activity-content
                    "
                >

                    <strong>
                        ${escapeHTML(
                            actividad.titulo
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            actividad.descripcion
                        )}
                    </p>

                    <span>
                        ${escapeHTML(
                            actividad.fechaTexto
                        )}
                    </span>

                </div>

            `;


            contenedor.appendChild(
                elemento
            );

        }
    );

}