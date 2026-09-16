// ==========================================
// ETAPA 11 - CONFIGURACIÓN / CARGA EXCEL
// ==========================================

const STORAGE_TRABAJADORES =
    "controlEquiposTrabajadores";

const STORAGE_ULTIMA_CARGA =
    "controlEquiposUltimaCarga";


/* ==========================================
   TRABAJADORES
========================================== */

function obtenerTrabajadores() {

    try {

        return JSON.parse(
            localStorage.getItem(
                STORAGE_TRABAJADORES
            )
        ) || [];

    }

    catch (error) {

        console.error(
            "Error al leer trabajadores:",
            error
        );

        return [];

    }

}


function guardarTrabajadores(
    trabajadores
) {

    localStorage.setItem(
        STORAGE_TRABAJADORES,
        JSON.stringify(
            trabajadores
        )
    );

}


/* ==========================================
   NORMALIZAR ENCABEZADO EXCEL
========================================== */

function normalizarEncabezadoExcel(
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
    .trim()
    .toUpperCase()
    .replace(
        /\s+/g,
        " "
    );

}


/* ==========================================
   BUSCAR VALOR EN FILA EXCEL
========================================== */

function obtenerValorFilaExcel(
    fila,
    posiblesColumnas
) {

    const claves =
        Object.keys(
            fila
        );


    for (
        const posible
        of posiblesColumnas
    ) {

        const normalizada =
            normalizarEncabezadoExcel(
                posible
            );


        const clave =
            claves.find(
                item =>
                    normalizarEncabezadoExcel(
                        item
                    ) ===
                    normalizada
            );


        if (
            clave !== undefined
        ) {

            return fila[clave];

        }

    }


    return "";

}


/* ==========================================
   LEER ARCHIVO EXCEL
========================================== */

function leerArchivoExcel(
    archivo
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (
                typeof XLSX ===
                "undefined"
            ) {

                reject(
                    new Error(
                        "No se cargó la librería XLSX."
                    )
                );

                return;

            }


            const lector =
                new FileReader();


            lector.onload =
                function(event) {

                    try {

                        const datos =
                            new Uint8Array(
                                event.target.result
                            );


                        const libro =
                            XLSX.read(
                                datos,
                                {
                                    type:
                                        "array"
                                }
                            );


                        if (
                            libro.SheetNames.length ===
                            0
                        ) {

                            throw new Error(
                                "El Excel no contiene hojas."
                            );

                        }


                        const hoja =
                            libro.Sheets[
                                libro.SheetNames[0]
                            ];


                        const filas =
                            XLSX.utils.sheet_to_json(
                                hoja,
                                {
                                    defval: ""
                                }
                            );


                        resolve(
                            filas
                        );

                    }

                    catch (error) {

                        reject(
                            error
                        );

                    }

                };


            lector.onerror =
                function() {

                    reject(
                        new Error(
                            "No se pudo leer el archivo."
                        )
                    );

                };


            lector.readAsArrayBuffer(
                archivo
            );

        }
    );

}


/* ==========================================
   PROCESAR TRABAJADORES
========================================== */

