import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
// import { use } from "../../api/routes/login";
import gameover from './gameover.png'


function CuentaAtras(props) {
    let ocultarTablero = true;
    let juegoTerminado = props.juegoTerminado;
    let palabraTerminada = props.palabraTerminada;
    let [users, setUsers] = useState([]);
    let [tiempoAdmin, setTiempoAdmin] = useState({});
    let [estadisticas, setEstadisticas] = useState();
    let [mensajeEstadisticas, setMensajeEstadisticas] = useState();
    let [boton, setBoton] = useState(false);
   

    let [seconds, setSeconds] = useState();
    let [minutes, setMinutes] = useState();
    let [segundos, setSegundos] = useState();
    let [botonPausa, setBotonPausa] = useState('PAUSA');
    let [activarBoton, setActivarBoton] = useState(true);
    let [recSeconds, setRecSeconds] = useState();
    let [recMinutes, setRecMinutes] = useState();
    let [count, setCount] = useState(0);
    let [recCount, setRecCount] = useState(0);
    let [totalWords, setTotalWords] = useState(0);
    let [flag, setFlag] = useState(true);

    let emailUsuario = localStorage.getItem("email");


    useEffect(() => {
        
        if (props.arrayPalabrasCorrectas.length > 0) {

            props.arrayPalabrasCorrectas.forEach(palabra => {
                if (palabra[0].resuelta === true)
                    setTotalWords(totalWords + 1);
            });
        }
    }, [props.arrayPalabrasCorrectas])

    useEffect(() => {

        if (props.activa !== "" && props.temporizadorRecuperado !== "") {
            if (recCount <= 0) {
                let minutosRecuperados = props.temporizadorRecuperado.pausaMinutos;
                let segundosRecuperados = props.temporizadorRecuperado.pausaSegundos;
                setRecMinutes(minutosRecuperados)
                setRecSeconds(segundosRecuperados)
                setRecCount(recCount + 1)
            }
        } else {
            if (count <= 0) {
                recogerTemporizador()
                setCount(count + 1)
            }
        }

    }, [seconds, recSeconds]);

    function recogerTemporizador() {

        fetch('http://localhost:9000/colecciones/crearTemporizador')
            .then(res => res.json())
            .then(data => {

                setMinutes(data.crearTemporizador[0].tiempo.minutos);
                setSeconds(data.crearTemporizador[0].tiempo.segundos);

            })
    }


    useEffect(() => {
        if (juegoTerminado == true) {
            putFetchTiempo();

        }
    }, [juegoTerminado, totalWords])

    useEffect(() => {
        if (totalWords !== 0) {

            putFetchTiempo();
        }
    }, [palabraTerminada, totalWords])

    function esconderTablero() {
        
        
        setBoton(true)
        document.getElementById('sopadeletras').style.visibility = 'hidden';
        document.getElementById('listaPalabras').style.visibility = 'hidden';
        document.getElementById('titulo-buscar-palabras').style.visibility = 'hidden';
        document.getElementById("mensaje-tiempo").innerHTML = "El tiempo se ha terminado."

        
            fetch('http://localhost:9000/usuarios/recogerestadisticas')
            .then(res => res.json())
            .then(data => {
                setUsers(data.datosUser);

                fetch('http://localhost:9000/admin/recogertiempoadmin')
                .then(res => res.json())
                .then(datos => {
                    setTiempoAdmin(datos.tiempoAdmin);
                    estadisticasUsuario(data.datosUser, datos.tiempoAdmin)
                })
            })
            
    }

    function estadisticasUsuario(userData, timeAdmin) {
        let cont = 0;
        let totalWords;
        let maxTime;
        let remainingTime;

        let estadisticaUser = emailUsuario;
        let minutosAdmin = timeAdmin[0].tiempo.minutos;
        let segundosAdmin = timeAdmin[0].tiempo.segundos;

        maxTime = minutosAdmin * 60 + segundosAdmin;

        userData.forEach((user) => {
            if (user.email == estadisticaUser) {
                totalWords = user.boardState.length
                remainingTime = user.temporizador.pausaMinutos * 60 + user.temporizador.pausaSegundos;
                user.boardState.forEach(palabra => {
                    if (palabra[0].resuelta === true)
                        cont++;
                });
            }
        })
        formulaPuntuacion(cont, totalWords, maxTime, remainingTime)
    }

    function formulaPuntuacion(solvedWords, totalWords, maxTime, remainingTime) {
        let maxPoints = 1000;

        let points = maxPoints * ((0.5 * (solvedWords / totalWords)) + (0.5 * (remainingTime / maxTime)));
        points = Math.round(points)
        setEstadisticas(<p>Has encontrado {solvedWords} palabra/s de {totalWords} en un tiempo total de {maxTime - remainingTime} segundos. Has obtenido una puntuación de {points} puntos.</p>)
       
        if (points < 500) {
            setMensajeEstadisticas(<p>Necesitas mejorar.</p>)
        } else {
            setMensajeEstadisticas(<p>Genial, vas por buen camino.</p>)
        }
    }


    let timer = '';
    useEffect(() => {

        if (props.temporizadorRecuperado === "") {

            if (activarBoton == true && juegoTerminado == false) {
               

                timer =
                    seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
                if (seconds < 10) {
                    setSegundos('0');

                } else {
                    setSegundos();
                }
                if (seconds == 0 && minutes > 0) {
                    window.setTimeout(() => {
                        setSeconds(59);
                        setMinutes(minutes - 1);
                    }, 1000);

                    if (minutes >= 0 && seconds > 0) {
                        seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
                        if (minutes == 0 && seconds == 0) {
                            
                            setSeconds(0);
                            setMinutes(0);
                            esconderTablero()

                        }
                    }

                }
            }

        }

        return () => clearInterval(timer);

    }, [seconds, activarBoton, juegoTerminado]);

    useEffect(() => {

        if (props.temporizadorRecuperado !== "") {

            if (activarBoton == true && juegoTerminado == false) {
              

                timer =
                    recSeconds > 0 && setInterval(() => setRecSeconds(recSeconds - 1), 1000);
                if (recSeconds < 10) {
                    setSegundos('0');

                } else {
                    setSegundos();
                }
                if (recSeconds == 0 && recMinutes > 0) {
                    window.setTimeout(() => {
                        setRecSeconds(59);
                        setRecMinutes(recMinutes - 1);
                    }, 1000);

                    if (recMinutes >= 0 && recSeconds > 0) {
                        recSeconds > 0 && setInterval(() => setRecSeconds(recSeconds - 1), 1000);
                        
                    }

                }
            }

        }

        return () => clearInterval(timer);

    }, [recSeconds, activarBoton, juegoTerminado]);
    
    useEffect(() => {
        if (recMinutes == 0 && recSeconds == 0) {
            if(ocultarTablero == true){
                ocultarTablero = false;
                setRecSeconds(0);
                setRecMinutes(0);
                esconderTablero()
            }
        }
    })

    function putFetchTiempo() {

        let tiempoRestante;


        if (props.temporizadorRecuperado !== "") {
            tiempoRestante = {
                minutes: recMinutes,
                seconds: recSeconds,
                emailUsuario: emailUsuario
            }
        } else {
            tiempoRestante = {
                minutes: minutes,
                seconds: seconds,
                emailUsuario: emailUsuario
            }
        }

        let fetchData = {
            method: "PUT",
            body: JSON.stringify(tiempoRestante),
            headers: {
                'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
            },
        }

        if (seconds !== undefined || recSeconds !== undefined) {


            fetch('http://localhost:9000/tablero/pausaTemporizador', fetchData)
                .then(respuesta =>
                    respuesta.json()
                )
                .then(datos => {
                    // alert(datos.mensaje)
                })
        }
    }

    function pausa() {
        if (botonPausa == 'PAUSA') {
            setActivarBoton(false);
            setBotonPausa('REANUDAR');

            putFetchTiempo();

            document.getElementById('sopadeletras').style.visibility = 'hidden';
            document.getElementById('listaPalabras').style.visibility = 'hidden';
            document.getElementById('titulo-buscar-palabras').style.visibility = 'hidden';
            document.getElementById("mensaje-tiempo").innerHTML = "El tiempo se ha pausado. Haz click en reanudar cuando estes listo/a para continuar."


           

        } else if (botonPausa == 'REANUDAR') {

            // window.setTimeout(() => {
            //     setSeconds(seconds - 1);
            // }, 1000);

            setBotonPausa('PAUSA');
            setActivarBoton(true);
            document.getElementById('sopadeletras').style.visibility = 'visible';
            document.getElementById('listaPalabras').style.visibility = 'visible';
            document.getElementById('titulo-buscar-palabras').style.visibility = 'visible';
            document.getElementById("mensaje-tiempo").innerHTML = ""

        }
    }

    if (minutes === 0 && seconds === 0) {
        
        finalTemporizador()
    }

    useEffect(()=>{
        if(minutes === 0 && seconds === 0){
          
            esconderTablero()
        }
    },[minutes, seconds])

    function finalTemporizador() {

        let tiempoFinal = {
            minutes: minutes,
            seconds: seconds,
            emailUsuario: emailUsuario
        }
        let fetchData = {
            method: "PUT",
            body: JSON.stringify(tiempoFinal),
            headers: {
                'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
            },
        }

        fetch('http://localhost:9000/tablero/finTemporizador', fetchData)
            .then(respuesta =>
                respuesta.json()
            )
        // .then(datos => {
        //     alert(datos.mensaje)
        // })

    }
    return (
        <div className="temporizador-div"> 
        <div className="countdownDiv">
            <div className='countdown'>TIEMPO: 0{props.temporizadorRecuperado !== "" ? recMinutes : minutes} : {segundos}{props.temporizadorRecuperado !== "" ? recSeconds : seconds}</div>
            <button onClick={pausa} disabled={boton} id="pausa" type="button" name="button">{botonPausa}</button>
        </div>
        <div id="mensaje-tiempo"></div>
        <div>
            {estadisticas}
            {mensajeEstadisticas}
        </div>
        </div>
    );
}
export default CuentaAtras;
