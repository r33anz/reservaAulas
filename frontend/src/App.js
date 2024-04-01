import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Buscar from './components/Busquedanombre/Buscar';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import Fecha from './components/Busquedanombre/fecha';
import RegistrarAmbiente from './components/RegistrarAmbiente';

function App() {

  return (
    <Home>
      <ModificarPeriodo></ModificarPeriodo>
      
    </Home>

  );
}

export default App;
