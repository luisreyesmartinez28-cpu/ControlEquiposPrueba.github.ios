// ==========================================
// ETAPA 7 - DEVOLUCIÓN DE EQUIPOS
// ==========================================

const STORAGE_DEVOLUCIONES =
    "controlEquiposDevoluciones";

let equiposSeleccionadosDevolucion = [];
let equiposCargoActualDevolucion = [];


/* ==========================================
   OBTENER DEVOLUCIONES
========================================== */

function obtenerDevoluciones() {

    return JSON.parse(
        localStorage.getItem(
            STORAGE_DEVOLUCIONES
        )
    ) || [];

}


/* ==========================================
   GUARDAR DEVOLUCIONES
========================================== */

function guardarDevoluciones(
    devoluciones
) {

    localStorage.setItem(
        STORAGE_DEVOLUCIONES,
        JSON.stringify(
            devoluciones
        )
    );

}


/* ==========================================
   CORRELATIVO
========================================== */

function generarNumeroDevolucion() {

    const devoluciones =
        obtenerDevoluciones();


    let mayorNumero = 0;


    devoluciones.forEach(
        devolucion => {

            const numero =
                parseInt(
                    String(
                        devolucion.numero
                    )
                    .replace(
                        "ND",
                        ""
                    )
                );


            if (
                !isNaN(numero)
                &&
                numero > mayorNumero
            ) {

                mayorNumero =
                    numero;

            }

        }
    );


    return (
        "ND" +
        String(
            mayorNumero + 1
        ).padStart(
            6,
            "0"
        )
    );

}


/* ==========================================
   ABRIR DEVOLUCION
========================================== */

