// ==========================================
// ETAPA 3 - CONTROL DE EQUIPOS
// ==========================================

const STORAGE_EQUIPOS = "controlEquiposLista";

let equipoEditando = null;


/* ==========================================
   OBTENER EQUIPOS
========================================== */

function obtenerEquipos() {

    return JSON.parse(
        localStorage.getItem(STORAGE_EQUIPOS)
    ) || [];

}


/* ==========================================
   GUARDAR EQUIPOS
========================================== */

function guardarEquipos(equipos) {

    localStorage.setItem(
        STORAGE_EQUIPOS,
        JSON.stringify(equipos)
    );

}


/* ==========================================
   GENERAR CÓDIGO
========================================== */

function generarCodigoEquipo() {

    const equipos = obtenerEquipos();

    let mayorNumero = 0;


    equipos.forEach(equipo => {

        const numero = parseInt(
            String(equipo.codigo)
                .replace("EQ", "")
        );


        if (!isNaN(numero) && numero > mayorNumero) {

            mayorNumero = numero;

        }

    });


    const siguiente = mayorNumero + 1;


    return "EQ" +
        String(siguiente).padStart(6, "0");

}


/* ==========================================
   FECHA
========================================== */

function fechaActualEquipo() {

    const fecha = new Date();


    return fecha.toLocaleDateString(
        "es-PE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* ==========================================
   ABRIR FORMULARIO
========================================== */

function abrirFormularioEquipo() {

    equipoEditando = null;


    document.getElementById("equipoForm").reset();


    document.getElementById("equipoId").value = "";


    document.getElementById("codigoEquipo").value =
        generarCodigoEquipo();


    document.getElementById("fechaEquipo").value =
        fechaActualEquipo();


    document.getElementById("estadoEquipo").value =
        "Disponible";


    document.getElementById("tituloModalEquipo").textContent =
        "Registrar equipo";


    document
        .getElementById("modalEquipo")
        .classList.remove("hidden");

}


/* ==========================================
   CERRAR FORMULARIO
========================================== */

function cerrarFormularioEquipo() {

    document
        .getElementById("modalEquipo")
        .classList.add("hidden");


    equipoEditando = null;

}


/* ==========================================
   GUARDAR EQUIPO
========================================== */

document
    .getElementById("equipoForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById("equipoId").value;


            const codigo =
                document.getElementById("codigoEquipo").value;


            const tipo =
                document.getElementById("tipoEquipo").value;


            const marca =
                document.getElementById("marcaEquipo").value.trim();


            const modelo =
                document.getElementById("modeloEquipo").value.trim();


            const serie =
                document.getElementById("serieEquipo").value.trim();


            const ubicacion =
                document.getElementById("ubicacionEquipo").value.trim();


            const estado =
                document.getElementById("estadoEquipo").value;


            const fecha =
                document.getElementById("fechaEquipo").value;


            if (!tipo || !marca || !serie) {

                alert(
                    "Completa los campos obligatorios."
                );

                return;
            }


            let equipos = obtenerEquipos();


            // EVITAR SERIES REPETIDAS
            const serieDuplicada =
                equipos.some(
                    equipo =>
                        equipo.serie.toLowerCase() ===
                            serie.toLowerCase()
                        &&
                        equipo.id !== id
                );


            if (serieDuplicada) {

                alert(
                    "Ya existe un equipo registrado con ese número de serie."
                );

                return;
            }


            // EDITAR
            if (id) {

                const indice =
                    equipos.findIndex(
                        equipo => equipo.id === id
                    );


                if (indice !== -1) {

                    equipos[indice] = {

                        ...equipos[indice],

                        tipo,
                        marca,
                        modelo,
                        serie,
                        ubicacion,
                        estado

                    };

                }

            }


            // NUEVO
            else {

                const nuevoEquipo = {

                    id:
                        "EQUIPO_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .substring(2, 8),

                    codigo,

                    tipo,

                    marca,

                    modelo,

                    serie,

                    ubicacion,

                    estado,

                    fecha,

                    fechaRegistro:
                        new Date().toISOString()

                };


                equipos.push(nuevoEquipo);

            }


            guardarEquipos(equipos);


            cerrarFormularioEquipo();


            cargarEquipos();

            cargarDashboard();


            mostrarToastEquipo(
                "Equipo registrado",
                "El equipo fue guardado correctamente."
            );
        }
    );


/* ==========================================
   CARGAR EQUIPOS
========================================== */

function cargarEquipos(lista = null) {

    const tbody =
        document.getElementById(
            "equiposTableBody"
        );


    if (!tbody) {

        return;

    }


    const equipos =
        lista || obtenerEquipos();


    tbody.innerHTML = "";


    if (equipos.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

                    <i
                        class="fa-solid fa-box-open"
                        style="
                            font-size:25px;
                            display:block;
                            margin-bottom:10px;
                        "
                    ></i>

                    No hay equipos registrados.

                </td>

            </tr>

        `;


        actualizarEstadisticasEquipos();

        return;

    }


    equipos.forEach(equipo => {

        const estadoClase =
            equipo.estado
                .toLowerCase()
                .replace(/\s/g, "-");


        const fila =
            document.createElement("tr");


        fila.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(equipo.codigo)}
                </strong>
            </td>

            <td>
                ${escapeHTML(equipo.tipo)}
            </td>

            <td>
                ${escapeHTML(equipo.marca)}
            </td>

            <td>
                ${escapeHTML(equipo.modelo || "-")}
            </td>

            <td>
                ${escapeHTML(equipo.serie)}
            </td>

            <td>
                ${escapeHTML(equipo.ubicacion || "-")}
            </td>

            <td>

                <span
                    class="
                        status-equipment
                        ${estadoClase}
                    "
                >

                    <i class="fa-solid fa-circle"></i>

                    ${escapeHTML(equipo.estado)}

                </span>

            </td>

            <td>

                <div class="equipment-actions">

                    <button
                        class="equipment-action-btn"
                        title="Editar"
                        onclick="
                            editarEquipo(
                                '${equipo.id}'
                            )
                        "
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="
                            equipment-action-btn
                            delete
                        "
                        title="Eliminar"
                        onclick="
                            eliminarEquipo(
                                '${equipo.id}'
                            )
                        "
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

            <td>
                <button
                    class="btn-qr"
                    onclick="mostrarQRIndividual('${equipo.serie}')"
                >
                    QR
                </button>
            </td>

        `;


        tbody.appendChild(fila);

    });


    actualizarEstadisticasEquipos();
    

}


