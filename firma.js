// ==========================================
// ETAPA 5 - FIRMA DIGITAL
// ==========================================

let entregaFirmaActual = null;

let canvasFirmaEntrega = null;

let contextoFirmaEntrega = null;

let firmandoEntrega = false;

let firmaTieneContenido = false;


/* ==========================================
   ABRIR FIRMA
========================================== */

function abrirFirmaEntrega(idEntrega) {

    const entregas =
        obtenerEntregas();


    const entrega =
        entregas.find(
            item =>
                item.id === idEntrega
        );


    if (!entrega) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    entregaFirmaActual =
        entrega.id;


    document.getElementById(
        "numeroEntregaFirma"
    ).textContent =
        entrega.numero;


    document.getElementById(
        "nombreResponsableFirma"
    ).textContent =
        entrega.trabajador;


    document.getElementById(
        "dniResponsableFirma"
    ).textContent =
        "DNI: " +
        entrega.dni;


    document
        .getElementById(
            "modalFirmaEntrega"
        )
        .classList.remove(
            "hidden"
        );


    setTimeout(
        () => {

            inicializarCanvasFirma();


            if (entrega.firma) {

                cargarFirmaExistente(
                    entrega.firma
                );

            }

            else {

                limpiarFirmaEntrega();

            }

        },
        100
    );

}


/* ==========================================
   CERRAR FIRMA
========================================== */

function cerrarFirmaEntrega() {

    document
        .getElementById(
            "modalFirmaEntrega"
        )
        .classList.add(
            "hidden"
        );


    entregaFirmaActual =
        null;


    firmandoEntrega =
        false;

}


/* ==========================================
   INICIALIZAR CANVAS
========================================== */

function inicializarCanvasFirma() {

    canvasFirmaEntrega =
        document.getElementById(
            "canvasFirmaEntrega"
        );


    if (!canvasFirmaEntrega) {

        return;

    }


    contextoFirmaEntrega =
        canvasFirmaEntrega
            .getContext("2d");


    ajustarTamanoCanvasFirma();


    configurarEstiloFirma();


    configurarEventosFirma();

}


/* ==========================================
   TAMAÑO REAL DEL CANVAS
========================================== */

function ajustarTamanoCanvasFirma() {

    if (!canvasFirmaEntrega) {

        return;

    }


    const contenedor =
        canvasFirmaEntrega
            .parentElement;


    const rect =
        contenedor
            .getBoundingClientRect();


    const ratio =
        window.devicePixelRatio || 1;


    canvasFirmaEntrega.width =
        Math.round(
            rect.width *
            ratio
        );


    canvasFirmaEntrega.height =
        Math.round(
            rect.height *
            ratio
        );


    canvasFirmaEntrega.style.width =
        rect.width + "px";


    canvasFirmaEntrega.style.height =
        rect.height + "px";


    contextoFirmaEntrega =
        canvasFirmaEntrega
            .getContext("2d");


    contextoFirmaEntrega
        .setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );


    configurarEstiloFirma();

}


/* ==========================================
   ESTILO LAPIZ
========================================== */

function configurarEstiloFirma() {

    if (!contextoFirmaEntrega) {

        return;

    }


    contextoFirmaEntrega.lineWidth =
        2.2;


    contextoFirmaEntrega.lineCap =
        "round";


    contextoFirmaEntrega.lineJoin =
        "round";


    contextoFirmaEntrega.strokeStyle =
        "#111827";

}


/* ==========================================
   EVENTOS POINTER
========================================== */

function configurarEventosFirma() {

    if (!canvasFirmaEntrega) {

        return;

    }


    canvasFirmaEntrega.onpointerdown =
        iniciarTrazoFirma;


    canvasFirmaEntrega.onpointermove =
        dibujarFirma;


    canvasFirmaEntrega.onpointerup =
        finalizarTrazoFirma;


    canvasFirmaEntrega.onpointercancel =
        finalizarTrazoFirma;


    canvasFirmaEntrega.onpointerleave =
        finalizarTrazoFirma;

}


/* ==========================================
   POSICION
========================================== */

function obtenerPosicionFirma(event) {

    const rect =
        canvasFirmaEntrega
            .getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };

}


/* ==========================================
   INICIAR TRAZO
========================================== */

function iniciarTrazoFirma(event) {

    if (!contextoFirmaEntrega) {

        return;

    }


    event.preventDefault();


    try {

        canvasFirmaEntrega
            .setPointerCapture(
                event.pointerId
            );

    }

    catch (error) {

        // No hacer nada

    }


    firmandoEntrega =
        true;


    firmaTieneContenido =
        true;


    ocultarPlaceholderFirma();


    const posicion =
        obtenerPosicionFirma(
            event
        );


    contextoFirmaEntrega
        .beginPath();


    contextoFirmaEntrega
        .moveTo(
            posicion.x,
            posicion.y
        );

}


/* ==========================================
   DIBUJAR
========================================== */