async function procesarExcelTrabajadores(
    event
) {

    const input =
        event.target;


    const archivo =
        input.files[0];


    if (!archivo) {

        return;

    }


    try {

        const filas =
            await leerArchivoExcel(
                archivo
            );


        if (
            filas.length === 0
        ) {

            alert(
                "El archivo Excel no contiene registros."
            );

            input.value = "";

            return;

        }


        const existentes =
            obtenerTrabajadores();


        let agregados = 0;

        let duplicados = 0;

        let invalidos = 0;


        filas.forEach(
            fila => {

                const dni =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "DNI",
                                "DOCUMENTO",
                                "NUMERO DOCUMENTO",
                                "N° DOCUMENTO"
                            ]
                        ) || ""
                    )
                    .trim()
                    .replace(
                        /\.0$/,
                        ""
                    );


                const nombre =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "APELLIDOS Y NOMBRES",
                                "APELLIDOS Y NOMBRE",
                                "NOMBRES",
                                "NOMBRE",
                                "TRABAJADOR"
                            ]
                        ) || ""
                    )
                    .trim();


                const cargo =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "CARGO",
                                "PUESTO"
                            ]
                        ) || ""
                    )
                    .trim();


                const area =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "AREA",
                                "ÁREA",
                                "PROYECTO"
                            ]
                        ) || ""
                    )
                    .trim();


                if (
                    !/^\d{8}$/.test(
                        dni
                    )
                    ||
                    !nombre
                ) {

                    invalidos++;

                    return;

                }


                const existe =
                    existentes.some(
                        trabajador =>
                            trabajador.dni ===
                            dni
                    );


                if (existe) {

                    duplicados++;

                    return;

                }


                existentes.push({

                    id:
                        "TRA_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .substring(2,7),

                    dni,

                    nombre,

                    cargo,

                    area,

                    fechaCarga:
                        new Date()
                            .toISOString()

                });


                agregados++;

            }
        );


        guardarTrabajadores(
            existentes
        );


        registrarUltimaCarga(
            "Trabajadores"
        );


        cargarConfiguracion();


        alert(

            "Carga de trabajadores finalizada.\n\n" +

            "Agregados: " +
            agregados +

            "\nDuplicados: " +
            duplicados +

            "\nInválidos: " +
            invalidos

        );

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            "No se pudo procesar el archivo de trabajadores."
        );

    }


    input.value = "";

}


/* ==========================================
   PROCESAR EQUIPOS
========================================== */

async function procesarExcelEquipos(
    event
) {

    const input =
        event.target;


    const archivo =
        input.files[0];


    if (!archivo) {

        return;

    }


    try {

        const filas =
            await leerArchivoExcel(
                archivo
            );


        if (
            filas.length === 0
        ) {

            alert(
                "El archivo Excel no contiene registros."
            );

            input.value = "";

            return;

        }


        const equipos =
            obtenerEquipos();


        let agregados = 0;

        let duplicados = 0;

        let invalidos = 0;


        filas.forEach(
            fila => {

                const tipo =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "TIPO",
                                "EQUIPO",
                                "TIPO EQUIPO"
                            ]
                        ) || ""
                    )
                    .trim();


                const marca =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "MARCA"
                            ]
                        ) || ""
                    )
                    .trim();


                const modelo =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "MODELO"
                            ]
                        ) || ""
                    )
                    .trim();


                const serie =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "SERIE",
                                "N° SERIE",
                                "NRO SERIE",
                                "NUMERO SERIE"
                            ]
                        ) || ""
                    )
                    .trim();


                const ubicacion =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "UBICACION",
                                "UBICACIÓN",
                                "ALMACEN",
                                "ALMACÉN"
                            ]
                        ) || ""
                    )
                    .trim();


                const estadoExcel =
                    String(
                        obtenerValorFilaExcel(
                            fila,
                            [
                                "ESTADO",
                                "STATUS"
                            ]
                        ) || ""
                    )
                    .trim();


                if (
                    !tipo ||
                    !serie
                ) {

                    invalidos++;

                    return;

                }


                const existe =
                    equipos.some(
                        equipo =>
                            String(
                                equipo.serie || ""
                            )
                            .trim()
                            .toLowerCase() ===
                            serie.toLowerCase()
                    );


                if (existe) {

                    duplicados++;

                    return;

                }


                const nuevoEstado =
                    normalizarEstadoEquipoImportado(
                        estadoExcel
                    );


                equipos.push({

                    id:
                        "EQUIPO_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .substring(2,8),

                    codigo:
                        generarCodigoEquipoConLista(
                            equipos
                        ),

                    tipo,

                    marca,

                    modelo,

                    serie,

                    ubicacion,

                    estado:
                        nuevoEstado,

                    fecha:
                        fechaActualEquipo(),

                    fechaRegistro:
                        new Date()
                            .toISOString()

                });


                agregados++;

            }
        );


        guardarEquipos(
            equipos
        );


        registrarUltimaCarga(
            "Equipos"
        );


        cargarEquipos();

        cargarInventario();

        cargarDashboard();

        cargarConfiguracion();


        alert(

            "Carga de equipos finalizada.\n\n" +

            "Agregados: " +
            agregados +

            "\nDuplicados: " +
            duplicados +

            "\nInválidos: " +
            invalidos

        );

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            "No se pudo procesar el archivo de equipos."
        );

    }


    input.value = "";

}


