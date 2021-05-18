import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import CuentaAtras from './CuentaAtras';
import ListadoPalabrasBuscar from './ListadoPalabrasBuscar';
import Modal from "react-modal";

function SopaDeLetras() {

    let arrayPalabras = []
    const tamanyoTablero = 10;
    let matriz = [];
    let params = useParams();
    let activa = params.activa;
    let emailUsuario = localStorage.getItem("email");

    let [arrayTablero, setArrayTablero] = useState([]);
    let palabrasCorrectas = []
    let [arrayPalabrasCorrectas, setarrayPalabrasCorrectas] = useState([])
    let [arrayLetrasCorrectasState, setarrayLetrasCorrectasState] = useState([])
    let [palabraTerminada, setPalabraTerminada] = useState(true);
    let [temporizadorRecuperado, setTemporizadorRecuperado] = useState()
    let [juegoTerminado, setJuegoTerminado] = useState(false);
    let [modalAbierta, setmodalAbierta] = useState(true);


    useEffect(() => {
        if (arrayTablero.length !== 0) {
            anyadirDatos()
        }
        actualizarSopaBaseDatos()
    }, [arrayTablero])

    useEffect(() => {
        if (activa === "activa") {
            setmodalAbierta(false);
            fetch(`http://localhost:9000/tablero/recuperarpartida/${emailUsuario}`)
                .then(res => res.json())
                .then(data => {
                    let board = data.response[0].board;
                    let boardState = data.response[0].boardState;
                    let temporizadorRecuperado = data.response[0].temporizador;
                    setArrayTablero(board);
                    setarrayPalabrasCorrectas(boardState);
                    setTemporizadorRecuperado(temporizadorRecuperado);
                    actualizarSopaBaseDatos()
                }
                )

        } else {
            for (let x = 0; x < tamanyoTablero; x++) {
                matriz[x] = [];
                for (let y = 0; y < tamanyoTablero; y++) {
                    matriz[x][y] = '#';
                }
            }
            recogidaPalabras();
        }

    }, []);

    useEffect(() => {

        if (activa === "activa") {

            if (arrayPalabrasCorrectas.length > 0) {

                for (let i = 0; i < arrayPalabrasCorrectas.length; i++) {
                    arrayLetrasCorrectas = arrayPalabrasCorrectas[i]
                    for (let j = 0; j < arrayLetrasCorrectas.length; j++) {
                        let posicionX = arrayLetrasCorrectas[j].x;
                        let posicionY = arrayLetrasCorrectas[j].y;
                        arrayTablero[posicionX][posicionY] = arrayLetrasCorrectas[j].letra;
                        let id = "" + posicionX + posicionY;
                        let letra = arrayLetrasCorrectas[j];
                        if (letra.pulsada === true) {
                            document.getElementById(id).className = "grid-item-green"
                        }
                        if (letra.resuelta === true) {
                            tacharPalabraTerminada(arrayLetrasCorrectas)
                        }
                    }
                }

                setArrayTablero(arrayTablero)
            }
        }
    }, [arrayPalabrasCorrectas])



    //---------------------------SI NO HAY PARTIDA ACTIVA
    function recogidaPalabras() {
        fetch('http://localhost:9000/tablero/palabras')
            .then(res => res.json())
            .then(data => {
                arrayPalabras = data.responseWords[0].palabras;
                crearSopa();
            })
    }

    //2. CREAR SOPA: RECORRE NUESTRO ARRAY DE PALABRAS Y MANDA CADA PALABRA, JUNTO A SI ES PAR O NO, A LA FUNCIÓN CALCULAR PALABRA.     
    function crearSopa() {
        for (let i = 0; i < arrayPalabras.length; i++) {
            let palabraSeleccionada = arrayPalabras[i];
            calcularPintarGuardarPalabras(palabraSeleccionada);
        }
        rellenarHuecos();
    }

    //CALCULAR PALABRA: RECIBE UNA PALABRA, Y SI ES PAR O NO. CON ELLO, CALCULA SUS POSICIONES MAXIMAS, Y LUEGO RECORRE CADA PALABRA PARA SACAR SUS LETRAS. LE MANDA A LA FUNCION PINTAR PALABRA LA POSICION POR CADA LETRA.
    function calcularPintarGuardarPalabras(palabra) {

        const tamanyoPalabra = palabra.length;
        let casillaOcupada = false;
        let posicionY = "";
        let posicionX = "";
        let posibilidades = 100;
        let orientacion;


        do {
            orientacion = posicionAleatoria()
            casillaOcupada = false;

            if (orientacion) { //HORIZONTAL
                posicionX = Math.floor(Math.random() * 10); //numero constante, es el 1º o el 2º depende si es horizontal o vertical.
                posicionY = Math.floor(Math.random() * (tamanyoTablero - tamanyoPalabra));  //delimita el espacio
                for (let i = 0; i < tamanyoPalabra; i++) {

                    if (matriz[posicionX][posicionY + i] === "#" || matriz[posicionX][posicionY + i] === palabra.slice(i, i + 1)) {
                    } else {
                        casillaOcupada = true;
                    }
                }

            } else {//VERTICAL
                posicionX = Math.floor(Math.random() * (tamanyoTablero - tamanyoPalabra)); //delimita el espacio 
                posicionY = Math.floor(Math.random() * 10); //numero constante, es el 1º o el 2º depende si es horizontal o vertical.

                for (let i = 0; i < tamanyoPalabra; i++) {
                    if (matriz[posicionX + i][posicionY] === "#" || matriz[posicionX + i][posicionY] === palabra.slice(i, i + 1)) {
                    } else {
                        casillaOcupada = true;
                    }
                }

            }
            posibilidades--;
        } while (casillaOcupada === true && posibilidades > 0);


        //SE RECORRE CADA PALABRA PARA PINTARLA, Y GUARDARLA EN UN ARRAY. AL FINAL DE TODO CADA ARRAYPALABRA SE METE EN EL ARRAY PALABRAS CORRECTAS, Y ÉSTE SE SETEA EN EL STATE.
        let arrayPalabra = [];
        for (let i = 0; i < tamanyoPalabra; i++) {
            let letra = palabra.slice(i, i + 1);
            if (orientacion) {//HORIZONTAL
                pintarLetra(letra, posicionX, posicionY);
                guardarLetrasCorrectas(letra, posicionX, posicionY, arrayPalabra);
                posicionY++;
            } else {  //VERTICAL 
                pintarLetra(letra, posicionX, posicionY)
                guardarLetrasCorrectas(letra, posicionX, posicionY, arrayPalabra)
                posicionX++;
            }
        }

        palabrasCorrectas.push(arrayPalabra);


        setarrayPalabrasCorrectas(palabrasCorrectas)
        //actualizarSopaBaseDatos();
    }

    //--------------- FUNCIONES COMUNES

    function tacharPalabraTerminada(array) {
        let palabraTerminadaString = "";

        for (let i = 0; i < array.length; i++) {
            palabraTerminadaString += array[i].letra;
        }
        let matches = document.querySelectorAll("p");

        for (let i = 0; i < matches.length; i++) {

            if (matches[i].innerHTML === palabraTerminadaString) {
                let posicion = matches[i]
                posicion.style.textDecoration = "line-through";
                palabraTerminadaString = "";
            }
        }

    }


    function posicionAleatoria() {
        return Math.floor(Math.random() * 2) % 2 == 0; // TRUE
    }

    function pintarLetra(letra, posicionX, posicionY) {

        matriz[posicionX][posicionY] = letra;

    }

    function guardarLetrasCorrectas(letra, posicionX, posicionY, arrayPalabra) {
        let objetoLetra = {
            letra: letra,
            x: posicionX,
            y: posicionY,
            pulsada: false,
            resuelta: false,
        }
        arrayPalabra.push(objetoLetra);
    }

    function rellenarHuecos() {
        let vocales = ["a", "e", "i", "o", "u"]
        let consonantes = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x", "y", "z"];

        for (let i = 0; i < tamanyoTablero; i++) {
            for (let j = 0; j < tamanyoTablero; j++) {
                let vocalAleatoria = Math.floor(Math.random() * (vocales.length));
                let consonanteAleatoria = Math.floor(Math.random() * (consonantes.length));

                if (matriz[i][j] === "#") {

                    if (i % 2 === 0) {
                        matriz[i][j] = vocales[vocalAleatoria].toUpperCase();
                    } else {
                        matriz[i][j] = consonantes[consonanteAleatoria].toUpperCase();
                    }

                }
            }

        }
        setArrayTablero(matriz);
    }

    // BUSCAMOS SI LA LETRA PULSADA CORRESPONDE TANTO LA LETRA COMO LA POSICION CON UNA DE LAS QUE TENEMOS GUARDADAS EN EL ARRAY PALABRASCORRECTAS.
    let arrayLetrasCorrectas;
    // let contadorLetraSeleccionada = 0;
    let [contadorLetraSeleccionada, setContadorLetraSeleccionada] = useState(0)
    function selectorPalabras(e) {

        if (e.target.className === "grid-item-yellow") {
            e.target.className = "grid-item";
            setContadorLetraSeleccionada(contadorLetraSeleccionada - 1)
        } else if (contadorLetraSeleccionada < (tamanyoTablero)) {
            e.target.className = "grid-item-yellow";
            setContadorLetraSeleccionada(contadorLetraSeleccionada + 1)
        } else if (contadorLetraSeleccionada === (tamanyoTablero)) {
            let casillas = document.querySelectorAll(".grid-item-yellow")
            for (let i = 0; i < casillas.length; i++) {
                casillas[i].className = "grid-item";
            }
            setContadorLetraSeleccionada(0);

        }
        seleccionarPalabrasClicadas(e);

    }

    useEffect(() => {
        console.log(contadorLetraSeleccionada);

    }, [contadorLetraSeleccionada])

    function seleccionarPalabrasClicadas(e) {

        palabraTerminada = true;

        for (let i = 0; i < arrayPalabrasCorrectas.length; i++) {
            arrayLetrasCorrectas = arrayPalabrasCorrectas[i]

            for (let j = 0; j < arrayLetrasCorrectas.length; j++) {
                if (e.target.textContent === arrayLetrasCorrectas[j].letra && e.target.id === (`${arrayLetrasCorrectas[j].x}${arrayLetrasCorrectas[j].y}`)) {

                    if (arrayLetrasCorrectas[j].pulsada === true) {
                        arrayLetrasCorrectas[j].pulsada = false;
                    } else {
                        arrayLetrasCorrectas[j].pulsada = true;
                        for (let k = 0; k < arrayLetrasCorrectas.length; k++) {
                            if (arrayLetrasCorrectas[k].pulsada === false) {
                                palabraTerminada = false;
                            }
                        }

                        if (palabraTerminada === true) {
                            for (let l = 0; l < arrayLetrasCorrectas.length; l++) {
                                let id = `${arrayLetrasCorrectas[l].x}${arrayLetrasCorrectas[l].y}`;
                                document.getElementById(id).className = "grid-item-green";
                                arrayLetrasCorrectas[l].resuelta = true;
                            }

                            setarrayLetrasCorrectasState(arrayLetrasCorrectas)

                            setContadorLetraSeleccionada(0)

                        }
                    }

                }


            }
        }

    }


    useEffect(() => {
        if (arrayLetrasCorrectasState !== undefined && arrayLetrasCorrectasState !== null) {

            if (arrayLetrasCorrectasState.length !== 0) {

                actualizarSopaBaseDatos()
            }
        }
    }, [arrayLetrasCorrectasState])

    function actualizarSopaBaseDatos() {

        let actualizarSopa = {
            arrayPalabrasCorrectas: arrayPalabrasCorrectas,
            emailUsuario: emailUsuario
        }

        let fetchData = {
            method: "PUT",
            body: JSON.stringify(actualizarSopa),
            headers: {
                'content-type': 'application/json; charset = UTF-8'
            }
        }
        if (arrayPalabrasCorrectas.length !== 0) {

            fetch('http://localhost:9000/tablero/actualizarpartida', fetchData)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setarrayPalabrasCorrectas(data.data.boardState)
                })

        }


    }

    function anyadirDatos() {

        let estado = "activa";

        let fetchData = {
            method: "PUT",
            body: JSON.stringify({ array: arrayTablero, estado: estado, emailUsuario: emailUsuario }),
            headers: {
                'content-type': 'application/json; charset = UTF-8'
            }
        }
        fetch('http://localhost:9000/tablero/tableroInicial', fetchData)
            .then(res => res.json())
        // .then(datos => alert(datos.mensaje))

    }

    return (

        <div className="sopa-div">
            <div className="modal-instrucciones">

                <Modal
                    ariaHideApp={false}
                    isOpen={modalAbierta}
                    style={
                        {
                            overlay: {
                                backgroundColor: "black",


                            },
                            content: {
                                color: "black",
                                textAlign: "center",


                            }
                        }
                    } >
                    <h2> Instrucciones para el juego</h2>
                    <p> Encuentra el máximo de palabras sugeridas en el menor tiempo posible.</p>
                    <p> Deberás ir seleccionando cada letra hasta formar una palabra completa.</p>
                    <p> Si las letras marcadas configuran una palabra correcta, la palabra se tachará de la lista y se marcará en color verde</p>
                    <p> Puedes pausar el tiempo en cualquier momento de la partida. El estado de la partida se guardará automáticamente, y podrás reanudarlo cuando lo desees.</p>
                    <p> Si localizas todas las palabras o si termina el tiempo, podrás consultar la puntuación de tu partida.</p>
                    <p> Para iniciar la partida, haz click en "empezar el juego". ¡Suerte!</p>
                    <div>
                        <button onClick={() => setmodalAbierta(false)}> Empezar el juego</button>
                    </div>

                </Modal>
            </div>
            <div>
                {modalAbierta === false ?
                    <CuentaAtras
                        temporizadorRecuperado={(temporizadorRecuperado !== undefined) ? temporizadorRecuperado : ''}
                        juegoTerminado={juegoTerminado}
                        activa={(temporizadorRecuperado !== undefined) ? activa : ''}
                        arrayPalabrasCorrectas={arrayPalabrasCorrectas}
                    /> : ""}
            </div>

            <ListadoPalabrasBuscar juegoTerminado={juegoTerminado} setJuegoTerminado={setJuegoTerminado} arrayPalabrasCorrectas={arrayPalabrasCorrectas} arrayLetrasCorrectas={arrayLetrasCorrectasState} palabraTerminada={palabraTerminada} />
            <div className="grid-container" id="sopadeletras">
                {arrayTablero.map((x, indexX) => {
                    return x.map((y, indexY) => {
                        return <div key={indexX + indexY} className="grid-item" onClick={selectorPalabras} id={`${indexX}${indexY}`}>{arrayTablero[indexX][indexY]}</div>
                    })
                })}
            </div>

        </div>
    )

}

export default SopaDeLetras;