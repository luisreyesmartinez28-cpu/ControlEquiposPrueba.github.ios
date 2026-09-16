// ==========================================
// ETAPA 4 - ENTREGA DE EQUIPOS
// ==========================================

const STORAGE_ENTREGAS =
    "controlEquiposEntregas";

let equiposSeleccionadosEntrega = [];


/* ==========================================
   OBTENER ENTREGAS
========================================== */

function obtenerEntregas() {

    return JSON.parse(
        localStorage.getItem(
            STORAGE_ENTREGAS
        )
    ) || [];

}


/* ==========================================
   GUARDAR ENTREGAS
========================================== */

function guardarEntregas(entregas) {

    localStorage.setItem(
        STORAGE_ENTREGAS,
        JSON.stringify(entregas)
    );

}


/* ==========================================
   GENERAR CORRELATIVO
========================================== */

function generarNumeroEntrega() {

    const entregas =
        obtenerEntregas();


    let mayorNumero = 0;


    entregas.forEach(entrega => {

        const numero =
            parseInt(
                String(entrega.numero)
                    .replace("NE", "")
            );


        if (
            !isNaN(numero) &&
            numero > mayorNumero
        ) {

            mayorNumero = numero;

        }

    });


    const siguiente =
        mayorNumero + 1;


    return (
        "NE" +
        String(siguiente)
            .padStart(6, "0")
    );

}


/* ==========================================
   ABRIR FORMULARIO
========================================== */

function abrirFormularioEntrega() {

    equiposSeleccionadosEntrega = [];

    const formulario =
        document.getElementById(
            "entregaForm"
        );


    formulario.reset();


    document
        .getElementById(
            "previewEquipoEntrega"
        )
        .classList.add("hidden");


    document.getElementById(
        "numeroEntregaVista"
    ).textContent =
        generarNumeroEntrega();


    document.getElementById(
        "fechaEntregaVista"
    ).textContent =
        fechaActualEquipo();


    cargarEquiposDisponiblesEntrega();


    cargarUsuarioEntrega();

    cargarDashboard();

    renderizarEquiposSeleccionadosEntrega();


    document
        .getElementById(
            "modalEntrega"
        )
        .classList.remove("hidden");


    setTimeout(() => {

        document
            .getElementById(
                "dniEntrega"
            )
            .focus();

    }, 100);

}


/* ==========================================
   CERRAR FORMULARIO
========================================== */

function cerrarFormularioEntrega() {

    equiposSeleccionadosEntrega = [];

    document
        .getElementById(
            "modalEntrega"
        )
        .classList.add("hidden");

    
    renderizarEquiposSeleccionadosEntrega();

}


/* ==========================================
   EQUIPOS DISPONIBLES
========================================== */