function dibujarFirma(event) {

    if (
        !firmandoEntrega ||
        !contextoFirmaEntrega
    ) {

        return;

    }


    event.preventDefault();


    const posicion =
        obtenerPosicionFirma(
            event
        );


    /*
        Para lápiz táctil podemos usar
        la presión cuando esté disponible.
    */

    if (
        event.pointerType === "pen" &&
        event.pressure > 0
    ) {

        contextoFirmaEntrega.lineWidth =
            Math.max(
                1.3,
                event.pressure * 3.2
            );

    }

    else {

        contextoFirmaEntrega.lineWidth =
            2.2;

    }


    contextoFirmaEntrega
        .lineTo(
            posicion.x,
            posicion.y
        );


    contextoFirmaEntrega
        .stroke();

}


/* ==========================================
   FINALIZAR TRAZO
========================================== */

function finalizarTrazoFirma(event) {

    if (!firmandoEntrega) {

        return;

    }


    firmandoEntrega =
        false;


    if (contextoFirmaEntrega) {

        contextoFirmaEntrega
            .closePath();

    }


    if (
        canvasFirmaEntrega &&
        event
    ) {

        try {

            canvasFirmaEntrega
                .releasePointerCapture(
                    event.pointerId
                );

        }

        catch (error) {

            // No hacer nada

        }

    }

}


/* ==========================================
   LIMPIAR FIRMA
========================================== */

function limpiarFirmaEntrega() {

    if (!canvasFirmaEntrega) {

        canvasFirmaEntrega =
            document.getElementById(
                "canvasFirmaEntrega"
            );

    }


    if (!canvasFirmaEntrega) {

        return;

    }


    const ctx =
        canvasFirmaEntrega
            .getContext("2d");


    ctx.clearRect(
        0,
        0,
        canvasFirmaEntrega.width,
        canvasFirmaEntrega.height
    );


    firmaTieneContenido =
        false;


    mostrarPlaceholderFirma();

}


/* ==========================================
   PLACEHOLDER
========================================== */

function ocultarPlaceholderFirma() {

    const placeholder =
        document.getElementById(
            "signaturePlaceholder"
        );


    if (placeholder) {

        placeholder.classList.add(
            "hidden"
        );

    }

}


function mostrarPlaceholderFirma() {

    const placeholder =
        document.getElementById(
            "signaturePlaceholder"
        );


    if (placeholder) {

        placeholder.classList.remove(
            "hidden"
        );

    }

}


/* ==========================================
   CARGAR FIRMA EXISTENTE
========================================== */

function cargarFirmaExistente(
    firmaBase64
) {

    if (
        !canvasFirmaEntrega ||
        !contextoFirmaEntrega
    ) {

        return;

    }


    const imagen =
        new Image();


    imagen.onload =
        function() {

            const rect =
                canvasFirmaEntrega
                    .getBoundingClientRect();


            contextoFirmaEntrega
                .clearRect(
                    0,
                    0,
                    rect.width,
                    rect.height
                );


            contextoFirmaEntrega
                .drawImage(
                    imagen,
                    0,
                    0,
                    rect.width,
                    rect.height
                );


            firmaTieneContenido =
                true;


            ocultarPlaceholderFirma();

        };


    imagen.src =
        firmaBase64;

}


/* ==========================================
   GUARDAR FIRMA
========================================== */

function guardarFirmaEntrega() {

    if (
        !entregaFirmaActual
    ) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    const canvas =
        document.getElementById(
            "canvasFirmaEntrega"
        );


    if (!canvas) {

        return;

    }


    if (
        !firmaTieneContenido
    ) {

        alert(
            "Debe registrar una firma."
        );

        return;

    }


    const firmaBase64 =
        canvas.toDataURL(
            "image/png"
        );


    const entregas =
        obtenerEntregas();


    const indice =
        entregas.findIndex(
            entrega =>
                entrega.id ===
                entregaFirmaActual
        );


    if (
        indice === -1
    ) {

        alert(
            "No se encontró la entrega."
        );

        return;

    }


    entregas[indice].firma =
        firmaBase64;


    entregas[indice].fechaFirma =
        new Date().toISOString();


    entregas[indice].estado =
        "FIRMADO";


    entregas[indice].firmado =
        true;


    guardarEntregas(
        entregas
    );


    cerrarFirmaEntrega();

    cargarEntregas();

    cargarDashboard();

    cargarNotificaciones();


    mostrarToast(
        "Firma guardada",
        `La entrega ${entregas[indice].numero} fue firmada correctamente.`,
        "success"
    );

}


/* ==========================================
   REDIMENSIONAR
========================================== */

window.addEventListener(
    "resize",
    function() {

        const modal =
            document.getElementById(
                "modalFirmaEntrega"
            );


        if (
            !modal ||
            modal.classList.contains(
                "hidden"
            )
        ) {

            return;

        }


        /*
            No redimensionamos automáticamente
            mientras hay una firma porque
            borraría el contenido.
        */

    }
);