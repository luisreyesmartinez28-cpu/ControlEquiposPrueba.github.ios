/* =====================================================
   CONTROL DE EQUIPOS
   ETAPA 2
   LOGIN + REGISTRO + ROLES
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const STORAGE_USERS = "controlEquiposUsuarios";

const STORAGE_SESSION = "controlEquiposSesion";

const STORAGE_ORDEN_TABLAS = "controlEquiposOrdenTablas";


/* =====================================================
   CREAR ADMINISTRADOR INICIAL
===================================================== */

function inicializarUsuarios() {

    let usuarios = [];

    try {
        usuarios = JSON.parse(
            localStorage.getItem(STORAGE_USERS)
        ) || [];
    } catch (error) {
        console.error("Error leyendo usuarios:", error);
        usuarios = [];
    }

    const existePropietario = usuarios.some(
        usuario => usuario.rol === "Propietario"
    );

    if (!existePropietario) {
        usuarios.push({
            id: "OWNER_" + Date.now(),
            nombre: "Propietario del Sistema",
            usuario: "owner",
            password: "owner123",
            rol: "Propietario",
            activo: true,
            protegido: true,
            fechaRegistro: obtenerFechaActual()
        });
    }

    const existeAdmin = usuarios.some(
        usuario => usuario.usuario === "admin"
    );

    if (!existeAdmin) {
        usuarios.push({
            id: generarId(),
            nombre: "Administrador",
            usuario: "admin",
            password: "admin123",
            rol: "Administrador",
            activo: true,
            fechaRegistro: obtenerFechaActual()
        });
    }

    guardarUsuarios(usuarios);
}


/* =====================================================
   ID
===================================================== */

function generarId() {

    return Date.now().toString() +
           Math.random()
               .toString(36)
               .substring(2,8);

}


/* =====================================================
   FECHA
===================================================== */

function obtenerFechaActual() {

    const fecha = new Date();

    const dia =
        String(fecha.getDate())
            .padStart(2,"0");

    const mes =
        String(fecha.getMonth() + 1)
            .padStart(2,"0");

    const año =
        fecha.getFullYear();

    return `${dia}/${mes}/${año}`;

}


/* =====================================================
   OBTENER USUARIOS
===================================================== */

function obtenerUsuarios() {

    return JSON.parse(
        localStorage.getItem(STORAGE_USERS)
    ) || [];

}


/* =====================================================
   GUARDAR USUARIOS
===================================================== */

function guardarUsuarios(usuarios) {

    localStorage.setItem(
        STORAGE_USERS,
        JSON.stringify(usuarios)
    );

}


/* =====================================================
   MOSTRAR LOGIN
===================================================== */

function mostrarLogin() {

    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("registerScreen").classList.add("hidden");
    document.getElementById("appScreen").classList.add("hidden");
    document.getElementById("recoveryScreen").classList.add("hidden");

}


/* =====================================================
   MOSTRAR REGISTRO
===================================================== */

function mostrarRegistro() {

    const sesion = obtenerSesionActual();

    // Crear usuarios es una función exclusiva del Propietario.
    if (!sesion || sesion.rol !== "Propietario") {
        if (typeof mostrarToast === "function") {
            mostrarToast(
                "Acceso restringido",
                "Solo el Propietario puede crear usuarios.",
                "warning"
            );
        } else {
            alert("Solo el Propietario puede crear usuarios.");
        }
        return;
    }

    document.getElementById("loginScreen")?.classList.add("hidden");
    document.getElementById("registerScreen")?.classList.remove("hidden");
    document.getElementById("appScreen")?.classList.add("hidden");
    document.getElementById("recoveryScreen")?.classList.add("hidden");

    document.getElementById("registerForm")?.reset();
    const error = document.getElementById("registerError");
    if (error) error.textContent = "";
}

function volverDesdeRegistro() {

    const sesion = obtenerSesionActual();

    if (!sesion || sesion.rol !== "Propietario") {
        mostrarLogin();
        return;
    }

    mostrarAplicacion(sesion);

    setTimeout(function () {
        mostrarModulo("usuarios");
    }, 80);
}

/* =====================================================
   MOSTRAR APP
===================================================== */

