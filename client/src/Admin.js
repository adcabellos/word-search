import { useState, useEffect } from 'react';

function Admin() {
    let [palabras, setPalabras] = useState('');
    let [arrayNombres, setArrayNombres] = useState([]);
    let [boton, setBoton] = useState(false);
    let [botonSopa, setBotonSopa] = useState(true);
    let [minutes, setMinutes] = useState();
    let [seconds, setSeconds] = useState();
    let [users, setUsers] = useState([]);
    let emailUsuario = localStorage.getItem("email");
    let [estadisticas, setEstadisticas] = useState();
    let [tiempoAdmin, setTiempoAdmin] = useState({});
    let [mensajeEstadisticas, setMensajeEstadisticas] = useState();

    let pintarNombres;

    function introducirDatos(event) {

        switch (event.target.name) {
            case 'word':
                setPalabras(event.target.value.toUpperCase());
                break;
            case 'minutes':
                setMinutes(event.target.value);
                break;
            case 'seconds':
                setSeconds(event.target.value)
                break;

        }
    }

    function incluirPalabra() {
        if (palabras === '') {
            document.getElementById("introducePalabra").innerHTML = "Introduce una palabra."        
        } else {
            document.getElementById("introducePalabra").innerHTML = "" 
            setArrayNombres([...arrayNombres, palabras])
        }
        if (arrayNombres.length >= 7) {
            setBoton(true)
        } else {
            setBoton(false)
        }
        setPalabras('')
    }
    pintarNombres = arrayNombres.map((palabra, index) => {
        return (

            <p className="listado-palabras" >{palabra}</p>
        )
    })
    function guardarDatos() {
        if (arrayNombres === "" || minutes === undefined || seconds === undefined) {
            document.getElementById("palabra").innerHTML = "Por favor, rellena todos los campos."
        } else {
            document.getElementById("palabra").innerHTML = ""
            setBotonSopa(false)
            let newData = {
                palabras: arrayNombres,
                minutes: parseInt(minutes),
                seconds: parseInt(seconds)
            }
            let fetchData = {
                method: 'PUT',
                body: JSON.stringify(newData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8' // Indicates the content
                },
            }
            fetch('http://localhost:9000/colecciones/crearTablero', fetchData)
                .then(respuesta =>
                    respuesta.json()
                )
        }
    }

    useEffect(() => {

        fetch('http://localhost:9000/usuarios/recogerestadisticas')
            .then(res => res.json())
            .then(data => {
                setUsers(data.datosUser);
            })
        fetch('http://localhost:9000/admin/recogertiempoadmin')
            .then(res => res.json())
            .then(data => {
                setTiempoAdmin(data.tiempoAdmin);
            })
    }, []);
    ;

    function estadisticasUsuario(event) {
        let cont = 0;
        let totalWords;
        let maxTime;
        let remainingTime;
        let estadoPartida;

        let estadisticaUser = event.target.value;
        let minutosAdmin = tiempoAdmin[0].tiempo.minutos;
        let segundosAdmin = tiempoAdmin[0].tiempo.segundos;

        maxTime = minutosAdmin * 60 + segundosAdmin;

        users.forEach((user) => {
            if (user.email == estadisticaUser) {
                totalWords = user.boardState.length;
                estadoPartida = user.estado;
                remainingTime = user.temporizador.pausaMinutos * 60 + user.temporizador.pausaSegundos;
                user.boardState.forEach(palabra => {
                    if (palabra[0].resuelta === true)
                        cont++;
                });
            }
        })
        formulaPuntuacion(cont, totalWords, maxTime, remainingTime, estadisticaUser, estadoPartida)
    }

    function formulaPuntuacion(solvedWords, totalWords, maxTime, remainingTime, estadisticaUser, estadoPartida) {
        let maxPoints = 1000;

        let points = maxPoints * ((0.5 * (solvedWords / totalWords)) + (0.5 * (remainingTime / maxTime)));
        // alert(points);
        points = Math.round(points)
        setEstadisticas(<p>El estado de la partida de {estadisticaUser} es {estadoPartida}. Ha encontrado {solvedWords} palabra/s de {totalWords} en un tiempo total de {maxTime - remainingTime} segundos. Ha obtenido una puntuación de {points} puntos.</p>)
        if (points < 500) {
            setMensajeEstadisticas(<p>Necesitas mejorar.</p>)
        } else {
            setMensajeEstadisticas(<p>Genial, vas por buen camino.</p>)
        }

    }

    return (
        <>
            <div id='adminContainer'>
                <p className="admin-title">Introduce 8 palabras para tu sopa de letras (máximo 10 caracteres):</p>

                <input type='text' minLength="1" maxLength="10" onChange={introducirDatos} name='word' id='word' value={palabras} placeholder='Introduce una palabra' />

                <button className="iniciosesion" type='submit' disabled={boton} onClick={incluirPalabra} id='botonAceptarPalabras'>Aceptar</button>

                <p id="introducePalabra"> </p>

                <div className="listaPalabras">{pintarNombres}</div>

                <p className="admin-title">Introduce el tiempo de juego:</p>

                <input type='number' min="0" pattern="^[0-9]+" onChange={introducirDatos} name='minutes' id='minutes' value={minutes} placeholder='Introduce los minutos' />

                <input type='number' min="0" pattern="^[0-9]+" onChange={introducirDatos} name='seconds' id='seconds' value={seconds} placeholder='Introduce los segundos' />

                <button className="iniciosesion" onClick={guardarDatos}>Crear sopa de letras</button>

                <p id="palabra"> </p>
                
                <a hidden={botonSopa} href="http://localhost:3000/sopadeletras" class="boton-sopa"> Ir a la sopa </a>

                <p className="admin-title">Consulta las estadísticas de tus usuarios:</p>

                <select name="estadisticas" id="estadisticas" onChange={estadisticasUsuario}>
                    {users.map((user, key) => {
                        return (
                            <option value={user.email} name="datosUsuario">{user.email}</option>
                        )
                    })
                    }
                </select>

                {estadisticas}

            </div>
        </>
    )

}



export default Admin;