function abrirFormularioDevolucion() {

    equiposSeleccionadosDevolucion = [];

    equiposCargoActualDevolucion = [];


    const formulario =
        document.getElementById(
            "devolucionForm"
        );


    if (formulario) {

        formulario.reset();

    }


    actualizarTextoSeguro(
        "numeroDevolucionVista",
        generarNumeroDevolucion()
    );


    actualizarTextoSeguro(
        "fechaDevolucionVista",
        fechaActualEquipo()
    );


    cargarUsuarioDevolucion();

    renderizarEquiposCargoDevolucion();

    renderizarEquiposSeleccionadosDevolucion();


    const modal =
        document.getElementById(
            "modalDevolucion"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}

/* ==========================================
   CERRAR
========================================== */

function cerrarFormularioDevolucion() {

    equiposSeleccionadosDevolucion = [];

    equiposCargoActualDevolucion = [];


    const modal =
        document.getElementById(
            "modalDevolucion"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}

/* ==========================================
   CARGAR ENTREGAS ACTIVAS
========================================== */

function cargarEntregasPendientesDevolucion() {

    const select =
        document.getElementById(
            "entregaDevolucion"
        );


    if (!select) {

        return;

    }


    const entregas =
        obtenerEntregas();


    /*
        Solo deben aparecer entregas que
        todavía no han sido devueltas.
    */

    const pendientes =
        entregas.filter(
            entrega =>

                entrega.estado ===
                    "FIRMADO"

                ||

                entrega.estado ===
                    "PENDIENTE_FIRMA"
        );


    select.innerHTML = `

        <option value="">
            Selecciona una entrega pendiente
        </option>

    `;


    pendientes.forEach(
        entrega => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                entrega.id;


            option.textContent =

                entrega.numero +
                " - " +

                entrega.trabajador +
                " - " +

                entrega.tipoEquipo +
                " - " +

                entrega.serie;


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   MOSTRAR DATOS ENTREGA
========================================== */

function mostrarDatosEntregaDevolucion() {

    const idEntrega =
        document.getElementById(
            "entregaDevolucion"
        ).value;


    const preview =
        document.getElementById(
            "previewDevolucion"
        );


    if (!idEntrega) {

        preview.classList.add(
            "hidden"
        );

        return;

    }


    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id === idEntrega
        );


    if (!entrega) {

        preview.classList.add(
            "hidden"
        );

        return;

    }


    document.getElementById(
        "returnEntregaNumero"
    ).textContent =
        entrega.numero;


    document.getElementById(
        "returnDni"
    ).textContent =
        entrega.dni;


    document.getElementById(
        "returnTrabajador"
    ).textContent =
        entrega.trabajador;


    document.getElementById(
        "returnEquipo"
    ).textContent =
        entrega.tipoEquipo;


    document.getElementById(
        "returnMarcaModelo"
    ).textContent =

        entrega.marca +

        (
            entrega.modelo
                ? " / " +
                  entrega.modelo
                : ""
        );


    document.getElementById(
        "returnSerie"
    ).textContent =
        entrega.serie;


    preview.classList.remove(
        "hidden"
    );

}


/* ==========================================
   USUARIO
========================================== */

function cargarUsuarioDevolucion() {

    const sesion =
        obtenerSesionActual();


    const elemento =
        document.getElementById(
            "usuarioDevolucionActual"
        );


    if (!elemento) {

        return;

    }


    if (!sesion) {

        elemento.textContent =
            "Usuario no identificado";

        return;

    }


    elemento.textContent =

        sesion.nombre ||

        sesion.usuario ||

        "Usuario";

}


/* ==========================================
   FORMULARIO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const formulario =
            document.getElementById(
                "devolucionForm"
            );


        if (!formulario) {

            return;

        }


        formulario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                registrarDevolucionEquipo();

            }
        );

    }
);


/* ==========================================
   REGISTRAR DEVOLUCION
========================================== */




/* ==========================================
   CARGAR TABLA
========================================== */

function cargarDevoluciones(
    lista = null
) {

    const tbody =
        document.getElementById(
            "devolucionesTableBody"
        );


    if (!tbody) {

        return;

    }


    const devoluciones =
        lista ||
        obtenerDevoluciones();


    tbody.innerHTML = "";


    if (
        devoluciones.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

                    <i
                        class="fa-solid fa-rotate-left"
                        style="
                            display:block;
                            margin-bottom:10px;
                            font-size:26px;
                        "
                    ></i>

                    No hay devoluciones registradas.

                </td>

            </tr>

        `;


        actualizarEstadisticasDevoluciones();


        return;

    }


    const ordenadas =
        [...devoluciones]
            .reverse();


    ordenadas.forEach(
        devolucion => {

            const estadoClase =
                normalizarClaseEstado(
                    devolucion.estadoRecibido
                );


            const fila =
                document.createElement(
                    "tr"
                );

            const numerosEntrega =
            obtenerNumerosEntregaDevolucion(
                devolucion
            );

            const estadoRecibido =
            obtenerEstadoRecibidoDevolucion(
                devolucion
            );

            const claseEstadoRecibido =
            obtenerClaseEstadoRecibido(
                estadoRecibido
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
                        devolucion.fecha
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        numerosEntrega
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        devolucion.dni
                    )}

                </td>


                <td>

                    <strong>
                        ${escapeHTML(
                            devolucion.trabajador
                        )}
                    </strong>

                </td>

                <td>

                    <span
                        class="
                            return-condition
                            ${claseEstadoRecibido}
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
                            title="Ver devolución"
                            onclick="
                                verDetalleDevolucion(
                                    '${devolucion.id}'
                                )
                            "
                        >

                            <i
                                class="fa-solid fa-eye"
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


    actualizarEstadisticasDevoluciones();

    setTimeout(
    function() {

        inicializarOrdenamientoTablas();

    },
    10
);

}


/* ==========================================
   NORMALIZAR CLASE
========================================== */

function normalizarClaseEstado(
    texto
) {

    return String(
        texto || ""
    )
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .replace(
        /\s+/g,
        "-"
    );

}


/* ==========================================
   FILTRAR
========================================== */

function filtrarDevoluciones() {

    const input =
        document.getElementById(
            "buscarDevolucionInput"
        );


    if (!input) {

        return;

    }


    const texto =
        input.value
            .trim()
            .toLowerCase();


    const devoluciones =
        obtenerDevoluciones();


    const filtradas =
        devoluciones.filter(
            devolucion => {

                return (

                    devolucion.numero
                        .toLowerCase()
                        .includes(texto)

                    ||

                    devolucion.numeroEntrega
                        .toLowerCase()
                        .includes(texto)

                    ||

                    devolucion.dni
                        .toLowerCase()
                        .includes(texto)

                    ||

                    devolucion.trabajador
                        .toLowerCase()
                        .includes(texto)

                    ||

                    devolucion.tipoEquipo
                        .toLowerCase()
                        .includes(texto)

                    ||

                    devolucion.serie
                        .toLowerCase()
                        .includes(texto)

                );

            }
        );


    cargarDevoluciones(
        filtradas
    );

}


/* ==========================================
   ESTADISTICAS
========================================== */

function actualizarEstadisticasDevoluciones() {

    const devoluciones =
        obtenerDevoluciones();


    const equipos =
        obtenerEquipos();


    const entregas =
        obtenerEntregas();


    const disponibles =
        equipos.filter(
            equipo =>
                equipo.estado ===
                "Disponible"
        ).length;


    const pendientes =
        entregas.filter(
            entrega =>

                entrega.estado ===
                    "FIRMADO"

                ||

                entrega.estado ===
                    "PENDIENTE_FIRMA"
        ).length;


    const totalElement =
        document.getElementById(
            "totalDevoluciones"
        );


    const disponiblesElement =
        document.getElementById(
            "equiposDisponiblesDevolucion"
        );


    const pendientesElement =
        document.getElementById(
            "equiposPendientesDevolucion"
        );


    if (totalElement) {

        totalElement.textContent =
            devoluciones.length;

    }


    if (disponiblesElement) {

        disponiblesElement.textContent =
            disponibles;

    }


    if (pendientesElement) {

        pendientesElement.textContent =
            pendientes;

    }

}


/* ==========================================
   VER DETALLE
========================================== */

function verDetalleDevolucion(
    id
) {

    const devoluciones =
        obtenerDevoluciones();


    const devolucion =
        devoluciones.find(
            item =>
                item.id === id
        );


    if (!devolucion) {

        alert(
            "No se encontró la devolución."
        );

        return;

    }


    alert(

        "DEVOLUCIÓN: " +
        devolucion.numero +

        "\n\n" +

        "Fecha: " +
        devolucion.fecha +

        "\n" +

        "Entrega: " +
        devolucion.numeroEntrega +

        "\n\n" +

        "DNI: " +
        devolucion.dni +

        "\n" +

        "Trabajador: " +
        devolucion.trabajador +

        "\n\n" +

        "Equipo: " +
        devolucion.tipoEquipo +

        "\n" +

        "Código: " +
        devolucion.codigoEquipo +

        "\n" +

        "Marca: " +
        devolucion.marca +

        "\n" +

        "Modelo: " +
        (
            devolucion.modelo ||
            "-"
        ) +

        "\n" +

        "Serie: " +
        devolucion.serie +

        "\n\n" +

        "Estado recibido: " +
        devolucion.estadoRecibido +

        "\n" +

        "Nuevo estado: " +
        devolucion.nuevoEstado +

        "\n\n" +

        "Observaciones: " +
        (
            devolucion.observacion ||
            "Sin observaciones"
        ) +

        "\n\n" +

        "Recibido por: " +
        devolucion.recibidoPor

    );

}

function obtenerEquiposACargoPorDNI(
    dni
) {

    const equipos =
        obtenerEquipos();


    return equipos.filter(
        equipo => {

            return (

                equipo.estado ===
                    "Entregado"

                &&

                equipo.asignadoA

                &&

                String(
                    equipo.asignadoA.dni || ""
                ) ===
                String(dni)

            );

        }
    );

}

function buscarResponsableDevolucion() {

    const dniInput =
        document.getElementById(
            "dniDevolucion"
        );


    const trabajadorInput =
        document.getElementById(
            "trabajadorDevolucion"
        );


    if (
        !dniInput ||
        !trabajadorInput
    ) {

        return;

    }


    dniInput.value =
        dniInput.value
            .replace(/\D/g, "")
            .slice(0, 8);


    const dni =
        dniInput.value;


    trabajadorInput.value = "";

    equiposCargoActualDevolucion = [];

    equiposSeleccionadosDevolucion = [];


    renderizarEquiposSeleccionadosDevolucion();


    if (
        dni.length !== 8
    ) {

        renderizarEquiposCargoDevolucion();

        return;

    }


    let nombre = "";


    // Buscar primero en trabajadores

    if (
        typeof obtenerTrabajadores ===
        "function"
    ) {

        const trabajador =
            obtenerTrabajadores()
                .find(
                    item =>
                        item.dni === dni
                );


        if (trabajador) {

            nombre =
                trabajador.nombre;

        }

    }


    // Si no aparece en catálogo, buscar
    // dentro de los equipos asignados

    equiposCargoActualDevolucion =
        obtenerEquiposACargoPorDNI(
            dni
        );


    if (
        !nombre &&
        equiposCargoActualDevolucion.length > 0
    ) {

        nombre =
            equiposCargoActualDevolucion[0]
                .asignadoA
                .trabajador ||
            "";

    }


    trabajadorInput.value =
        nombre;


    renderizarEquiposCargoDevolucion();

}

function renderizarEquiposCargoDevolucion() {

    const tbody =
        document.getElementById(
            "equiposCargoDevolucionBody"
        );


    const contador =
        document.getElementById(
            "cantidadEquiposCargoDevolucion"
        );


    if (contador) {

        contador.textContent =
            equiposCargoActualDevolucion.length;

    }


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    if (
        equiposCargoActualDevolucion.length ===
        0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    "
                >

                    No se encontraron equipos asignados.

                </td>

            </tr>

        `;

        return;

    }


    equiposCargoActualDevolucion.forEach(
        equipo => {

            const yaSeleccionado =
                equiposSeleccionadosDevolucion
                    .some(
                        item =>
                            item.equipoId ===
                            equipo.id
                    );


            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>

                    <button
                        type="button"
                        class="
                            equipment-action-btn
                            ${
                                yaSeleccionado
                                    ? "disabled"
                                    : ""
                            }
                        "
                        ${
                            yaSeleccionado
                                ? "disabled"
                                : ""
                        }
                        onclick="
                            agregarEquipoDevolucion(
                                '${equipo.id}'
                            )
                        "
                    >

                        <i
                            class="
                                fa-solid
                                ${
                                    yaSeleccionado
                                        ? "fa-check"
                                        : "fa-plus"
                                }
                            "
                        ></i>

                    </button>

                </td>


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

                    ${escapeHTML(
                        equipo.asignadoA
                            ?.numeroEntrega ||
                        "-"
                    )}

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}

function agregarEquipoDevolucion(
    equipoId
) {

    const equipo =
        equiposCargoActualDevolucion
            .find(
                item =>
                    item.id ===
                    equipoId
            );


    if (!equipo) {

        alert(
            "No se encontró el equipo asignado."
        );

        return;

    }


    const existe =
        equiposSeleccionadosDevolucion
            .some(
                item =>
                    item.equipoId ===
                    equipo.id
            );


    if (existe) {

        return;

    }


    equiposSeleccionadosDevolucion.push({

        equipoId:
            equipo.id,

        codigoEquipo:
            equipo.codigo,

        tipoEquipo:
            equipo.tipo,

        marca:
            equipo.marca,

        modelo:
            equipo.modelo || "",

        serie:
            equipo.serie,

        entregaId:
            equipo.asignadoA
                ?.entregaId ||
            "",

        numeroEntrega:
            equipo.asignadoA
                ?.numeroEntrega ||
            "",

        estadoRecibido:
            "Bueno",

        nuevoEstado:
            "Disponible"

    });


    renderizarEquiposSeleccionadosDevolucion();

    renderizarEquiposCargoDevolucion();

}

function agregarEquipoDevolucionPorSerie() {

    const input =
        document.getElementById(
            "buscarSerieDevolucion"
        );


    const dniInput =
        document.getElementById(
            "dniDevolucion"
        );


    if (
        !input ||
        !dniInput
    ) {

        return;

    }


    const dni =
        dniInput.value.trim();


    if (
        dni.length !== 8
    ) {

        alert(
            "Primero ingrese el DNI del responsable."
        );

        dniInput.focus();

        return;

    }


    const serie =
        input.value
            .trim()
            .toLowerCase();


    if (!serie) {

        alert(
            "Ingrese una serie."
        );

        input.focus();

        return;

    }


    /*
        IMPORTANTE:
        Solo buscamos dentro de los equipos
        que ese DNI tiene actualmente asignados.
    */

    const equipo =
        equiposCargoActualDevolucion
            .find(
                item =>
                    String(
                        item.serie || ""
                    )
                    .trim()
                    .toLowerCase() ===
                    serie
            );


    if (!equipo) {

        alert(
            "Esta serie no se encuentra asignada al trabajador."
        );

        input.select();

        return;

    }


    agregarEquipoDevolucion(
        equipo.id
    );


    input.value = "";

    input.focus();

}

function buscarSerieDevolucionEnter(
    event
) {

    if (
        event.key ===
        "Enter"
    ) {

        event.preventDefault();

        agregarEquipoDevolucionPorSerie();

    }

}

function renderizarEquiposSeleccionadosDevolucion() {

    const tbody =
        document.getElementById(
            "equiposSeleccionadosDevolucionBody"
        );


    const contador =
        document.getElementById(
            "cantidadEquiposDevolucion"
        );


    if (contador) {

        contador.textContent =
            equiposSeleccionadosDevolucion.length;

    }


    if (!tbody) {

        return;

    }


    tbody.innerHTML = "";


    if (
        equiposSeleccionadosDevolucion.length ===
        0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#64748b;
                    "
                >

                    No has seleccionado equipos para devolver.

                </td>

            </tr>

        `;

        return;

    }


    equiposSeleccionadosDevolucion
        .forEach(
            (
                equipo,
                index
            ) => {

                const fila =
                    document.createElement(
                        "tr"
                    );


                fila.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>


                    <td>

                        <strong>
                            ${escapeHTML(
                                equipo.codigoEquipo
                            )}
                        </strong>

                    </td>


                    <td>

                        ${escapeHTML(
                            equipo.tipoEquipo
                        )}

                    </td>


                    <td>

                        ${escapeHTML(
                            equipo.serie
                        )}

                    </td>


                    <td>

                        <select
                            onchange="
                                actualizarEstadoRecibidoDevolucion(
                                    '${equipo.equipoId}',
                                    this.value
                                )
                            "
                        >

                            <option value="Bueno"
                                ${
                                    equipo.estadoRecibido === "Bueno"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Bueno
                            </option>

                            <option value="Regular"
                                ${
                                    equipo.estadoRecibido === "Regular"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Regular
                            </option>

                            <option value="Dañado"
                                ${
                                    equipo.estadoRecibido === "Dañado"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Dañado
                            </option>

                            <option value="Mantenimiento"
                                ${
                                    equipo.estadoRecibido === "Mantenimiento"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Requiere mantenimiento
                            </option>

                        </select>

                    </td>


                    <td>

                        <select
                            onchange="
                                actualizarNuevoEstadoDevolucion(
                                    '${equipo.equipoId}',
                                    this.value
                                )
                            "
                        >

                            <option value="Disponible"
                                ${
                                    equipo.nuevoEstado === "Disponible"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Disponible
                            </option>

                            <option value="Mantenimiento"
                                ${
                                    equipo.nuevoEstado === "Mantenimiento"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Mantenimiento
                            </option>

                            <option value="Baja"
                                ${
                                    equipo.nuevoEstado === "Baja"
                                        ? "selected"
                                        : ""
                                }
                            >
                                Baja
                            </option>

                        </select>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn-remove-delivery-equipment"
                            onclick="
                                quitarEquipoDevolucion(
                                    '${equipo.equipoId}'
                                )
                            "
                        >

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                `;


                tbody.appendChild(
                    fila
                );

            }
        );

}

function actualizarEstadoRecibidoDevolucion(
    equipoId,
    estado
) {

    const equipo =
        equiposSeleccionadosDevolucion
            .find(
                item =>
                    item.equipoId ===
                    equipoId
            );


    if (!equipo) {

        return;

    }


    equipo.estadoRecibido =
        estado;


    /*
        Automatización recomendada.
    */

    if (
        estado === "Dañado" ||
        estado === "Mantenimiento"
    ) {

        equipo.nuevoEstado =
            "Mantenimiento";

    }


    renderizarEquiposSeleccionadosDevolucion();

}

function actualizarNuevoEstadoDevolucion(
    equipoId,
    estado
) {

    const equipo =
        equiposSeleccionadosDevolucion
            .find(
                item =>
                    item.equipoId ===
                    equipoId
            );


    if (equipo) {

        equipo.nuevoEstado =
            estado;

    }

}

function quitarEquipoDevolucion(
    equipoId
) {

    equiposSeleccionadosDevolucion =
        equiposSeleccionadosDevolucion
            .filter(
                item =>
                    item.equipoId !==
                    equipoId
            );


    renderizarEquiposSeleccionadosDevolucion();

    renderizarEquiposCargoDevolucion();

}

function registrarDevolucionEquipo() {

    const dni =
        document
            .getElementById(
                "dniDevolucion"
            )
            .value
            .trim();


    const trabajador =
        document
            .getElementById(
                "trabajadorDevolucion"
            )
            .value
            .trim();


    const observacion =
        document
            .getElementById(
                "observacionDevolucion"
            )
            ?.value
            .trim() ||
        "";


    if (
        dni.length !== 8
    ) {

        alert(
            "Ingrese un DNI válido."
        );

        return;

    }


    if (!trabajador) {

        alert(
            "No se encontró al trabajador."
        );

        return;

    }


    if (
        equiposSeleccionadosDevolucion.length ===
        0
    ) {

        alert(
            "Seleccione al menos un equipo para devolver."
        );

        return;

    }


    const sesion =
        obtenerSesionActual();


    const equipos =
        obtenerEquipos();


    const entregas =
        obtenerEntregas();


    const devoluciones =
        obtenerDevoluciones();


    const numeroDevolucion =
        generarNumeroDevolucion();


    /* ======================================
       VALIDACIÓN FINAL
    ====================================== */

    for (
        const seleccionado
        of equiposSeleccionadosDevolucion
    ) {

        const equipo =
            equipos.find(
                item =>
                    item.id ===
                    seleccionado.equipoId
            );


        if (
            !equipo ||
            equipo.estado !==
            "Entregado" ||
            !equipo.asignadoA ||
            equipo.asignadoA.dni !==
            dni
        ) {

            alert(
                "Uno de los equipos seleccionados ya no está asignado a este trabajador."
            );

            return;

        }

    }


    /* ======================================
       CREAR DEVOLUCIÓN
    ====================================== */

    const nuevaDevolucion = {

        id:
            "DEV_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2,7),

        numero:
            numeroDevolucion,

        fecha:
            fechaActualEquipo(),

        dni,

        trabajador,

        equipos:
            equiposSeleccionadosDevolucion.map(
                item => ({
                    ...item
                })
            ),

        cantidadEquipos:
            equiposSeleccionadosDevolucion.length,

        observacion,

        recibidoPor:
            sesion
                ? (
                    sesion.nombre ||
                    sesion.usuario
                )
                : "Usuario",

        usuarioId:
            sesion
                ? sesion.id
                : null,

        fechaRegistro:
            new Date()
                .toISOString()

    };


    devoluciones.push(
        nuevaDevolucion
    );


    guardarDevoluciones(
        devoluciones
    );


    /* ======================================
       ACTUALIZAR EQUIPOS
    ====================================== */

    equiposSeleccionadosDevolucion
        .forEach(
            seleccionado => {

                const indiceEquipo =
                    equipos.findIndex(
                        item =>
                            item.id ===
                            seleccionado.equipoId
                    );


                if (
                    indiceEquipo === -1
                ) {

                    return;

                }


                equipos[indiceEquipo].estado =
                    seleccionado.nuevoEstado;


                equipos[indiceEquipo].ultimaDevolucion = {

                    numero:
                        nuevaDevolucion.numero,

                    fecha:
                        nuevaDevolucion.fecha,

                    estadoRecibido:
                        seleccionado.estadoRecibido,

                    observacion:
                        nuevaDevolucion.observacion

                };


                delete equipos[indiceEquipo].asignadoA;

            }
        );


    guardarEquipos(
        equipos
    );


    /* ======================================
       ACTUALIZAR ESTADO DE LAS ENTREGAS
    ====================================== */

    actualizarEstadosEntregasDespuesDevolucion(
        entregas,
        equipos
    );


    guardarEntregas(
        entregas
    );


    const cantidad =
        nuevaDevolucion.cantidadEquipos;


    cerrarFormularioDevolucion();


    cargarDevoluciones();

    cargarEntregas();

    cargarEquipos();

    cargarInventario();

    cargarDashboard();

    cargarNotificaciones();


    mostrarToast(
        "Devolución registrada",
        `${nuevaDevolucion.numero} · ${nuevaDevolucion.cantidadEquipos} equipo(s) recibido(s).`,
        "success"
    );

}

function actualizarEstadosEntregasDespuesDevolucion(
    entregas,
    equipos
) {

    entregas.forEach(
        entrega => {

            const equiposEntrega =
                obtenerEquiposDeEntrega(
                    entrega
                );


            if (
                equiposEntrega.length ===
                0
            ) {

                return;

            }


            let devueltos =
                0;


            equiposEntrega.forEach(
                itemEntrega => {

                    const equipoActual =
                        equipos.find(
                            equipo =>
                                equipo.id ===
                                itemEntrega.equipoId
                        );


                    const sigueAsignado =
                        equipoActual &&
                        equipoActual.asignadoA &&
                        equipoActual.asignadoA.entregaId ===
                        entrega.id;


                    if (!sigueAsignado) {

                        devueltos++;

                    }

                }
            );


            /*
                MUY IMPORTANTE:
                NO TOCAMOS:
                entrega.firma
                entrega.fechaFirma
                entrega.firmado
            */


            if (
                devueltos === 0
            ) {

                return;

            }


            if (
                devueltos ===
                equiposEntrega.length
            ) {

                entrega.estado =
                    "DEVUELTO";

            }

            else {

                entrega.estado =
                    "DEVOLUCION_PARCIAL";

            }

        }
    );

}

// ==========================================
// OBTENER N° ENTREGA DE DEVOLUCIÓN
// Compatible con registros antiguos y nuevos
// ==========================================

function obtenerNumerosEntregaDevolucion(
    devolucion
) {

    if (!devolucion) {
        return "-";
    }


    // ======================================
    // NUEVO FORMATO: varios equipos
    // ======================================

    if (
        Array.isArray(
            devolucion.equipos
        )
        &&
        devolucion.equipos.length > 0
    ) {

        const numeros =
            devolucion.equipos
                .map(
                    equipo =>
                        equipo.numeroEntrega ||
                        "-"
                )
                .filter(
                    numero =>
                        numero !== "-"
                );


        // Quitar repetidos

        const unicos =
            [...new Set(numeros)];


        return unicos.length > 0
            ? unicos.join(", ")
            : "-";

    }


    // ======================================
    // FORMATO ANTIGUO
    // ======================================

    return (
        devolucion.numeroEntrega ||
        "-"
    );

}

// ==========================================
// ESTADO RECIBIDO DE DEVOLUCION
// Compatible con devoluciones nuevas y antiguas
// ==========================================

function obtenerEstadoRecibidoDevolucion(
    devolucion
) {

    if (!devolucion) {
        return "-";
    }


    // ======================================
    // NUEVO FORMATO - VARIOS EQUIPOS
    // ======================================

    if (
        Array.isArray(devolucion.equipos) &&
        devolucion.equipos.length > 0
    ) {

        const estados =
            devolucion.equipos
                .map(
                    equipo =>
                        equipo.estadoRecibido ||
                        "-"
                )
                .filter(
                    estado =>
                        estado !== "-"
                );


        if (
            estados.length === 0
        ) {

            return "-";

        }


        /*
            Si todos tienen el mismo estado,
            mostrarlo una sola vez.
        */

        const estadosUnicos =
            [...new Set(estados)];


        return estadosUnicos.join(", ");

    }


    // ======================================
    // FORMATO ANTIGUO
    // ======================================

    return (
        devolucion.estadoRecibido ||
        "-"
    );

}

function obtenerClaseEstadoRecibido(
    estado
) {

    const texto =
        String(
            estado || ""
        )
        .toLowerCase();


    if (
        texto.includes("dañado") ||
        texto.includes("danado")
    ) {

        return "dañado";

    }


    if (
        texto.includes("mantenimiento")
    ) {

        return "mantenimiento";

    }


    if (
        texto.includes("regular")
    ) {

        return "regular";

    }


    if (
        texto.includes("bueno")
    ) {

        return "bueno";

    }


    return "";

}