function mostrarAplicacion(usuario) {

    if (!usuario) {
        console.error("No se recibió el usuario para iniciar la aplicación.");
        mostrarLogin();
        return;
    }

    document.getElementById("loginScreen")?.classList.add("hidden");
    document.getElementById("registerScreen")?.classList.add("hidden");
    document.getElementById("recoveryScreen")?.classList.add("hidden");
    document.getElementById("appScreen")?.classList.remove("hidden");

    configurarUsuario(usuario);

    const usuariosMenu = document.getElementById("usuariosMenu");
    if (usuariosMenu) {
        const puedeVerUsuarios =
            usuario.rol === "Propietario";

        usuariosMenu.classList.toggle("hidden", !puedeVerUsuarios);
        usuariosMenu.style.display = puedeVerUsuarios ? "flex" : "none";
    }

    setTimeout(function() {
        mostrarModulo("dashboard");

        if (typeof cargarDashboard === "function") cargarDashboard();
        if (typeof cargarNotificaciones === "function") cargarNotificaciones();
        if (typeof cargarDatosPerfilMenu === "function") cargarDatosPerfilMenu();
    }, 50);
}


/* =====================================================
   CONFIGURAR USUARIO ACTUAL
===================================================== */

function configurarUsuario(usuario) {

    const nombre =
        usuario.nombre || usuario.usuario;


    const iniciales =
        obtenerIniciales(nombre);


    document
        .getElementById("currentUserName")
        .textContent = nombre;


    document
        .getElementById("currentUserRole")
        .textContent = usuario.rol;


    document
        .getElementById("userAvatar")
        .textContent = usuario.rol;


    document
        .getElementById("welcomeUser")
        .textContent = nombre;

}


/* =====================================================
   INICIALES
===================================================== */

function obtenerIniciales(nombre) {

    const partes =
        nombre
            .trim()
            .split(/\s+/);


    if (partes.length === 1) {

        return partes[0]
            .substring(0,2)
            .toUpperCase();

    }


    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}


/* =====================================================
   LOGIN
===================================================== */

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const usuario =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const error =
                document
                    .getElementById("loginError");


            error.textContent = "";


            const usuarios =
                obtenerUsuarios();


            const usuarioEncontrado =
                usuarios.find(
                    u =>
                        u.usuario.toLowerCase() ===
                        usuario.toLowerCase()
                );


            if (!usuarioEncontrado) {

                error.textContent =
                    "El usuario no existe.";

                return;

            }


            if (
                usuarioEncontrado.password !==
                password
            ) {

                error.textContent =
                    "La contraseña es incorrecta.";

                return;

            }


            if (
                usuarioEncontrado.activo === false
            ) {

                error.textContent =
                    "Este usuario está desactivado.";

                return;

            }

            sessionStorage.removeItem(
                "sesionCerrada"
            );


            /* GUARDAR SESIÓN */

            localStorage.setItem(
                STORAGE_SESSION,
                JSON.stringify(
                    usuarioEncontrado
                )
            );


            mostrarAplicacion(
                usuarioEncontrado
            );

        }
    );


/* =====================================================
   REGISTRO
===================================================== */

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const sesion = obtenerSesionActual();

            if (!sesion || sesion.rol !== "Propietario") {
                const error = document.getElementById("registerError");
                if (error) {
                    error.textContent = "Solo el Propietario puede crear usuarios.";
                }
                return;
            }


            const nombre =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const usuario =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmar =
                document
                    .getElementById("registerPasswordConfirm")
                    .value;


            const error =
                document
                    .getElementById("registerError");


            error.textContent = "";


            if (nombre.length < 3) {

                error.textContent =
                    "Ingresa un nombre válido.";

                return;

            }


            if (usuario.length < 4) {

                error.textContent =
                    "El usuario debe tener al menos 4 caracteres.";

                return;

            }


            if (password.length < 6) {

                error.textContent =
                    "La contraseña debe tener al menos 6 caracteres.";

                return;

            }


            if (password !== confirmar) {

                error.textContent =
                    "Las contraseñas no coinciden.";

                return;

            }


            const usuarios =
                obtenerUsuarios();


            const existe =
                usuarios.some(
                    u =>
                        u.usuario.toLowerCase() ===
                        usuario.toLowerCase()
                );


            if (existe) {

                error.textContent =
                    "Ese usuario ya está registrado.";

                return;

            }


            const nuevoUsuario = {

                id: generarId(),

                nombre: nombre,

                usuario: usuario,

                password: password,

                rol: "Usuario",

                activo: true,

                fechaRegistro:
                    obtenerFechaActual()

            };


            usuarios.push(
                nuevoUsuario
            );


            guardarUsuarios(
                usuarios
            );


            alert(
                "Usuario registrado correctamente."
            );


            // Mantener la sesión del Propietario y volver al módulo Usuarios.
            volverDesdeRegistro();

            setTimeout(function () {
                if (typeof cargarUsuarios === "function") {
                    cargarUsuarios();
                }
            }, 100);

        }
    );


/* =====================================================
   MOSTRAR / OCULTAR PASSWORD
===================================================== */