/* ==========================================
   GENERAR CÓDIGO PARA IMPORTACIÓN
========================================== */

function generarCodigoEquipoConLista(
    equipos
) {

    let mayor =
        0;


    equipos.forEach(
        equipo => {

            const numero =
                parseInt(
                    String(
                        equipo.codigo || ""
                    )
                    .replace(
                        "EQ",
                        ""
                    )
                );


            if (
                !isNaN(numero) &&
                numero > mayor
            ) {

                mayor =
                    numero;

            }

        }
    );


    return (
        "EQ" +
        String(
            mayor + 1
        ).padStart(
            6,
            "0"
        )
    );

}


/* ==========================================
   NORMALIZAR ESTADO IMPORTADO
========================================== */

function normalizarEstadoEquipoImportado(
    estado
) {

    const texto =
        String(
            estado || ""
        )
        .trim()
        .toLowerCase();


    if (
        texto === "entregado"
        ||
        texto === "asignado"
    ) {

        return "Entregado";

    }


    if (
        texto === "mantenimiento"
    ) {

        return "Mantenimiento";

    }


    if (
        texto === "baja"
    ) {

        return "Baja";

    }


    return "Disponible";

}


/* ==========================================
   CONFIGURACIÓN GENERAL
========================================== */

function cargarConfiguracion() {

    cargarTrabajadoresConfig();

    cargarEquiposConfig();

    actualizarEstadisticasConfig();

}


/* ==========================================
   TRABAJADORES TABLA
========================================== */