function cargarEquiposDisponiblesEntrega() {

    const select =
        document.getElementById(
            "equipoEntrega"
        );


    if (!select) {
        return;
    }


    const equipos =
        obtenerEquipos();


    const disponibles =
        equipos.filter(
            equipo =>

                equipo.estado ===
                    "Disponible"

                &&

                !equiposSeleccionadosEntrega
                    .some(
                        seleccionado =>
                            seleccionado.equipoId ===
                            equipo.id
                    )
        );


    select.innerHTML = `

        <option value="">
            Seleccione equipo...
        </option>

    `;


    disponibles.forEach(
        equipo => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                equipo.id;


            option.textContent =

                equipo.codigo +
                " | " +
                equipo.tipo +
                " | " +
                equipo.marca +
                " | Serie: " +
                equipo.serie;


            select.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   MOSTRAR INFORMACION EQUIPO
========================================== */

function mostrarDatosEquipoEntrega() {

    const equipoId =
        document.getElementById(
            "equipoEntrega"
        ).value;


    const preview =
        document.getElementById(
            "previewEquipoEntrega"
        );


    if (!equipoId) {

        preview.classList.add(
            "hidden"
        );

        return;

    }


    const equipos =
        obtenerEquipos();


    const equipo =
        equipos.find(
            item =>
                item.id === equipoId
        );


    if (!equipo) {

        preview.classList.add(
            "hidden"
        );

        return;

    }


    document.getElementById(
        "previewCodigo"
    ).textContent =
        equipo.codigo;


    document.getElementById(
        "previewTipo"
    ).textContent =
        equipo.tipo;


    document.getElementById(
        "previewMarca"
    ).textContent =
        equipo.marca;


    document.getElementById(
        "previewModelo"
    ).textContent =
        equipo.modelo || "-";


    document.getElementById(
        "previewSerie"
    ).textContent =
        equipo.serie;


    preview.classList.remove(
        "hidden"
    );

}


/* ==========================================
   USUARIO ACTUAL
========================================== */

function cargarUsuarioEntrega() {

    const sesion =
        obtenerSesionActual();


    const elemento =
        document.getElementById(
            "usuarioEntregaActual"
        );


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
   VALIDAR DNI
========================================== */

function validarDNIEntrega(dni) {

    return /^[0-9]{8}$/.test(dni);

}


/* ==========================================
   REGISTRAR ENTREGA
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const formulario =
            document.getElementById(
                "entregaForm"
            );


        if (!formulario) {

            return;

        }


        formulario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                registrarEntregaEquipo();

            }
        );

    }
);


/* ==========================================
   REGISTRAR
========================================== */

function registrarEntregaEquipo() {

    const dni =
        document
            .getElementById(
                "dniEntrega"
            )
            .value
            .trim();


    const trabajador =
        document
            .getElementById(
                "trabajadorEntrega"
            )
            .value
            .trim();


    const cargo =
        document
            .getElementById(
                "cargoEntrega"
            )
            .value
            .trim();


    const area =
        document
            .getElementById(
                "areaEntrega"
            )
            .value
            .trim();


    const observacion =
        document
            .getElementById(
                "observacionEntrega"
            )
            .value
            .trim();


    // ======================================
    // VALIDAR DNI
    // ======================================

    if (
        !validarDNIEntrega(
            dni
        )
    ) {

        alert(
            "Ingrese un DNI válido de 8 dígitos."
        );

        return;

    }


    // ======================================
    // VALIDAR TRABAJADOR
    // ======================================

    if (!trabajador) {

        alert(
            "Seleccione o ingrese un trabajador válido."
        );

        return;

    }


    // ======================================
    // VALIDAR EQUIPOS
    // ======================================

    if (
        equiposSeleccionadosEntrega.length ===
        0
    ) {

        alert(
            "Debe agregar al menos un equipo."
        );

        return;

    }


    const equipos =
        obtenerEquipos();


    /*
        Validación final.
        Esto evita entregar un equipo que cambió
        de estado mientras el formulario estaba abierto.
    */

    for (
        const seleccionado
        of equiposSeleccionadosEntrega
    ) {

        const equipo =
            equipos.find(
                item =>
                    item.id ===
                    seleccionado.equipoId
            );


        if (!equipo) {

            alert(
                "Uno de los equipos seleccionados ya no existe."
            );

            return;

        }


        if (
            equipo.estado !==
            "Disponible"
        ) {

            alert(

                "El equipo " +
                equipo.codigo +
                " ya no se encuentra disponible."

            );

            return;

        }

    }


    // ======================================
    // USUARIO
    // ======================================

    const sesion =
        obtenerSesionActual();


    const numeroEntrega =
        generarNumeroEntrega();


    // ======================================
    // CREAR ENTREGA
    // ======================================

    const nuevaEntrega = {

        id:
            "ENTREGA_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2,7),

        numero:
            numeroEntrega,

        fecha:
            fechaActualEquipo(),

        dni,

        trabajador,

        cargo,

        area,

        equipos:
            equiposSeleccionadosEntrega.map(
                equipo => ({
                    ...equipo
                })
            ),

        cantidadEquipos:
            equiposSeleccionadosEntrega.length,

        observacion,

        atendidoPor:
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

        estado:
            "PENDIENTE_FIRMA",

        firma:
            null,

        fechaFirma:
            null,

        fechaRegistro:
            new Date()
                .toISOString()

    };


    // ======================================
    // GUARDAR ENTREGA
    // ======================================

    const entregas =
        obtenerEntregas();


    entregas.push(
        nuevaEntrega
    );


    guardarEntregas(
        entregas
    );


    // ======================================
    // ACTUALIZAR TODOS LOS EQUIPOS
    // ======================================

    equiposSeleccionadosEntrega
        .forEach(
            seleccionado => {

                const indice =
                    equipos.findIndex(
                        equipo =>
                            equipo.id ===
                            seleccionado.equipoId
                    );


                if (
                    indice === -1
                ) {

                    return;

                }


                equipos[indice].estado =
                    "Entregado";


                equipos[indice].asignadoA = {

                    entregaId:
                        nuevaEntrega.id,

                    numeroEntrega:
                        nuevaEntrega.numero,

                    dni,

                    trabajador,

                    fecha:
                        nuevaEntrega.fecha

                };

            }
        );


    guardarEquipos(
        equipos
    );


    // ======================================
    // LIMPIAR / ACTUALIZAR
    // ======================================

    const cantidad =
        nuevaEntrega.cantidadEquipos;


    cerrarFormularioEntrega();


    cargarEntregas();

    cargarEquipos();

    cargarInventario();

    cargarDashboard();

    cargarNotificaciones();


    mostrarToast(
        "Entrega registrada",
        `${nuevaEntrega.numero} · ${nuevaEntrega.cantidadEquipos} equipo(s) entregado(s).`,
        "success"
    );

}


/* ==========================================
   CARGAR TABLA
========================================== */

function cargarEntregas(
    lista = null
) {

    const tbody =
        document.getElementById(
            "entregasTableBody"
        );


    if (!tbody) {

        return;

    }


    const entregas =
        lista ||
        obtenerEntregas();


    tbody.innerHTML = "";


    if (
        entregas.length === 0
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
                        class="fa-solid fa-hand-holding"
                        style="
                            font-size:26px;
                            display:block;
                            margin-bottom:10px;
                        "
                    ></i>

                    No hay entregas registradas.

                </td>

            </tr>

        `;


        actualizarEstadisticasEntregas();


        return;

    }


    const ordenadas =
        [...entregas]
            .reverse();


    ordenadas.forEach(
        entrega => {

            const fila =
                document.createElement(
                    "tr"
                );
        
            const estaDevuelto =
                entrega.estado === "DEVUELTO";
        
            const estaFirmado =
                Boolean(
                    entrega.firma
                );


            const textoFirma =
                estaFirmado
                    ? "Firmado"
                    : "Pendiente";


            const claseFirma =
                estaFirmado
                    ? "signed"
                    : "pending";


            const textoEstado =
                estaFirmado
                    ? "Firmado"
                    : "Pendiente firma";
            
            const equiposEntrega =
                obtenerEquiposDeEntrega(
                    entrega
                );
            
            const textoEquipos =

                equiposEntrega.length === 1

                    ? equiposEntrega[0].tipoEquipo

                    : equiposEntrega.length +
                    " equipos";

            const textoSeries =

                equiposEntrega
                    .map(
                        equipo =>
                            equipo.serie
                    )
                    .join(", ");

            const htmlEquipos =
                equiposEntrega
                    .map(
                        equipo => `

                            <div class="delivery-table-equipment">

                                <strong>
                                    ${escapeHTML(
                                        equipo.tipoEquipo
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        equipo.codigoEquipo
                                    )}
                                    ·
                                    ${escapeHTML(
                                        equipo.serie
                                    )}
                                </span>

                            </div>

                        `
                    )
                    .join("");

            fila.innerHTML = `

    <td>
        <strong>
            ${escapeHTML(entrega.numero)}
        </strong>
    </td>


    <td>
        ${escapeHTML(entrega.fecha)}
    </td>


    <td>
        ${escapeHTML(entrega.dni)}
    </td>


    <td>

        <strong>
            ${escapeHTML(entrega.trabajador)}
        </strong>

        <small
            style="
                display:block;
                color:#64748b;
                margin-top:3px;
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
        ${escapeHTML(entrega.atendidoPor)}
    </td>


    <!-- FIRMA -->

    <td>

        <span
            class="
                signature-status
                ${claseFirma}
            "
        >

            <i class="
                fa-solid
                ${
                    estaFirmado
                        ? "fa-circle-check"
                        : "fa-clock"
                }
            "></i>

            ${textoFirma}

        </span>

    </td>


    <!-- ESTADO -->

    <td>

        <span
            class="
                status-equipment
                ${
                    estaFirmado
                        ? "disponible"
                        : "mantenimiento"
                }
            "
        >

            <i class="
                fa-solid
                ${
                    estaFirmado
                        ? "fa-check"
                        : "fa-clock"
                }
            "></i>

            ${textoEstado}

        </span>

    </td>


    <!-- ACCIONES -->

    <td>

        <div class="equipment-actions">


            <button
                type="button"
                class="
                    equipment-action-btn
                    btn-sign-delivery
                    ${
                        estaFirmado
                            ? "signed"
                            : ""
                    }
                "
                title="${
                    estaFirmado
                        ? "Ver / modificar firma"
                        : "Firmar"
                }"
                onclick="
                    abrirFirmaEntrega(
                        '${entrega.id}'
                    )
                "
            >

                <i class="
                    fa-solid
                    ${
                        estaFirmado
                            ? "fa-signature"
                            : "fa-pen-nib"
                    }
                "></i>

            </button>

            <button
                type="button"
                class="equipment-action-btn"
                title="Ver vale"
                onclick="
                    abrirValeEntrega(
                        '${entrega.id}'
                    )
                "
            >

                <i class="fa-solid fa-file-lines"></i>

            </button>


        </div>

    </td>

`;


            tbody.appendChild(
                fila
            );

        }
    );


    actualizarEstadisticasEntregas();

setTimeout(
    function() {

        const tabla =
            document.querySelector(
                "#entregas .equipment-table"
            );


        if (!tabla) {
            return;
        }


        const encabezados =
            tabla.querySelectorAll(
                "thead th"
            );


        if (
            encabezados.length === 0
        ) {
            return;
        }


        // Primera columna = N° Entrega
        ordenarTablaPorColumna(
            tabla,
            0,
            encabezados[0],
            "asc"
        );

    },
    10
);


}


/* ==========================================
   FILTRAR ENTREGAS
========================================== */

function filtrarEntregas() {

    const buscador =
        document.getElementById(
            "buscarEntregaInput"
        );


    if (!buscador) {

        return;

    }


    const texto =
        buscador.value
            .trim()
            .toLowerCase();


    const entregas =
        obtenerEntregas();


    const filtradas =
        entregas.filter(
            entrega => {

                return (

                    entrega.numero
                        .toLowerCase()
                        .includes(texto)

                    ||

                    entrega.dni
                        .toLowerCase()
                        .includes(texto)

                    ||

                    entrega.trabajador
                        .toLowerCase()
                        .includes(texto)

                    ||

                    entrega.tipoEquipo
                        .toLowerCase()
                        .includes(texto)

                    ||

                    entrega.serie
                        .toLowerCase()
                        .includes(texto)

                    ||

                    entrega.atendidoPor
                        .toLowerCase()
                        .includes(texto)

                );

            }
        );


    cargarEntregas(
        filtradas
    );

}


/* ==========================================
   ESTADISTICAS
========================================== */

function actualizarEstadisticasEntregas() {

    const entregas =
        obtenerEntregas();


    const pendientes =
        entregas.filter(
            entrega =>
                entrega.estado ===
                "PENDIENTE_FIRMA"
        ).length;


    const firmadas =
        entregas.filter(
            entrega =>
                entrega.estado ===
                "FIRMADO"
        ).length;


    const total =
        entregas.length;


    const totalElement =
        document.getElementById(
            "totalEntregas"
        );


    const activosElement =
        document.getElementById(
            "entregasActivas"
        );


    const equiposElement =
        document.getElementById(
            "totalEquiposEntregados"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (activosElement) {

        activosElement.textContent =
            firmadas;

    }


    if (equiposElement) {

        equiposElement.textContent =
            pendientes;

    }

}


/* ==========================================
   VER DETALLE
========================================== */

function verDetalleEntrega(id) {

    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id === id
        );


    if (!entrega) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    alert(
        "ENTREGA: " +
        entrega.numero +
        "\n\n" +

        "Fecha: " +
        entrega.fecha +
        "\n" +

        "DNI: " +
        entrega.dni +
        "\n" +

        "Trabajador: " +
        entrega.trabajador +
        "\n" +

        "Cargo: " +
        (
            entrega.cargo ||
            "-"
        ) +
        "\n" +

        "Área: " +
        (
            entrega.area ||
            "-"
        ) +
        "\n\n" +

        "Equipo: " +
        entrega.tipoEquipo +
        "\n" +

        "Código: " +
        entrega.codigoEquipo +
        "\n" +

        "Marca: " +
        entrega.marca +
        "\n" +

        "Modelo: " +
        (
            entrega.modelo ||
            "-"
        ) +
        "\n" +

        "Serie: " +
        entrega.serie +
        "\n\n" +

        "Atendido por: " +
        entrega.atendidoPor
    );

}

/* ==========================================
   BUSCAR TRABAJADOR POR DNI
========================================== */

function buscarTrabajadorEntregaPorDNI() {

    const dniInput =
        document.getElementById(
            "dniEntrega"
        );


    const trabajadorInput =
        document.getElementById(
            "trabajadorEntrega"
        );


    const cargoInput =
        document.getElementById(
            "cargoEntrega"
        );


    const areaInput =
        document.getElementById(
            "areaEntrega"
        );


    if (
        !dniInput ||
        !trabajadorInput
    ) {

        return;

    }


    dniInput.value =
        dniInput.value
            .replace(
                /\D/g,
                ""
            )
            .slice(
                0,
                8
            );


    const dni =
        dniInput.value;


    if (
        dni.length !== 8
    ) {

        trabajadorInput.value = "";

        if (cargoInput) {
            cargoInput.value = "";
        }

        if (areaInput) {
            areaInput.value = "";
        }

        return;

    }


    const trabajador =
        obtenerTrabajadores()
            .find(
                item =>
                    item.dni ===
                    dni
            );


    if (!trabajador) {

        trabajadorInput.value = "";

        if (cargoInput) {
            cargoInput.value = "";
        }

        if (areaInput) {
            areaInput.value = "";
        }

        return;

    }


    trabajadorInput.value =
        trabajador.nombre;


    if (cargoInput) {

        cargoInput.value =
            trabajador.cargo ||
            "";

    }


    if (areaInput) {

        areaInput.value =
            trabajador.area ||
            "";

    }

}

function agregarEquipoEntregaPorSerie() {

    const input =
        document.getElementById(
            "buscarSerieEntrega"
        );


    if (!input) {
        return;
    }


    const serie =
        input.value
            .trim()
            .toLowerCase();


    if (!serie) {

        alert(
            "Ingrese el número de serie."
        );

        input.focus();

        return;

    }


    const equipo =
        obtenerEquipos()
            .find(
                item =>

                    item.estado ===
                        "Disponible"

                    &&

                    String(
                        item.serie || ""
                    )
                    .trim()
                    .toLowerCase() ===
                    serie
            );


    if (!equipo) {

        alert(
            "No se encontró un equipo disponible con esa serie."
        );

        input.select();

        return;

    }


    agregarEquipoAEntrega(
        equipo.id
    );


    input.value = "";

    input.focus();

}

function agregarEquipoEntregaSeleccionado() {

    const select =
        document.getElementById(
            "equipoEntrega"
        );


    if (!select) {
        return;
    }


    const equipoId =
        select.value;


    if (!equipoId) {

        alert(
            "Selecciona un equipo."
        );

        return;

    }


    agregarEquipoAEntrega(
        equipoId
    );

}

function buscarSerieEntregaEnter(
    event
) {

    if (
        event.key ===
        "Enter"
    ) {

        event.preventDefault();

        agregarEquipoEntregaPorSerie();

    }

}

function agregarEquipoAEntrega(
    equipoId
) {

    const equipos =
        obtenerEquipos();


    const equipo =
        equipos.find(
            item =>
                item.id ===
                equipoId
        );


    if (!equipo) {

        alert(
            "No se encontró el equipo."
        );

        return;

    }


    if (
        equipo.estado !==
        "Disponible"
    ) {

        alert(
            "El equipo no se encuentra disponible."
        );

        return;

    }


    const yaAgregado =
        equiposSeleccionadosEntrega
            .some(
                item =>
                    item.equipoId ===
                    equipo.id
            );


    if (yaAgregado) {

        alert(
            "Este equipo ya fue agregado a la entrega."
        );

        return;

    }


    equiposSeleccionadosEntrega.push({

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

        ubicacion:
            equipo.ubicacion || ""

    });


    renderizarEquiposSeleccionadosEntrega();


    cargarEquiposDisponiblesEntrega();

}

function renderizarEquiposSeleccionadosEntrega() {

    const tbody =
        document.getElementById(
            "equiposEntregaTableBody"
        );


    const contador =
        document.getElementById(
            "cantidadEquiposEntrega"
        );


    if (contador) {

        contador.textContent =
            equiposSeleccionadosEntrega.length;

    }


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        equiposSeleccionadosEntrega.length ===
        0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-delivery-items"
                >
                    No has agregado equipos.
                </td>

            </tr>

        `;

        return;

    }


    equiposSeleccionadosEntrega
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

                        <button
                            type="button"
                            class="btn-remove-delivery-equipment"
                            onclick="
                                eliminarEquipoSeleccionadoEntrega(
                                    '${equipo.equipoId}'
                                )
                            "
                            title="Quitar equipo"
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

function eliminarEquipoSeleccionadoEntrega(
    equipoId
) {

    equiposSeleccionadosEntrega =
        equiposSeleccionadosEntrega
            .filter(
                item =>
                    item.equipoId !==
                    equipoId
            );


    renderizarEquiposSeleccionadosEntrega();

    cargarEquiposDisponiblesEntrega();

}

function obtenerEquiposDeEntrega(
    entrega
) {

    // NUEVO FORMATO MULTIPLE

    if (
        Array.isArray(
            entrega.equipos
        )
        &&
        entrega.equipos.length > 0
    ) {

        return entrega.equipos;

    }


    // FORMATO ANTIGUO

    if (
        entrega.equipoId ||
        entrega.codigoEquipo ||
        entrega.serie
    ) {

        return [

            {
                equipoId:
                    entrega.equipoId || "",

                codigoEquipo:
                    entrega.codigoEquipo || "",

                tipoEquipo:
                    entrega.tipoEquipo || "",

                marca:
                    entrega.marca || "",

                modelo:
                    entrega.modelo || "",

                serie:
                    entrega.serie || ""
            }

        ];

    }


    return [];

}