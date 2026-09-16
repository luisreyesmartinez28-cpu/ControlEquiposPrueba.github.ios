// ==========================================
// SCANNER DNI QR / CODIGO DE BARRAS
// ==========================================

let scannerDNIActivo = null;
let scannerDNILeyendo = false;


function abrirScannerDNI() {

    const modal =
        document.getElementById(
            "modalScannerDNI"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "hidden"
    );


    iniciarScannerDNI();

}


async function iniciarScannerDNI() {

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        alert(
            "No se cargó la librería del lector QR."
        );

        return;

    }


    if (scannerDNILeyendo) {
        return;
    }


    scannerDNIActivo =
        new Html5Qrcode(
            "scannerDNI"
        );


    const config = {

        fps: 10,

        qrbox: {
            width: 250,
            height: 160
        }

    };


    try {

        scannerDNILeyendo = true;


        await scannerDNIActivo.start(

            {
                facingMode:
                    "environment"
            },

            config,

            function(
                textoLeido
            ) {

                procesarLecturaDNI(
                    textoLeido
                );

            },

            function() {

                // errores normales de lectura
                // no hacemos nada

            }

        );

    }

    catch (error) {

        console.error(
            "Error scanner:",
            error
        );


        scannerDNILeyendo = false;


        alert(
            "No se pudo acceder a la cámara."
        );

    }

}

function procesarLecturaDNI(
    textoLeido
) {

    if (!textoLeido) {
        return;
    }


    /*
        Nos quedamos solo con números.
    */

    const numeros =
        String(
            textoLeido
        )
        .replace(
            /\D/g,
            ""
        );


    /*
        Buscar una secuencia de 8 dígitos.
    */

    const coincidencia =
        numeros.match(
            /\d{8}/
        );


    if (!coincidencia) {

        alert(
            "El código leído no contiene un DNI válido de 8 dígitos."
        );

        return;

    }


    const dni =
        coincidencia[0];


    const input =
        document.getElementById(
            "dniEntrega"
        );


    if (input) {

        input.value =
            dni;


        /*
            Lanzar la búsqueda automática
            del trabajador.
        */

        buscarTrabajadorEntregaPorDNI();

    }


    cerrarScannerDNI();

}

async function cerrarScannerDNI() {

    const modal =
        document.getElementById(
            "modalScannerDNI"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    if (
        scannerDNIActivo &&
        scannerDNILeyendo
    ) {

        try {

            await scannerDNIActivo.stop();

            await scannerDNIActivo.clear();

        }

        catch (error) {

            console.log(
                "Scanner detenido."
            );

        }

    }


    scannerDNILeyendo = false;

    scannerDNIActivo = null;

}

let scannerSerieEntregaActivo = null;
let scannerSerieEntregaLeyendo = false;
let scannerSerieEntregaProcesando = false;

function abrirScannerSerieEntrega() {

    const modal =
        document.getElementById(
            "modalScannerSerieEntrega"
        );


    if (!modal) {

        console.error(
            "No existe #modalScannerSerieEntrega"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    iniciarScannerSerieEntrega();

}

async function iniciarScannerSerieEntrega() {

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        alert(
            "No se cargó la librería del escáner."
        );

        return;

    }


    if (
        scannerSerieEntregaLeyendo
    ) {

        return;

    }


    scannerSerieEntregaActivo =
        new Html5Qrcode(
            "scannerSerieEntrega"
        );


    try {

        scannerSerieEntregaLeyendo =
            true;


        await scannerSerieEntregaActivo.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 250,
                    height: 250
                }
            },

            function(
                textoLeido
            ) {

                procesarSerieEscaneadaEntrega(
                    textoLeido
                );

            },

            function() {

                // Errores normales mientras
                // la cámara busca un QR.

            }

        );

    }

    catch (error) {

        console.error(
            "Error al iniciar scanner de serie:",
            error
        );


        scannerSerieEntregaLeyendo =
            false;


        scannerSerieEntregaActivo =
            null;


        alert(
            "No se pudo acceder a la cámara."
        );

    }

}

async function procesarSerieEscaneadaEntrega(
    textoLeido
) {

    /*
        Evitar que la cámara procese
        el mismo QR varias veces.
    */

    if (
        scannerSerieEntregaProcesando
    ) {

        return;

    }


    scannerSerieEntregaProcesando =
        true;


    const serie =
        extraerSerieDesdeQR(
            textoLeido
        );


    if (!serie) {

        scannerSerieEntregaProcesando =
            false;

        return;

    }


    const input =
        document.getElementById(
            "buscarSerieEntrega"
        );


    if (!input) {

        scannerSerieEntregaProcesando =
            false;

        return;

    }


    /*
        Colocar el dato leído
        directamente en el cuadro.
    */

    input.value =
        serie;


    /*
        Cerrar la cámara.
    */

    await cerrarScannerSerieEntrega();


    /*
        Dejamos la serie visible
        en el input.
    */

    input.focus();


    /*
        OPCIONAL:
        agregar automáticamente el equipo.

        Si NO quieres que se agregue solo,
        elimina este bloque.
    */


    scannerSerieEntregaProcesando =
        false;

}

function extraerSerieDesdeQR(
    texto
) {

    if (!texto) {
        return "";
    }


    const contenido =
        String(texto)
            .trim();


    /*
        Caso:
        SERIE: ABC123
        Serie = ABC123
        SERIAL: ABC123
    */

    const coincidencia =
        contenido.match(
            /(?:serie|serial)\s*[:=]\s*([A-Za-z0-9._\-\/]+)/i
        );


    if (
        coincidencia &&
        coincidencia[1]
    ) {

        return coincidencia[1]
            .trim();

    }


    /*
        Si el QR contiene solamente
        la serie, usamos todo el texto.
    */

    if (
        !contenido.includes("\n") &&
        contenido.length <= 100
    ) {

        return contenido;

    }


    /*
        Si tiene varias líneas,
        buscar la línea SERIE.
    */

    const lineas =
        contenido.split(
            /\r?\n/
        );


    for (
        const linea
        of lineas
    ) {

        const resultado =
            linea.match(
                /(?:serie|serial)\s*[:=]?\s*(.+)/i
            );


        if (
            resultado &&
            resultado[1]
        ) {

            return resultado[1]
                .trim();

        }

    }


    return contenido;

}

async function cerrarScannerSerieEntrega() {

    const modal =
        document.getElementById(
            "modalScannerSerieEntrega"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }


    if (
        scannerSerieEntregaActivo &&
        scannerSerieEntregaLeyendo
    ) {

        try {

            await scannerSerieEntregaActivo.stop();

        }

        catch (error) {

            console.log(
                "El scanner de serie ya estaba detenido."
            );

        }


        try {

            await scannerSerieEntregaActivo.clear();

        }

        catch (error) {

            // No hacer nada

        }

    }


    scannerSerieEntregaLeyendo =
        false;


    scannerSerieEntregaActivo =
        null;

}

