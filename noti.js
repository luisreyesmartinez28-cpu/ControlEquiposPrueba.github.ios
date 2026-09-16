// ==========================================
// SISTEMA DE NOTIFICACIONES
// ==========================================

const STORAGE_NOTIFICACIONES_LEIDAS =
    "controlEquiposNotificacionesLeidas";


/* ==========================================
   GENERAR NOTIFICACIONES
========================================== */

function obtenerNotificacionesSistema() {

    const notificaciones = [];

    const entregas =
        obtenerEntregas();

    const equipos =
        obtenerEquipos();

    const devoluciones =
        obtenerDevoluciones();


    // ======================================
    // ENTREGAS PENDIENTES DE FIRMA
    // ======================================

    entregas
        .filter(
            entrega =>
                entrega.estado === "PENDIENTE_FIRMA" ||
                entrega.estado === "ENTREGADO"
        )
        .forEach(
            entrega => {

                notificaciones.push({

                    id:
                        "firma_" +
                        entrega.id,

                    tipo:
                        "signature",

                    icono:
                        "fa-signature",

                    titulo:
                        "Firma pendiente",

                    mensaje:
                        entrega.numero +
                        " - " +
                        entrega.trabajador +
                        " aún no ha firmado la entrega.",

                    fecha:
                        entrega.fecha || "",

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            entrega.fechaRegistro,
                            entrega.fecha
                        ),

                    modulo:
                        "entregas"

                });

            }
        );


    // ======================================
    // EQUIPOS EN MANTENIMIENTO
    // ======================================

    equipos
        .filter(
            equipo =>
                equipo.estado ===
                "Mantenimiento"
        )
        .forEach(
            equipo => {

                notificaciones.push({

                    id:
                        "mantenimiento_" +
                        equipo.id,

                    tipo:
                        "maintenance",

                    icono:
                        "fa-screwdriver-wrench",

                    titulo:
                        "Equipo en mantenimiento",

                    mensaje:
                        equipo.codigo +
                        " - " +
                        equipo.tipo +
                        " " +
                        equipo.marca +
                        " se encuentra en mantenimiento.",

                    fecha:
                        equipo.fecha || "",

                    fechaOrden:
                        obtenerFechaOrdenMovimiento(
                            equipo.fechaRegistro,
                            equipo.fecha
                        ),

                    modulo:
                        "inventario"

                });

            }
        );


    // ======================================
    // DEVOLUCIONES
    // ======================================

    devoluciones.forEach(
        devolucion => {

            notificaciones.push({

                id:
                    "devolucion_" +
                    devolucion.id,

                tipo:
                    "return",

                icono:
                    "fa-rotate-left",

                titulo:
                    "Equipo devuelto",

                mensaje:
                    devolucion.numero +
                    " - " +
                    " devuelto por " +
                    devolucion.trabajador +
                    ".",

                fecha:
                    devolucion.fecha || "",

                fechaOrden:
                    obtenerFechaOrdenMovimiento(
                        devolucion.fechaRegistro,
                        devolucion.fecha
                    ),

                modulo:
                    "devoluciones"

            });

        }
    );


    // MÁS RECIENTES PRIMERO

    notificaciones.sort(
        (a, b) =>
            b.fechaOrden -
            a.fechaOrden
    );


    return notificaciones;

}


/* ==========================================
   NOTIFICACIONES LEÍDAS
========================================== */

function obtenerNotificacionesLeidas() {

    try {

        return JSON.parse(
            localStorage.getItem(
                STORAGE_NOTIFICACIONES_LEIDAS
            )
        ) || [];

    }

    catch (error) {

        return [];

    }

}


function guardarNotificacionesLeidas(
    lista
) {

    localStorage.setItem(
        STORAGE_NOTIFICACIONES_LEIDAS,
        JSON.stringify(lista)
    );

}


/* ==========================================
   CARGAR NOTIFICACIONES
========================================== */

function cargarNotificaciones() {

    const lista =
        document.getElementById(
            "notificationsList"
        );

    const badge =
        document.getElementById(
            "notificationBadge"
        );

    const footer =
        document.getElementById(
            "notificationsFooterText"
        );

    const boton =
        document.getElementById(
            "notificationButton"
        );


    if (
        !lista ||
        !badge
    ) {

        return;

    }


    const notificaciones =
        obtenerNotificacionesSistema();


    const leidas =
        obtenerNotificacionesLeidas();


    const pendientes =
        notificaciones.filter(
            notificacion =>
                !leidas.includes(
                    notificacion.id
                )
        );


    // CONTADOR

    if (
        pendientes.length > 0
    ) {

        badge.textContent =
            pendientes.length > 99
                ? "99+"
                : pendientes.length;

        badge.classList.remove(
            "hidden"
        );


        if (boton) {

            boton.classList.add(
                "has-alerts"
            );

        }

    }

    else {

        badge.classList.add(
            "hidden"
        );


        if (boton) {

            boton.classList.remove(
                "has-alerts"
            );

        }

    }


    // FOOTER

    if (footer) {

        footer.textContent =
            pendientes.length === 0

                ? "No tienes notificaciones pendientes"

                : pendientes.length +
                  " notificación(es) sin leer";

    }


    lista.innerHTML = "";


    if (
        notificaciones.length === 0
    ) {

        lista.innerHTML = `

            <div class="notifications-empty">

                <i class="fa-regular fa-bell"></i>

                <strong>
                    Todo está al día
                </strong>

                <span>
                    No existen alertas en este momento.
                </span>

            </div>

        `;

        return;

    }


    notificaciones
        .slice(0, 20)
        .forEach(
            notificacion => {

                const esLeida =
                    leidas.includes(
                        notificacion.id
                    );


                const elemento =
                    document.createElement(
                        "div"
                    );


                elemento.className =
                    "notification-item " +
                    (
                        esLeida
                            ? ""
                            : "unread"
                    );


                elemento.onclick =
                    function() {

                        abrirNotificacion(
                            notificacion.id,
                            notificacion.modulo
                        );

                    };


                elemento.innerHTML = `

                    <div
                        class="
                            notification-item-icon
                            ${notificacion.tipo}
                        "
                    >

                        <i
                            class="
                                fa-solid
                                ${notificacion.icono}
                            "
                        ></i>

                    </div>


                    <div
                        class="
                            notification-item-content
                        "
                    >

                        <strong>
                            ${escapeHTML(
                                notificacion.titulo
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                notificacion.mensaje
                            )}
                        </p>

                        <small>
                            ${escapeHTML(
                                notificacion.fecha ||
                                "Sin fecha"
                            )}
                        </small>

                    </div>


                    ${
                        !esLeida
                            ? `
                                <span
                                    class="
                                        notification-unread-dot
                                    "
                                ></span>
                            `
                            : ""
                    }

                `;


                lista.appendChild(
                    elemento
                );

            }
        );

}


