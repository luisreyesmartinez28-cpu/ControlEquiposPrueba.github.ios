let serieQRActual = "";

function mostrarQRIndividual(serie){

    if(!serie){
        alert("Este equipo no tiene serie.");
        return;
    }

    serieQRActual = serie;

    const modal =
        document.getElementById("modalQR");

    const contenedor =
        document.getElementById("qrIndividual");

    const texto =
        document.getElementById("textoSerieQR");

    contenedor.innerHTML = "";

    texto.textContent =
        "Serie: " + serie;

    new QRCode(
        contenedor,
        {
            text: serie,
            width: 220,
            height: 220,
            correctLevel:
                QRCode.CorrectLevel.H
        }
    );

    modal.style.display = "flex";
}

function cerrarModalQR(){

    document.getElementById(
        "modalQR"
    ).style.display = "none";

}

function descargarQRIndividual(){

    const contenedor =
        document.getElementById(
            "qrIndividual"
        );

    const canvas =
        contenedor.querySelector("canvas");

    const img =
        contenedor.querySelector("img");

    let imagenQR = "";

    if(canvas){

        imagenQR =
            canvas.toDataURL(
                "image/png"
            );

    }
    else if(img){

        imagenQR =
            img.src;

    }
    else{

        alert(
            "No se encontró el QR."
        );

        return;
    }


    const enlace =
        document.createElement("a");

    enlace.href = imagenQR;

    enlace.download =
        `QR_${serieQRActual}.png`;

    document.body.appendChild(
        enlace
    );

    enlace.click();

    document.body.removeChild(
        enlace
    );

}

function generarQRBase64(texto){

    return new Promise(
        (resolve, reject) => {

            const contenedor =
                document.createElement(
                    "div"
                );

            contenedor.style.position =
                "fixed";

            contenedor.style.left =
                "-9999px";

            document.body.appendChild(
                contenedor
            );


            new QRCode(contenedor, {
    text: String(serie).trim(),
    width: 300,
    height: 300,
    correctLevel: QRCode.CorrectLevel.H
});


            setTimeout(() => {

                const canvas =
                    contenedor.querySelector(
                        "canvas"
                    );

                const img =
                    contenedor.querySelector(
                        "img"
                    );

                let base64 = "";


                if(canvas){

                    base64 =
                        canvas.toDataURL(
                            "image/png"
                        );

                }
                else if(img){

                    base64 =
                        img.src;

                }


                document.body.removeChild(
                    contenedor
                );


                if(base64){

                    resolve(base64);

                }
                else{

                    reject(
                        "No se pudo generar QR"
                    );

                }

            }, 150);

        }
    );

}
