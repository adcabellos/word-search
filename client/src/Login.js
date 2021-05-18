import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Login() {
    let [email, setEmail] = useState('');
    let [pass, setPass] = useState('');
    let estadoPartida = "";
    localStorage.setItem("email", email);
    let emailUsuario = localStorage.getItem("email");

    function recogerDatos(e) {
        switch (e.target.name) {
            case 'emailUsuario':
                setEmail(e.target.value);
                break;
            case 'passUsuario':
                setPass(e.target.value);
                break;
        }
    }
    function iniciarSesión() {
        let data = { correo: email, contrasenia: pass };
        let fetchData = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json; charset = UTF-8'
            }
        }
        fetch('http://localhost:9000/login', fetchData)
            .then(res => res.json())
            .then(datos => {
                if (datos.mensaje == 'login') {
                    if (email == 'admin@admin.com') {
                        // alert('¡Bienvenido/a admin!');
                        window.location.href = 'http://localhost:3000/tablero/anyadirPalabras';
                    } else {
                        fetch(`http://localhost:9000/usuarios/estadopartida/${emailUsuario}`)
                            .then(res => res.json())
                            .then(datos => {
                                estadoPartida = datos.enviarEmail[0].estado;
                                console.log('estado partida', estadoPartida);
                                if (estadoPartida != 'activa'){
                                    window.location.href = 'http://localhost:3000/sopadeletras'
                                } else {
                                    window.location.href = 'http://localhost:3000/sopadeletras/activa'
                                }
                            })
                    }
                } else {
                    alert(datos.mensaje);
                }
            }
            )
    }
    return (
        <>
            <div id="login">
                <p className="tituloLogin">Login</p>
                <input type="text" name="emailUsuario" id="emailUsuario" placeholder="Email" onChange={recogerDatos} />
                <input type="password" name="passUsuario" id="passUsuario" placeholder="Contraseña" onChange={recogerDatos} />
                <div>
                    <div id="iniciodesesion">
                        <button id="iniciosesion" onClick={iniciarSesión}>Inicia sesión</button>
                    </div>
                    <div id='selector'></div>
                </div>
            </div>
        </>
    )
}
export default Login;