function mostrarPassword() {

    const input =
        document.getElementById(
            "loginPassword"
        );


    const icon =
        document.getElementById(
            "passwordIcon"
        );


    if (input.type === "password") {

        input.type = "text";

        icon.className =
            "fa-solid fa-eye-slash";

    } else {

        input.type = "password";

        icon.className =
            "fa-solid fa-eye";

    }

}


/* =====================================================
   CERRAR SESIÓN
===================================================== */

function cerrarSesion() {

    // Detener temporizador de inactividad
    if (
        typeof temporizadorInactividad !== "undefined" &&
        temporizadorInactividad
    ) {
        clearTimeout(
            temporizadorInactividad
        );

        temporizadorInactividad = null;
    }


    // ==========================================
    // ELIMINAR SESIÓN
    // ==========================================

    localStorage.removeItem(
        STORAGE_SESSION
    );


    // También eliminamos cualquier sesión temporal
    sessionStorage.removeItem(
        STORAGE_SESSION
    );


    // Marcar explícitamente que cerró sesión
    sessionStorage.setItem(
        "sesionCerrada",
        "true"
    );


    // ==========================================
    // VOLVER AL LOGIN
    // ==========================================

    window.location.reload();

}

/* =====================================================
   SESIÓN ACTUAL
===================================================== */

function obtenerSesionActual() {

    const sesionGuardada =
        localStorage.getItem(
            STORAGE_SESSION
        );


    if (!sesionGuardada) {
        return null;
    }


    try {

        return JSON.parse(
            sesionGuardada
        );

    }

    catch (error) {

        localStorage.removeItem(
            STORAGE_SESSION
        );

        return null;

    } 

}


/* =====================================================
   PROTEGER MÓDULO DE USUARIOS
===================================================== */

function puedeAdministrarUsuarios() {

    const usuario =
        obtenerSesionActual();


    return (
        usuario &&
        usuario.rol === "Propietario"
    );

}


/* =====================================================
   MOSTRAR MÓDULO
===================================================== */

function mostrarModulo(
    nombreModulo,
    boton = null
) {

    setTimeout(
        function() {

            inicializarOrdenamientoTablas();

        },
        50
    );


    /* SEGURIDAD */

    if (
    nombreModulo === "usuarios" &&
    !puedeVerUsuarios()
) {

    mostrarToast(
        "Acceso restringido",
        "No tienes permisos para administrar usuarios.",
        "warning"
    );

    return;

}

    if (nombreModulo === "equipos") {

        cargarEquipos();

    }

    if (nombreModulo === "entregas") {

            cargarEntregas();

    }

    if (nombreModulo === "devoluciones") {

            cargarDevoluciones();

    }

    if (nombreModulo === "inventario") {

            cargarInventario();

    }

    if (nombreModulo === "dashboard") {

            cargarDashboard();

    }

    if (nombreModulo === "reportes") {

            cargarReportes();

    }

    if (nombreModulo === "configuracion") {

            cargarConfiguracion();

    }
    


    const modulos =
        document.querySelectorAll(
            ".module"
        );


    modulos.forEach(
        modulo => {

            modulo.classList.remove(
                "active-module"
            );

        }
    );


    const moduloSeleccionado =
        document.getElementById(
            nombreModulo
        );


    if (moduloSeleccionado) {

        moduloSeleccionado.classList.add(
            "active-module"
        );

    }


    const botonesMenu =
        document.querySelectorAll(
            ".menu-item"
        );


    botonesMenu.forEach(
        item => {

            item.classList.remove(
                "active"
            );

        }
    );


    if (boton) {

        boton.classList.add(
            "active"
        );

    } else {

        const botonEncontrado =
            document.querySelector(
                `.menu-item[onclick*="'${nombreModulo}'"]`
            );


        if (botonEncontrado) {

            botonEncontrado.classList.add(
                "active"
            );

        }

    }


    const nombres = {

        dashboard:
            "Dashboard",

        equipos:
            "Equipos",

        entregas:
            "Entrega de equipos",

        devoluciones:
            "Devoluciones",

        inventario:
            "Inventario",

        reportes:
            "Reportes",

        usuarios:
            "Usuarios",

        configuracion:
            "Configuración"

    };


    const titulo =
        nombres[nombreModulo] ||
        "Dashboard";





    document
        .getElementById("breadcrumbText")
        .textContent =
            titulo.toUpperCase();


    if (
        nombreModulo === "usuarios"
    ) {

        cargarUsuarios();

    }


    if (
        window.innerWidth <= 768
    ) {

        document
            .getElementById("sidebar")
            .classList.remove(
                "sidebar-open"
            );

    }

}


/* =====================================================
   CARGAR USUARIOS
===================================================== */

