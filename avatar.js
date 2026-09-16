// ==========================================
// MENU PERFIL USUARIO
// ==========================================

function toggleUserProfileMenu(event) {

    if (event) {
        event.stopPropagation();
    }


    const menu =
        document.getElementById(
            "userProfileMenu"
        );


    const flecha =
        document.getElementById(
            "profileArrow"
        );


    if (!menu) {
        return;
    }


    // Cerrar panel de notificaciones
    const panelNotificaciones =
        document.getElementById(
            "notificationsPanel"
        );


    if (panelNotificaciones) {

        panelNotificaciones
            .classList
            .add("hidden");

    }


    const cerrado =
        menu.classList.contains(
            "hidden"
        );


    if (cerrado) {

        cargarDatosPerfilMenu();

        menu.classList.remove(
            "hidden"
        );


        if (flecha) {

            flecha.classList.add(
                "open"
            );

        }

    }

    else {

        cerrarMenuPerfil();

    }

}

function cargarDatosPerfilMenu() {

    const sesion =
        obtenerSesionActual();


    if (!sesion) {
        return;
    }


    const nombre =
        sesion.nombre ||
        sesion.usuario ||
        "Usuario";


    const rol =
        sesion.rol ||
        "Usuario";


    const iniciales =
        obtenerInicialesPerfil(
            nombre
        );


    actualizarElementoPerfil(
        "profileMenuAvatar",
        iniciales
    );


    actualizarElementoPerfil(
        "profileMenuName",
        nombre
    );


    actualizarElementoPerfil(
        "profileMenuRole",
        rol
    );


    /*
      También actualizamos tu avatar original,
      pero conservamos exactamente los IDs
      de tu sistema actual.
    */

    actualizarElementoPerfil(
        "userAvatar",
        iniciales
    );


    actualizarElementoPerfil(
        "currentUserName",
        nombre
    );


    actualizarElementoPerfil(
        "currentUserRole",
        rol
    );

}

function obtenerInicialesPerfil(nombre) {

    const palabras =
        String(nombre || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);


    if (
        palabras.length === 0
    ) {

        return "US";

    }


    if (
        palabras.length === 1
    ) {

        return palabras[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        palabras[0][0] +
        palabras[
            palabras.length - 1
        ][0]
    ).toUpperCase();

}   

function actualizarElementoPerfil(
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

function cerrarMenuPerfil() {

    const menu =
        document.getElementById(
            "userProfileMenu"
        );


    const flecha =
        document.getElementById(
            "profileArrow"
        );


    if (menu) {

        menu.classList.add(
            "hidden"
        );

    }


    if (flecha) {

        flecha.classList.remove(
            "open"
        );

    }

}

function abrirConfiguracionDesdePerfil() {

    cerrarMenuPerfil();

    mostrarModulo(
        "configuracion"
    );

}

function cerrarSesionDesdePerfil() {

    cerrarMenuPerfil();

    cerrarSesion();

}

document.addEventListener(
    "click",
    function(event) {

        const wrapper =
            document.querySelector(
                ".user-profile-wrapper"
            );


        if (
            wrapper &&
            !wrapper.contains(
                event.target
            )
        ) {

            cerrarMenuPerfil();

        }

    }
);