/* ==========================================
   EDITAR EQUIPO
========================================== */

function editarEquipo(id) {

    const equipos = obtenerEquipos();


    const equipo =
        equipos.find(
            equipo => equipo.id === id
        );


    if (!equipo) {

        alert("No se encontró el equipo.");

        return;

    }


    equipoEditando = id;


    document.getElementById("equipoId").value =
        equipo.id;


    document.getElementById("codigoEquipo").value =
        equipo.codigo;


    document.getElementById("tipoEquipo").value =
        equipo.tipo;


    document.getElementById("marcaEquipo").value =
        equipo.marca;


    document.getElementById("modeloEquipo").value =
        equipo.modelo || "";


    document.getElementById("serieEquipo").value =
        equipo.serie;


    document.getElementById("ubicacionEquipo").value =
        equipo.ubicacion || "";


    document.getElementById("estadoEquipo").value =
        equipo.estado;


    document.getElementById("fechaEquipo").value =
        equipo.fecha;


    document.getElementById("tituloModalEquipo").textContent =
        "Editar equipo";


    document
        .getElementById("modalEquipo")
        .classList.remove("hidden");

}


/* ==========================================
   ELIMINAR EQUIPO
========================================== */

function eliminarEquipo(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar este equipo?"
        );


    if (!confirmar) {

        return;

    }


    let equipos = obtenerEquipos();


    equipos =
        equipos.filter(
            equipo => equipo.id !== id
        );


    guardarEquipos(equipos);


    cargarEquipos();

}


/* ==========================================
   FILTRAR
========================================== */

function filtrarEquipos() {

    const texto =
        document
            .getElementById("buscarEquipoInput")
            .value
            .trim()
            .toLowerCase();


    const estado =
        document
            .getElementById("filtroEstadoEquipo")
            .value;


    const equipos = obtenerEquipos();


    const filtrados =
        equipos.filter(equipo => {

            const coincideTexto =

                equipo.codigo
                    .toLowerCase()
                    .includes(texto)

                ||

                equipo.tipo
                    .toLowerCase()
                    .includes(texto)

                ||

                equipo.marca
                    .toLowerCase()
                    .includes(texto)

                ||

                (equipo.modelo || "")
                    .toLowerCase()
                    .includes(texto)

                ||

                equipo.serie
                    .toLowerCase()
                    .includes(texto);


            const coincideEstado =

                !estado ||

                equipo.estado === estado;


            return (
                coincideTexto &&
                coincideEstado
            );

        });


    cargarEquipos(filtrados);

}


/* ==========================================
   ESTADÍSTICAS
========================================== */

function actualizarEstadisticasEquipos() {

    const equipos = obtenerEquipos();


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


    document.getElementById(
        "totalEquipos"
    ).textContent = equipos.length;


    document.getElementById(
        "equiposDisponibles"
    ).textContent = disponibles;


    document.getElementById(
        "equiposEntregados"
    ).textContent = entregados;


    document.getElementById(
        "equiposMantenimiento"
    ).textContent = mantenimiento;

}