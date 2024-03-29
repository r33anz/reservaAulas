import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Buscar from './components/Busquedanombre/Buscar';
import Fecha from './components/Busquedanombre/fecha';
import RegistrarAmbiente from './components/RegistrarAmbiente';

function App() {

  return (
    <Home>
      <Buscar></Buscar>
      
    </Home>

  );
}

export default App;
