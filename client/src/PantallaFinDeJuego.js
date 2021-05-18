import { useState, useEffect } from "react";
let emailUsuario = localStorage.getItem("email");


function PantallaFinDeJuego() {

    let [users, setUsers] = useState([]);
    let [tiempoAdmin, setTiempoAdmin] = useState({});
    let [estadisticas, setEstadisticas] = useState();
    let [mensajeEstadisticas, setMensajeEstadisticas] = useState();


    useEffect(() => {
        actualizarPartidaFinalizada();
    }, [])


    function actualizarPartidaFinalizada() {
        let fetchData = {
            method: "PUT",
            body: JSON.stringify({ estado: "finalizada", emailUsuario: emailUsuario }),
            headers: {
                'content-type': 'application/json; charset = UTF-8'
            }
        }

        fetch('http://localhost:9000/tablero/partidafinalizada', fetchData)
            .then(res => {
                res.json();

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
    return (
        <div>
            {estadisticas}
            {mensajeEstadisticas}
        </div>
    )
}
export default PantallaFinDeJuego;