function cargarUsuarios() {

    const tbody =
        document.getElementById(
            "usersTable"
        );


    if (!tbody) {
        return;
    }


    const sesion =
        obtenerSesionActual();


    if (!sesion) {
        return;
    }


    let usuarios =
        obtenerUsuarios();


    // ======================================
    // ADMIN NO PUEDE VER PROPIETARIO
    // ======================================

    if (
        sesion.rol ===
        "Administrador"
    ) {

        usuarios =
            usuarios.filter(
                usuario =>
                    usuario.rol !==
                    "Propietario"
            );

    }


    // ======================================
    // PROPIETARIO PUEDE VER TODO MENOS
    // SU PROPIA CUENTA EN LA TABLA
    // ======================================

    if (
        sesion.rol ===
        "Propietario"
    ) {

        usuarios =
            usuarios.filter(
                usuario =>
                    usuario.id !==
                    sesion.id
            );

    }


    tbody.innerHTML = "";


    if (
        usuarios.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:35px;
                        color:#64748b;
                    "
                >
                    No hay usuarios registrados.
                </td>

            </tr>

        `;

        return;

    }


    usuarios.forEach(
        usuario => {

            const fila =
                document.createElement(
                    "tr"
                );


            const estadoTexto =
                usuario.activo
                    ? "Activo"
                    : "Inactivo";


            let acciones = "";


            // ==================================
            // PROPIETARIO
            // ==================================

            if (
                sesion.rol ===
                "Propietario"
            ) {

                acciones = `

                    <button
                        type="button"
                        class="equipment-action-btn"
                        title="${
                            usuario.activo
                                ? "Desactivar"
                                : "Activar"
                        }"
                        onclick="
                            cambiarEstadoUsuarioPropietario(
                                '${usuario.id}'
                            )
                        "
                    >

                        <i
                            class="
                                fa-solid
                                ${
                                    usuario.activo
                                        ? "fa-user-slash"
                                        : "fa-user-check"
                                }
                            "
                        ></i>

                    </button>


                    <button
                        type="button"
                        class="equipment-action-btn"
                        title="Cambiar rol"
                        onclick="
                            abrirCambioRolUsuario(
                                '${usuario.id}'
                            )
                        "
                    >

                        <i class="fa-solid fa-user-shield"></i>

                    </button>


                    <button
                        type="button"
                        class="equipment-action-btn delete"
                        title="Eliminar usuario"
                        onclick="
                            eliminarUsuarioPropietario(
                                '${usuario.id}'
                            )
                        "
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                `;

            }


            // ==================================
            // ADMINISTRADOR
            // ==================================

            else if (
                sesion.rol ===
                "Administrador"
            ) {

                /*
                    El administrador únicamente
                    puede activar/desactivar
                    usuarios normales.
                */

                if (
                    usuario.rol ===
                    "Usuario"
                ) {

                    acciones = `

                        <button
                            type="button"
                            class="equipment-action-btn"
                            title="${
                                usuario.activo
                                    ? "Desactivar"
                                    : "Activar"
                            }"
                            onclick="
                                cambiarEstadoUsuarioAdmin(
                                    '${usuario.id}'
                                )
                            "
                        >

                            <i
                                class="
                                    fa-solid
                                    ${
                                        usuario.activo
                                            ? "fa-user-slash"
                                            : "fa-user-check"
                                    }
                                "
                            ></i>

                        </button>

                    `;

                }

                else {

                    acciones = `

                        <span
                            style="
                                color:#64748b;
                                font-size:9px;
                            "
                        >
                            Sin permisos
                        </span>

                    `;

                }

            }


            fila.innerHTML = `

                <td>
                    ${escapeHTML(
                        usuario.nombre ||
                        "-"
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        usuario.usuario ||
                        "-"
                    )}
                </td>


                <td>

                    <span class="user-role-badge">

                        ${escapeHTML(
                            usuario.rol ||
                            "Usuario"
                        )}

                    </span>

                </td>


                <td>

                    <span
                        class="
                            status-equipment
                            ${
                                usuario.activo
                                    ? "disponible"
                                    : "baja"
                            }
                        "
                    >

                        ${estadoTexto}

                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        usuario.fechaRegistro ||
                        "-"
                    )}
                </td>


                <td>

                    <div class="equipment-actions">

                        ${acciones}

                    </div>

                </td>

            `;


            tbody.appendChild(
                fila
            );

        }
    );

}

/* =====================================================
   CAMBIAR ESTADO
===================================================== */

function cambiarEstadoUsuario(id) {

    if (!puedeAdministrarUsuarios()) {

        alert(
            "No tienes permisos."
        );

        return;

    }


    const usuarios =
        obtenerUsuarios();


    const usuario =
        usuarios.find(
            u => u.id === id
        );


    if (!usuario) {
        return;
    }


    /* NO PERMITIR DESACTIVAR ADMIN */

    if (
        usuario.rol ===
        "Administrador"
    ) {

        alert(
            "El administrador principal no puede ser desactivado."
        );

        return;

    }


    usuario.activo =
        !usuario.activo;


    guardarUsuarios(
        usuarios
    );


    cargarUsuarios();

}


/* =====================================================
   ELIMINAR USUARIO
===================================================== */

function eliminarUsuario(id) {

    if (!puedeAdministrarUsuarios()) {

        alert(
            "No tienes permisos."
        );

        return;

    }


    const usuarios =
        obtenerUsuarios();


    const usuario =
        usuarios.find(
            u => u.id === id
        );


    if (!usuario) {
        return;
    }


    if (
        usuario.rol ===
        "Administrador"
    ) {

        alert(
            "El administrador principal no puede ser eliminado."
        );

        return;

    }


    const confirmar =
        confirm(
            `¿Eliminar al usuario "${usuario.nombre}"?`
        );


    if (!confirmar) {
        return;
    }


    const nuevosUsuarios =
        usuarios.filter(
            u => u.id !== id
        );


    guardarUsuarios(
        nuevosUsuarios
    );


    cargarUsuarios();

}


/* =====================================================
   SEGURIDAD HTML
===================================================== */

function escapeHTML(texto) {

    return String(texto)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =====================================================
   SIDEBAR MOBILE
===================================================== */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle(
            "sidebar-open"
        );

}


/* =====================================================
   CERRAR SIDEBAR
===================================================== */

document.addEventListener(
    "click",
    function(event) {

        if (
            window.innerWidth > 768
        ) {
            return;
        }


        const sidebar =
            document.getElementById(
                "sidebar"
            );


        const menuButton =
            document.querySelector(
                ".mobile-menu"
            );


        if (
            !sidebar.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {

            sidebar.classList.remove(
                "sidebar-open"
            );

        }

    }
);


/* =====================================================
   BUSCAR EQUIPO
===================================================== */

function buscarEquipo() {

    const input =
        document.getElementById(
            "searchEquipment"
        );


    const texto =
        input.value
            .toLowerCase()
            .trim();


    const filas =
        document.querySelectorAll(
            "#equipmentTable tr"
        );


    filas.forEach(
        fila => {

            const contenido =
                fila.textContent
                    .toLowerCase();


            if (
                contenido.includes(texto)
            ) {

                fila.style.display = "";

            } else {

                fila.style.display =
                    "none";

            }

        }
    );

}


/* =====================================================
   LIMPIAR REGISTRO
===================================================== */

function limpiarFormularioRegistro() {

    const form =
        document.getElementById(
            "registerForm"
        );


    if (form) {

        form.reset();

    }


    const error =
        document.getElementById(
            "registerError"
        );


    if (error) {

        error.textContent = "";

    }

}


/* =====================================================
   VERIFICAR SESIÓN AL CARGAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                inicializarOrdenamientoTablas();

            },
            200
        );


        inicializarUsuarios();
        cargarEquipos();

         const sesionCerrada =
            sessionStorage.getItem(
                "sesionCerrada"
            );


        const sesion =
            obtenerSesionActual();


        // ==========================================
        // CERRÓ SESIÓN MANUALMENTE
        // ==========================================

        if (
            sesionCerrada === "true"
        ) {

            localStorage.removeItem(
                STORAGE_SESSION
            );

            mostrarLogin();

            return;
        }


        // ==========================================
        // SESIÓN EXISTENTE
        // ==========================================

        if (
            sesion &&
            sesion.activo !== false
        ) {

            mostrarAplicacion(
                sesion
            );


            reiniciarTemporizadorInactividad();

        }

        else {

            localStorage.removeItem(
                STORAGE_SESSION
            );

            mostrarLogin();

        }

    }
);

// ==========================================
// ORDENAMIENTO GENERAL DE TABLAS
// ==========================================

function inicializarOrdenamientoTablas() {

    const tablas =
        document.querySelectorAll(
            ".equipment-table"
        );


    tablas.forEach(
        tabla => {

            inicializarOrdenamientoTabla(
                tabla
            );

        }
    );

}

function inicializarOrdenamientoTabla(
    tabla
) {

    if (!tabla) {
        return;
    }


    const encabezados =
        tabla.querySelectorAll(
            "thead th"
        );


    encabezados.forEach(
        (
            th,
            indice
        ) => {

            /*
                Evitar instalar eventos
                dos veces.
            */

            if (
                th.dataset.sortReady ===
                "true"
            ) {

                return;

            }


            const texto =
                th.textContent
                    .trim()
                    .toLowerCase();


            /*
                No ordenar columnas
                de acciones, firma, etc.
            */

            if (
                texto === "acciones" ||
                texto === "acción" ||
                texto === "firma" ||
                texto === ""
            ) {

                th.classList.add(
                    "no-sort"
                );

                return;

            }


            th.dataset.sortReady =
                "true";


            th.classList.add(
                "sortable-column"
            );


            // Crear flechas

            const icono =
                document.createElement(
                    "span"
                );


            icono.className =
                "table-sort-icon";


            icono.innerHTML = `

                <span class="sort-up">
                    ▲
                </span>

                <span class="sort-down">
                    ▼
                </span>

            `;


            th.appendChild(
                icono
            );


            // Evento

            th.addEventListener(
                "click",
                function() {

                    ordenarTablaPorColumna(
                        tabla,
                        indice,
                        th
                    );

                }
            );

        }
    );

}

function ordenarTablaPorColumna(
    tabla,
    indiceColumna,
    encabezado,
    direccionForzada = null
) {

    const tbody =
        tabla.querySelector(
            "tbody"
        );


    if (!tbody) {
        return;
    }


    const filas =
        Array.from(
            tbody.querySelectorAll(
                "tr"
            )
        );


    const filasValidas =
        filas.filter(
            fila =>
                fila.children.length > 1
        );


    if (
        filasValidas.length <= 1
    ) {

        return;
    }


    let esAscendente;


    if (
        direccionForzada
    ) {

        esAscendente =
            direccionForzada ===
            "asc";

    }

    else {

        esAscendente =
            !encabezado
                .classList
                .contains(
                    "sort-asc"
                );

    }


    tabla
        .querySelectorAll(
            "thead th"
        )
        .forEach(
            th => {

                th.classList.remove(
                    "sort-asc",
                    "sort-desc"
                );

            }
        );


    if (esAscendente) {

        encabezado.classList.add(
            "sort-asc"
        );

    }

    else {

        encabezado.classList.add(
            "sort-desc"
        );

    }


    filasValidas.sort(
        (
            filaA,
            filaB
        ) => {

            const celdaA =
                filaA.children[
                    indiceColumna
                ];


            const celdaB =
                filaB.children[
                    indiceColumna
                ];


            if (
                !celdaA ||
                !celdaB
            ) {

                return 0;

            }


            const valorA =
                obtenerValorOrdenTabla(
                    celdaA
                );


            const valorB =
                obtenerValorOrdenTabla(
                    celdaB
                );


            const resultado =
                compararValoresTabla(
                    valorA,
                    valorB
                );


            return esAscendente
                ? resultado
                : -resultado;

        }
    );


    filasValidas.forEach(
        fila => {

            tbody.appendChild(
                fila
            );

        }
    );


    /*
        GUARDAR EL ORDEN
    */

    if (
        tabla.id &&
        !direccionForzada
    ) {

        guardarOrdenTabla(
            tabla.id,
            indiceColumna,
            esAscendente
                ? "asc"
                : "desc"
        );

    }

}

function obtenerValorOrdenTabla(
    celda
) {

    if (!celda) {
        return "";
    }


    /*
        Si en el futuro quieres especificar
        manualmente un valor:
        
        <td data-sort-value="10">
    */

    if (
        celda.dataset.sortValue !==
        undefined
    ) {

        return celda.dataset.sortValue;

    }


    return celda
        .textContent
        .trim();

}

function compararValoresTabla(
    valorA,
    valorB
) {

    const a =
        String(
            valorA ?? ""
        )
        .trim();


    const b =
        String(
            valorB ?? ""
        )
        .trim();


    // ======================================
    // NÚMEROS
    // ======================================

    const numeroA =
        convertirNumeroTabla(a);


    const numeroB =
        convertirNumeroTabla(b);


    if (
        numeroA !== null &&
        numeroB !== null
    ) {

        return numeroA - numeroB;

    }


    // ======================================
    // FECHAS DD/MM/YYYY
    // ======================================

    const fechaA =
        convertirFechaTabla(a);


    const fechaB =
        convertirFechaTabla(b);


    if (
        fechaA !== null &&
        fechaB !== null
    ) {

        return fechaA - fechaB;

    }


    // ======================================
    // TEXTO
    // ======================================

    return a.localeCompare(
        b,
        "es",
        {
            numeric: true,
            sensitivity: "base"
        }
    );

}

function convertirNumeroTabla(
    valor
) {

    /*
        Números normales:
        1
        20
        150.50
    */

    const limpio =
        valor
            .replace(/\s/g, "")
            .replace(/,/g, "");


    if (
        limpio !== "" &&
        /^-?\d+(\.\d+)?$/.test(
            limpio
        )
    ) {

        return Number(
            limpio
        );

    }


    /*
        Códigos como:
        EQ000001
        NE000023
        ND000015

        Extraemos la parte numérica.
    */

    const codigo =
        limpio.match(
            /^[A-Za-z]+0*(\d+)$/
        );


    if (codigo) {

        return Number(
            codigo[1]
        );

    }


    return null;

}

function convertirFechaTabla(
    valor
) {

    const coincidencia =
        valor.match(
            /^(\d{2})\/(\d{2})\/(\d{4})$/
        );


    if (!coincidencia) {

        return null;

    }


    const dia =
        Number(
            coincidencia[1]
        );


    const mes =
        Number(
            coincidencia[2]
        );


    const anio =
        Number(
            coincidencia[3]
        );


    return new Date(
        anio,
        mes - 1,
        dia
    ).getTime();

}

function obtenerOrdenTablasGuardado() {

    try {

        return JSON.parse(
            localStorage.getItem(
                STORAGE_ORDEN_TABLAS
            )
        ) || {};

    }

    catch (error) {

        return {};

    }

}


function guardarOrdenTabla(
    idTabla,
    columna,
    direccion
) {

    const ordenes =
        obtenerOrdenTablasGuardado();


    ordenes[idTabla] = {
        columna,
        direccion
    };


    localStorage.setItem(
        STORAGE_ORDEN_TABLAS,
        JSON.stringify(
            ordenes
        )
    );

}

// ==========================================
// CIERRE AUTOMÁTICO POR INACTIVIDAD
// ==========================================

const TIEMPO_INACTIVIDAD = 5 * 60 * 1000;
// 5 minutos

let temporizadorInactividad = null;


// ==========================================
// REINICIAR TEMPORIZADOR
// ==========================================

function reiniciarTemporizadorInactividad() {

    /*
        Solo controlar inactividad
        cuando existe una sesión.
    */

    const sesion =
        obtenerSesionActual();

    if (!sesion) {
        return;
    }


    clearTimeout(
        temporizadorInactividad
    );


    temporizadorInactividad =
        setTimeout(
            cerrarSesionPorInactividad,
            TIEMPO_INACTIVIDAD
        );

}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesionPorInactividad() {

    if (
        temporizadorInactividad
    ) {

        clearTimeout(
            temporizadorInactividad
        );

        temporizadorInactividad = null;

    }


    // Eliminar sesión
    localStorage.removeItem(
        STORAGE_SESSION
    );


    // Marcar que la sesión terminó
    sessionStorage.setItem(
        "sesionCerrada",
        "true"
    );


    // Mostrar mensaje después
    sessionStorage.setItem(
        "mensajeCierreSesion",
        "inactividad"
    );


    window.location.reload();

}

// ==========================================
// EVENTOS QUE CUENTAN COMO ACTIVIDAD
// ==========================================

const eventosActividad = [
    "mousedown",
    "keydown",
    "touchstart",
    "scroll"
];


eventosActividad.forEach(
    evento => {

        document.addEventListener(
            evento,
            reiniciarTemporizadorInactividad,
            {
                passive: true
            }
        );

    }
);

function esPropietario() {

    const sesion =
        obtenerSesionActual();


    return (
        sesion &&
        sesion.rol ===
        "Propietario"
    );

}


function esAdministrador() {

    const sesion =
        obtenerSesionActual();


    return (
        sesion &&
        sesion.rol ===
        "Administrador"
    );

}


function puedeVerUsuarios() {

    return esPropietario();

}

function cambiarEstadoUsuarioAdmin(
    idUsuario
) {

    const sesion =
        obtenerSesionActual();


    if (
        !sesion ||
        sesion.rol !==
        "Administrador"
    ) {

        return;

    }


    const usuarios =
        obtenerUsuarios();


    const indice =
        usuarios.findIndex(
            usuario =>
                usuario.id ===
                idUsuario
        );


    if (
        indice === -1
    ) {
        return;
    }


    const usuario =
        usuarios[indice];


    // ======================================
    // ADMIN SOLO PUEDE TOCAR USUARIOS
    // ======================================

    if (
        usuario.rol !==
        "Usuario"
    ) {

        mostrarToast(
            "Acción no permitida",
            "El administrador solo puede activar o desactivar usuarios.",
            "warning"
        );

        return;

    }


    usuario.activo =
        !usuario.activo;


    guardarUsuarios(
        usuarios
    );


    cargarUsuarios();


    mostrarToast(
        usuario.activo
            ? "Usuario activado"
            : "Usuario desactivado",

        usuario.nombre,

        usuario.activo
            ? "success"
            : "warning"
    );

}

function cambiarEstadoUsuarioPropietario(
    idUsuario
) {

    if (!esPropietario()) {
        return;
    }


    const usuarios =
        obtenerUsuarios();


    const indice =
        usuarios.findIndex(
            usuario =>
                usuario.id ===
                idUsuario
        );


    if (
        indice === -1
    ) {
        return;
    }


    if (
        usuarios[indice].rol ===
        "Propietario"
    ) {

        mostrarToast(
            "Cuenta protegida",
            "La cuenta del propietario no puede desactivarse.",
            "warning"
        );

        return;

    }


    usuarios[indice].activo =
        !usuarios[indice].activo;


    guardarUsuarios(
        usuarios
    );


    cargarUsuarios();


    mostrarToast(
        usuarios[indice].activo
            ? "Usuario activado"
            : "Usuario desactivado",

        usuarios[indice].nombre,

        usuarios[indice].activo
            ? "success"
            : "warning"
    );

}

function eliminarUsuarioPropietario(
    idUsuario
) {

    if (!esPropietario()) {

        mostrarToast(
            "Acceso restringido",
            "Solo el propietario puede eliminar cuentas.",
            "warning"
        );

        return;

    }


    const usuarios =
        obtenerUsuarios();


    const usuario =
        usuarios.find(
            item =>
                item.id ===
                idUsuario
        );


    if (!usuario) {
        return;
    }


    if (
        usuario.rol ===
        "Propietario"
    ) {

        mostrarToast(
            "Cuenta protegida",
            "La cuenta del propietario no puede eliminarse.",
            "warning"
        );

        return;

    }


    const confirmar =
        confirm(

            "¿Deseas eliminar permanentemente a " +
            usuario.nombre +
            "?"

        );


    if (!confirmar) {
        return;
    }


    const nuevosUsuarios =
        usuarios.filter(
            item =>
                item.id !==
                idUsuario
        );


    guardarUsuarios(
        nuevosUsuarios
    );


    cargarUsuarios();


    mostrarToast(
        "Usuario eliminado",
        `${usuario.nombre} fue eliminado del sistema.`,
        "success"
    );

}

let usuarioCambioRolId = null;


function abrirCambioRolUsuario(
    idUsuario
) {

    if (!esPropietario()) {
        return;
    }


    const usuario =
        obtenerUsuarios()
            .find(
                item =>
                    item.id ===
                    idUsuario
            );


    if (!usuario) {
        return;
    }


    if (
        usuario.rol ===
        "Propietario"
    ) {

        return;

    }


    usuarioCambioRolId =
        usuario.id;


    actualizarTextoSeguro(
        "cambioRolNombre",
        usuario.nombre
    );


    const select =
        document.getElementById(
            "nuevoRolUsuario"
        );


    if (select) {

        const rolesPermitidos = [
            "Administrador",
            "Jefe de Almacén",
            "Almacenero",
            "Usuario"
        ];

        select.value =
            rolesPermitidos.includes(usuario.rol)
                ? usuario.rol
                : "Usuario";

    }


    document
        .getElementById(
            "modalCambiarRolUsuario"
        )
        ?.classList
        .remove(
            "hidden"
        );

}


function cerrarCambioRolUsuario() {

    usuarioCambioRolId =
        null;


    document
        .getElementById(
            "modalCambiarRolUsuario"
        )
        ?.classList
        .add(
            "hidden"
        );

}


function guardarCambioRolUsuario() {

    if (!esPropietario()) {
        return;
    }


    const select =
        document.getElementById(
            "nuevoRolUsuario"
        );


    if (
        !select ||
        !usuarioCambioRolId
    ) {

        return;

    }


    const usuarios =
        obtenerUsuarios();


    const indice =
        usuarios.findIndex(
            usuario =>
                usuario.id ===
                usuarioCambioRolId
        );


    if (
        indice === -1
    ) {
        return;
    }


    if (
        usuarios[indice].rol ===
        "Propietario"
    ) {

        return;

    }


    const rolesPermitidos = [
        "Administrador",
        "Jefe de Almacén",
        "Almacenero",
        "Usuario"
    ];

    if (!rolesPermitidos.includes(select.value)) {
        alert("El rol seleccionado no es válido.");
        return;
    }

    usuarios[indice].rol =
        select.value;


    guardarUsuarios(
        usuarios
    );


    const nombre =
        usuarios[indice].nombre;


    const rol =
        usuarios[indice].rol;


    cerrarCambioRolUsuario();

    cargarUsuarios();


    mostrarToast(
        "Rol actualizado",
        `${nombre} ahora es ${rol}.`,
        "success"
    );

}

localStorage.removeItem("controlEquiposLista");

localStorage.removeItem("controlEquiposEntregas");

localStorage.removeItem("controlEquiposDevoluciones");

localStorage.removeItem("controlEquiposTrabajadores");

localStorage.removeItem("controlEquiposUltimaCarga");