// ==========================================
// MI PERFIL
// ==========================================

function abrirMiPerfil() {

    console.log("Abriendo Mi Perfil...");

    // Cerrar menú del avatar
    if (typeof cerrarMenuPerfil === "function") {
        cerrarMenuPerfil();
    }


    // Cargar información
    cargarDatosMiPerfil();


    // Buscar modal
    const modal =
        document.getElementById(
            "modalMiPerfil"
        );


    if (!modal) {

        console.error(
            "No existe #modalMiPerfil en index.html"
        );

        alert(
            "No se encontró la ventana de Mi Perfil."
        );

        return;
    }


    modal.classList.remove(
        "hidden"
    );
}




/* ==========================================
   CARGAR DATOS
========================================== */

function cargarDatosMiPerfil() {

    const sesion =
        obtenerSesionActual();


    if (!sesion) {

        console.error(
            "No existe una sesión activa."
        );

        return;
    }


    const nombre =
        sesion.nombre ||
        sesion.usuario ||
        "Usuario";


    const usuario =
        sesion.usuario ||
        "-";


    const rol =
        sesion.rol ||
        "Usuario";


    // ======================================
    // AVATAR
    // ======================================

    const avatar =
        document.getElementById(
            "miPerfilAvatar"
        );


    if (avatar) {

        if (
            typeof obtenerInicialesPerfil ===
            "function"
        ) {

            avatar.textContent =
                obtenerInicialesPerfil(
                    nombre
                );

        }

        else {

            avatar.textContent =
                nombre
                    .substring(0, 2)
                    .toUpperCase();

        }

    }


    // ======================================
    // NOMBRE SUPERIOR
    // ======================================

    const nombreVista =
        document.getElementById(
            "miPerfilNombreVista"
        );


    if (nombreVista) {

        nombreVista.textContent =
            nombre;

    }


    // ======================================
    // ROL SUPERIOR
    // ======================================

    const rolVista =
        document.getElementById(
            "miPerfilRolVista"
        );


    if (rolVista) {

        rolVista.textContent =
            rol;

    }


    // ======================================
    // FORMULARIO
    // ======================================

    const inputNombre =
        document.getElementById(
            "miPerfilNombre"
        );


    const inputUsuario =
        document.getElementById(
            "miPerfilUsuario"
        );


    const inputRol =
        document.getElementById(
            "miPerfilRol"
        );


    const inputEstado =
        document.getElementById(
            "miPerfilEstado"
        );


    const inputFecha =
        document.getElementById(
            "miPerfilFechaRegistro"
        );


    if (inputNombre) {

        inputNombre.value =
            nombre;

    }


    if (inputUsuario) {

        inputUsuario.value =
            usuario;

    }


    if (inputRol) {

        inputRol.value =
            rol;

    }


    if (inputEstado) {

        inputEstado.value =
            sesion.activo === false
                ? "INACTIVO"
                : "ACTIVO";

    }


    if (inputFecha) {

        inputFecha.value =
            sesion.fechaRegistro ||
            "Sin información";

    }


    // Limpiar contraseñas

    const password =
        document.getElementById(
            "miPerfilPassword"
        );


    const confirmarPassword =
        document.getElementById(
            "miPerfilPasswordConfirm"
        );


    if (password) {
        password.value = "";
    }


    if (confirmarPassword) {
        confirmarPassword.value = "";
    }
}

