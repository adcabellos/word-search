import './App.css';
import './Style.css';
import './styleHeaderFooter.css';
import "./sopaDeLetras.css";
import SopaDeLetras from "./SopaDeLetras";
import Admin from './Admin';
import Login from './Login';
import { BrowserRouter, Route } from 'react-router-dom';
import PantallaFinDeJuego from './PantallaFinDeJuego';
import Header from './Header';
import Footer from './Footer';

function App() {



  return (

    <BrowserRouter>
    <Header />
      <Route exact path='/'>
        <Login />
      </Route>
      <Route exact path='/sopadeletras/:activa'>
        <SopaDeLetras />
      </Route>
      <Route exact path='/sopadeletras/'>
        <SopaDeLetras />
      </Route>
      <Route exact path="/tablero/anyadirPalabras">
        <Admin />
      </Route>
      <Route exact path='/estadisticas'>
        <PantallaFinDeJuego />
      </Route>
      <Footer />
    </BrowserRouter>

  )

}

export default App;
