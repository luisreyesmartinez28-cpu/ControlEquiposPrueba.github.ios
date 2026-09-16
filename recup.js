// ==========================================
// RECUPERACIÓN DE CONTRASEÑA
// ==========================================

let usuarioRecuperacion = null;


// Mostrar módulo de recuperación
function mostrarRecuperacion() {

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("registerScreen").classList.add("hidden");
    document.getElementById("appScreen").classList.add("hidden");
    document.getElementById("recoveryScreen").classList.remove("hidden");

    reiniciarRecuperacion();
}


// Buscar usuario
function buscarUsuarioRecuperacion() {

    const username =
        document.getElementById("recoveryUsername").value.trim();

    const error =
        document.getElementById("recoveryError1");

    error.textContent = "";

    if (!username) {

        error.textContent = "Ingresa tu usuario.";

        return;
    }


    const usuarios = obtenerUsuarios();

    const usuario = usuarios.find(
        u => u.usuario.toLowerCase() === username.toLowerCase()
    );


    if (!usuario) {

        error.textContent =
            "No encontramos ese usuario.";

        return;
    }


    if (usuario.activo === false) {

        error.textContent =
            "Esta cuenta está desactivada.";

        return;
    }


    usuarioRecuperacion = usuario;


    // Pasar al segundo paso
    document
        .getElementById("recoveryStep1")
        .classList.add("hidden");

    document
        .getElementById("recoveryStep2")
        .classList.remove("hidden");


    document.getElementById("newPassword").value = "";
    document.getElementById("newPasswordConfirm").value = "";

    document.getElementById("newPassword").focus();
}


// Cambiar contraseña
function cambiarPassword() {

    if (!usuarioRecuperacion) {

        reiniciarRecuperacion();

        return;
    }


    const nuevaPassword =
        document.getElementById("newPassword").value;

    const confirmarPassword =
        document.getElementById("newPasswordConfirm").value;

    const error =
        document.getElementById("recoveryError2");

    error.textContent = "";


    if (nuevaPassword.length < 6) {

        error.textContent =
            "La contraseña debe tener al menos 6 caracteres.";

        return;
    }


    if (nuevaPassword !== confirmarPassword) {

        error.textContent =
            "Las contraseñas no coinciden.";

        return;
    }


    const usuarios = obtenerUsuarios();


    const indice = usuarios.findIndex(
        u => u.id === usuarioRecuperacion.id
    );


    if (indice === -1) {

        error.textContent =
            "No se encontró la cuenta.";

        return;
    }


    // Actualizar contraseña
    usuarios[indice].password = nuevaPassword;


    guardarUsuarios(usuarios);


    alert("Contraseña actualizada correctamente.");


    const usuarioActualizado =
        usuarios[indice].usuario;


    usuarioRecuperacion = null;


    mostrarLogin();


    document.getElementById("loginUsername").value =
        usuarioActualizado;

    document.getElementById("loginPassword").value = "";

    document.getElementById("loginPassword").focus();
}


// Reiniciar recuperación
function reiniciarRecuperacion() {

    usuarioRecuperacion = null;


    document
        .getElementById("recoveryStep1")
        .classList.remove("hidden");

    document
        .getElementById("recoveryStep2")
        .classList.add("hidden");


    document.getElementById("recoveryUsername").value = "";

    document.getElementById("newPassword").value = "";

    document.getElementById("newPasswordConfirm").value = "";


    document.getElementById("recoveryError1").textContent = "";

    document.getElementById("recoveryError2").textContent = "";
}