function guardarCambiosMiPerfil() {

    const sesion =
        obtenerSesionActual();


    if (!sesion) {

        mostrarMensajeMiPerfil(
            "No existe una sesión activa.",
            "error"
        );

        return;

    }


    const nombre =
        document
            .getElementById(
                "miPerfilNombre"
            )
            .value
            .trim();


    const nuevoUsuario =
        document
            .getElementById(
                "miPerfilUsuario"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "miPerfilPassword"
            )
            .value;


    const passwordConfirm =
        document
            .getElementById(
                "miPerfilPasswordConfirm"
            )
            .value;


    /* VALIDACIONES */

    if (
        nombre.length < 3
    ) {

        mostrarMensajeMiPerfil(
            "Ingresa un nombre válido.",
            "error"
        );

        return;

    }


    if (
        nuevoUsuario.length < 3
    ) {

        mostrarMensajeMiPerfil(
            "El usuario debe tener como mínimo 3 caracteres.",
            "error"
        );

        return;

    }


    if (
        !/^[a-zA-Z0-9._-]+$/.test(
            nuevoUsuario
        )
    ) {

        mostrarMensajeMiPerfil(
            "El usuario solo puede contener letras, números, punto, guion y guion bajo.",
            "error"
        );

        return;

    }


    if (
        password ||
        passwordConfirm
    ) {

        if (
            password.length < 6
        ) {

            mostrarMensajeMiPerfil(
                "La nueva contraseña debe tener al menos 6 caracteres.",
                "error"
            );

            return;

        }


        if (
            password !==
            passwordConfirm
        ) {

            mostrarMensajeMiPerfil(
                "Las contraseñas no coinciden.",
                "error"
            );

            return;

        }

    }


    const usuarios =
        obtenerUsuarios();


    const indiceUsuario =
        usuarios.findIndex(
            usuario =>
                usuario.id === sesion.id
        );


    /*
        Compatibilidad por si una cuenta antigua
        no tiene ID.
    */

    let indice =
        indiceUsuario;


    if (
        indice === -1
    ) {

        indice =
            usuarios.findIndex(
                usuario =>
                    usuario.usuario ===
                    sesion.usuario
            );

    }


    if (
        indice === -1
    ) {

        mostrarMensajeMiPerfil(
            "No se encontró la cuenta del usuario.",
            "error"
        );

        return;

    }


    /*
        Verificar que otro usuario no tenga
        el mismo nombre de acceso.
    */

    const usuarioDuplicado =
        usuarios.some(
            (
                usuario,
                index
            ) =>

                index !== indice

                &&

                String(
                    usuario.usuario || ""
                )
                .toLowerCase() ===
                nuevoUsuario.toLowerCase()
        );


    if (
        usuarioDuplicado
    ) {

        mostrarMensajeMiPerfil(
            "Ese nombre de usuario ya está registrado.",
            "error"
        );

        return;

    }


    /* ======================================
       ACTUALIZAR USUARIO
    ====================================== */

    usuarios[indice].nombre =
        nombre;


    usuarios[indice].usuario =
        nuevoUsuario;


    if (password) {

        usuarios[indice].password =
            password;

    }


    guardarUsuarios(
        usuarios
    );


    /* ======================================
       ACTUALIZAR SESIÓN ACTUAL
    ====================================== */

    const nuevaSesion = {

        ...sesion,

        id:
            usuarios[indice].id,

        nombre:
            usuarios[indice].nombre,

        usuario:
            usuarios[indice].usuario,

        rol:
            usuarios[indice].rol,

        activo:
            usuarios[indice].activo

    };


    localStorage.setItem(
        STORAGE_SESSION,
        JSON.stringify(
            nuevaSesion
        )
    );


    /* ======================================
       REFRESCAR INTERFAZ
    ====================================== */

    cargarDatosPerfilMenu();

    cargarDatosMiPerfil();

    cargarDashboard();


    /*
        Si el administrador está viendo
        la tabla de usuarios, también la
        actualizamos.
    */

    if (
        typeof cargarUsuarios ===
        "function"
    ) {

        cargarUsuarios();

    }


    mostrarMensajeMiPerfil(
        "Perfil actualizado correctamente.",
        "success"
    );

}

function mostrarMensajeMiPerfil(
    mensaje,
    tipo
) {

    const elemento =
        document.getElementById(
            "miPerfilMensaje"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        mensaje;


    elemento.classList.remove(
        "hidden",
        "success",
        "error"
    );


    elemento.classList.add(
        tipo
    );

}

function limpiarMensajeMiPerfil() {

    const elemento =
        document.getElementById(
            "miPerfilMensaje"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent = "";


    elemento.classList.add(
        "hidden"
    );


    elemento.classList.remove(
        "success",
        "error"
    );

}

function cerrarMiPerfil() {

    const modal =
        document.getElementById(
            "modalMiPerfil"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    limpiarMensajeMiPerfil();

}

function mostrarOcultarPasswordPerfil(
    idInput,
    boton
) {

    const input =
        document.getElementById(
            idInput
        );


    if (
        !input ||
        !boton
    ) {

        return;

    }


    const icono =
        boton.querySelector(
            "i"
        );


    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";


        if (icono) {

            icono.classList.remove(
                "fa-eye"
            );


            icono.classList.add(
                "fa-eye-slash"
            );

        }

    }

    else {

        input.type =
            "password";


        if (icono) {

            icono.classList.remove(
                "fa-eye-slash"
            );


            icono.classList.add(
                "fa-eye"
            );

        }

    }

}

function formatearFechaPerfil(
    fecha
) {

    if (!fecha) {

        return "Sin información";

    }


    /*
        Si ya está en formato dd/mm/yyyy,
        lo dejamos igual.
    */

    if (
        /^\d{2}\/\d{2}\/\d{4}$/.test(
            fecha
        )
    ) {

        return fecha;

    }


    const fechaObjeto =
        new Date(
            fecha
        );


    if (
        isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return fecha;

    }


    return fechaObjeto
        .toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}