/* ==========================================
   ABRIR / CERRAR PANEL
========================================== */

function toggleNotificaciones(
    event
) {

    if (event) {

        event.stopPropagation();

    }


    const panel =
        document.getElementById(
            "notificationsPanel"
        );


    if (!panel) {

        return;

    }


    const cerrado =
        panel.classList.contains(
            "hidden"
        );


    if (cerrado) {

        cargarNotificaciones();

        panel.classList.remove(
            "hidden"
        );

    }

    else {

        panel.classList.add(
            "hidden"
        );

    }

}


/* ==========================================
   ABRIR NOTIFICACIÓN
========================================== */

function abrirNotificacion(
    id,
    modulo
) {

    marcarNotificacionLeida(
        id
    );


    const panel =
        document.getElementById(
            "notificationsPanel"
        );


    if (panel) {

        panel.classList.add(
            "hidden"
        );

    }


    if (modulo) {

        mostrarModulo(
            modulo
        );

    }


    cargarNotificaciones();

}


/* ==========================================
   MARCAR UNA COMO LEÍDA
========================================== */

function marcarNotificacionLeida(
    id
) {

    const leidas =
        obtenerNotificacionesLeidas();


    if (
        !leidas.includes(id)
    ) {

        leidas.push(
            id
        );


        guardarNotificacionesLeidas(
            leidas
        );

    }

}


/* ==========================================
   MARCAR TODAS COMO LEÍDAS
========================================== */

function marcarTodasNotificacionesLeidas(
    event
) {

    if (event) {

        event.stopPropagation();

    }


    const notificaciones =
        obtenerNotificacionesSistema();


    const ids =
        notificaciones.map(
            item => item.id
        );


    guardarNotificacionesLeidas(
        ids
    );


    cargarNotificaciones();

}


/* ==========================================
   CERRAR AL HACER CLICK FUERA
========================================== */

document.addEventListener(
    "click",
    function(event) {

        const wrapper =
            document.querySelector(
                ".notifications-wrapper"
            );


        const panel =
            document.getElementById(
                "notificationsPanel"
            );


        if (
            wrapper &&
            panel &&
            !wrapper.contains(
                event.target
            )
        ) {

            panel.classList.add(
                "hidden"
            );

        }

    }
);

// ==========================================
// NOTIFICACIÓN PROFESIONAL
// ==========================================

function mostrarToast(
    titulo,
    mensaje,
    tipo = "success",
    duracion = 3500
) {

    const contenedor =
        document.getElementById(
            "toastContainer"
        );


    if (!contenedor) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    const configuracion = {

        success: {
            icono: "fa-check",
            clase: "toast-success"
        },

        error: {
            icono: "fa-xmark",
            clase: "toast-error"
        },

        warning: {
            icono: "fa-triangle-exclamation",
            clase: "toast-warning"
        },

        info: {
            icono: "fa-circle-info",
            clase: "toast-info"
        }

    };


    const config =
        configuracion[tipo] ||
        configuracion.success;


    toast.className =
        `system-toast ${config.clase}`;


    toast.innerHTML = `

        <div class="toast-icon">

            <i
                class="
                    fa-solid
                    ${config.icono}
                "
            ></i>

        </div>


        <div class="toast-content">

            <strong>
                ${escapeHTML(titulo)}
            </strong>

            <span>
                ${escapeHTML(mensaje)}
            </span>

        </div>


        <button
            type="button"
            class="toast-close"
        >

            <i class="fa-solid fa-xmark"></i>

        </button>

    `;


    contenedor.appendChild(
        toast
    );


    const cerrarToast =
        () => {

            if (
                toast.classList.contains(
                    "toast-hide"
                )
            ) {
                return;
            }


            toast.classList.add(
                "toast-hide"
            );


            setTimeout(
                () => toast.remove(),
                300
            );

        };


    toast
        .querySelector(
            ".toast-close"
        )
        ?.addEventListener(
            "click",
            cerrarToast
        );


    setTimeout(
        cerrarToast,
        duracion
    );

}