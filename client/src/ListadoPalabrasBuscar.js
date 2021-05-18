import { useState, useEffect } from "react";
import PantallaFinDeJuego from "./PantallaFinDeJuego";

function ListadoPalabrasBuscar(props) {
    let arrayPalabrasCorrectas = props.arrayPalabrasCorrectas;
    let arrayLetrasCorrectas = props.arrayLetrasCorrectas;
    let palabraTerminada = props.palabraTerminada;
    let palabraTerminadaString = "";

    let juegoTerminado = props.juegoTerminado;
    let setJuegoTerminado = props.setJuegoTerminado;

    // let [juegoTerminado, setJuegoTerminado] = useState(props.juegoTerminado);


    let [liArray, setLiArray] = useState([])
    let [secondLiArray, setSecondLiArray] = useState([])
    let [count, setCount] = useState(0)

    if (palabraTerminada === true && arrayLetrasCorrectas) {
        tacharPalabraTerminada(arrayLetrasCorrectas)
        comprobarFinDeJuego()
    }

    useEffect(() => {
        setTimeout(function () {
            setLiArray(document.querySelectorAll("p.listado-palabras"))
        }, 3000)
    }, [])

    function comprobarFinDeJuego() {
        for (let i = 0; i < liArray.length; i++) {
            if (liArray[i].style.textDecoration === "line-through") {
                if (secondLiArray.indexOf(liArray[i]) === -1) {

                    setSecondLiArray([...secondLiArray, liArray[i]])
                    setCount(count + 1)
                }
            }
        }

    }

    useEffect(() => {

        if (secondLiArray.length > 0 && secondLiArray.length === liArray.length) {
            console.log('Somos los conguitos');
            setJuegoTerminado(true)
        }
    }, [count])

    useEffect(() => {


        if (juegoTerminado === true) {
            document.getElementById("sopadeletras").style.pointerEvents = "none";
        }

    }, [juegoTerminado])





    function tacharPalabraTerminada(array) {

        for (let i = 0; i < array.length; i++) {
            palabraTerminadaString += array[i].letra;
        }
        let matches = document.querySelectorAll("p");

        for (let i = 0; i < matches.length; i++) {

            if (matches[i].innerHTML === palabraTerminadaString) {
                let posicion = matches[i]
                // document.querySelector(posicion).textContent = palabraTerminada.strike();
                posicion.style.textDecoration = "line-through";
                palabraTerminadaString = "";
            }
        }

    }
    function pasarLetrasAPalabra(arrayLetras) {
        return arrayLetras.map(function (letra) {
            return letra.letra
        })

    }


    return (
        <div className="palabras-buscar-div">
            <p className="titulo-buscar-palabras" id="titulo-buscar-palabras">
                Busca las siguientes palabras:
        </p>
            <div>
                <div className='listaPalabras' id="listaPalabras">
                    {(arrayPalabrasCorrectas !== null && arrayPalabrasCorrectas !== undefined && arrayPalabrasCorrectas.length !== 0) ? arrayPalabrasCorrectas.map(function (arrayLetras, index) {
                        return <p key={index} className="listado-palabras">{pasarLetrasAPalabra(arrayLetras)}</p>
                    }) : ''}
                </div>
            </div>
            {juegoTerminado ? <PantallaFinDeJuego /> : ''}
        </div>
    )
}

export default ListadoPalabrasBuscar;