function cargarTrabajadoresConfig(
    lista = null
) {

    const tbody =
        document.getElementById(
            "trabajadoresConfigTableBody"
        );


    if (!tbody) {

        return;

    }


    const trabajadores =
        lista ||
        obtenerTrabajadores();


    tbody.innerHTML = "";


    if (
        trabajadores.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

                    No hay trabajadores registrados.

                </td>

            </tr>

        `;

        return;

    }


    trabajadores.forEach(
        trabajador => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    ${escapeHTML(
                        trabajador.dni
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            trabajador.nombre
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        trabajador.cargo ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        trabajador.area ||
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatearFechaConfig(
                            trabajador.fechaCarga
                        )
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
   EQUIPOS CONFIG
========================================== */

function cargarEquiposConfig(
    lista = null
) {

    const tbody =
        document.getElementById(
            "equiposConfigTableBody"
        );


    if (!tbody) {

        return;

    }


    const equipos =
        lista ||
        obtenerEquipos();


    tbody.innerHTML = "";


    if (
        equipos.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >

                    No hay equipos registrados.

                </td>

            </tr>

        `;

        return;

    }


    equipos.forEach(
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
                        equipo.ubicacion ||
                        "-"
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

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}


/* ==========================================
   FILTRAR TRABAJADORES
========================================== */

function filtrarTrabajadoresConfig() {

    const input =
        document.getElementById(
            "buscarTrabajadorConfig"
        );


    if (!input) {

        return;

    }


    const texto =
        input.value
            .trim()
            .toLowerCase();


    const trabajadores =
        obtenerTrabajadores();


    const filtrados =
        trabajadores.filter(
            trabajador => {

                return [

                    trabajador.dni,

                    trabajador.nombre,

                    trabajador.cargo,

                    trabajador.area

                ]
                .some(
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
        );


    cargarTrabajadoresConfig(
        filtrados
    );

}


/* ==========================================
   FILTRAR EQUIPOS CONFIG
========================================== */

function filtrarEquiposConfig() {

    const input =
        document.getElementById(
            "buscarEquipoConfig"
        );


    if (!input) {

        return;

    }


    const texto =
        input.value
            .trim()
            .toLowerCase();


    const equipos =
        obtenerEquipos();


    const filtrados =
        equipos.filter(
            equipo => {

                return [

                    equipo.codigo,

                    equipo.tipo,

                    equipo.marca,

                    equipo.modelo,

                    equipo.serie,

                    equipo.ubicacion,

                    equipo.estado

                ]
                .some(
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
        );


    cargarEquiposConfig(
        filtrados
    );

}


/* ==========================================
   PESTAÑAS
========================================== */

function mostrarCatalogoConfig(
    tipo
) {

    const trabajadores =
        document.getElementById(
            "catalogoTrabajadoresConfig"
        );


    const equipos =
        document.getElementById(
            "catalogoEquiposConfig"
        );


    const tabTrabajadores =
        document.getElementById(
            "tabTrabajadoresConfig"
        );


    const tabEquipos =
        document.getElementById(
            "tabEquiposConfig"
        );


    if (
        tipo ===
        "trabajadores"
    ) {

        trabajadores.classList.remove(
            "hidden"
        );

        equipos.classList.add(
            "hidden"
        );

        tabTrabajadores.classList.add(
            "active"
        );

        tabEquipos.classList.remove(
            "active"
        );

    }

    else {

        equipos.classList.remove(
            "hidden"
        );

        trabajadores.classList.add(
            "hidden"
        );

        tabEquipos.classList.add(
            "active"
        );

        tabTrabajadores.classList.remove(
            "active"
        );

    }

}


/* ==========================================
   ESTADÍSTICAS
========================================== */

function actualizarEstadisticasConfig() {

    actualizarTextoSeguro(
        "totalTrabajadoresConfig",
        obtenerTrabajadores().length
    );


    actualizarTextoSeguro(
        "totalEquiposConfig",
        obtenerEquipos().length
    );


    const ultimaCarga =
        localStorage.getItem(
            STORAGE_ULTIMA_CARGA
        );


    actualizarTextoSeguro(
        "ultimaCargaConfig",
        ultimaCarga ||
        "Sin cargas"
    );

}


/* ==========================================
   ÚLTIMA CARGA
========================================== */

function registrarUltimaCarga(
    tipo
) {

    const texto =

        tipo +
        " - " +

        new Date()
            .toLocaleString(
                "es-PE",
                {
                    day:
                        "2-digit",

                    month:
                        "2-digit",

                    year:
                        "numeric",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"
                }
            );


    localStorage.setItem(
        STORAGE_ULTIMA_CARGA,
        texto
    );

}


/* ==========================================
   FECHA
========================================== */

function formatearFechaConfig(
    iso
) {

    if (!iso) {

        return "-";

    }


    const fecha =
        new Date(
            iso
        );


    if (
        isNaN(
            fecha.getTime()
        )
    ) {

        return "-";

    }


    return fecha.toLocaleDateString(
        "es-PE",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    );

}


/* ==========================================
   ELIMINAR TRABAJADORES
========================================== */

function eliminarTodosTrabajadores() {

    const confirmar =
        confirm(
            "¿Deseas eliminar todos los trabajadores cargados?"
        );


    if (!confirmar) {

        return;

    }


    localStorage.removeItem(
        STORAGE_TRABAJADORES
    );


    cargarConfiguracion();


    alert(
        "Catálogo de trabajadores eliminado."
    );

}


/* ==========================================
   ELIMINAR EQUIPOS
========================================== */

function eliminarTodosEquiposConfig() {

    const entregas =
        obtenerEntregas();


    if (
        entregas.length > 0
    ) {

        alert(
            "No puedes eliminar todos los equipos porque existen entregas registradas."
        );

        return;

    }


    const confirmar =
        confirm(
            "¿Deseas eliminar todos los equipos registrados?"
        );


    if (!confirmar) {

        return;

    }


    guardarEquipos(
        []
    );


    cargarEquipos();

    cargarInventario();

    cargarDashboard();

    cargarConfiguracion();


    alert(
        "Catálogo de equipos eliminado."
    );

}