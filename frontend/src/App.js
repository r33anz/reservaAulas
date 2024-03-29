import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Calendario from './components/Calendario';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import Buscar from './components/Busquedanombre/Buscar';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';

function App() {

  return (
    <Home>
      <AlertsProvider>
        <ModificarPeriodo />
      </AlertsProvider>
      <Calendario />
      <Buscar></Buscar>
      <RegistrarAmbiente />
    </Home>

  );
}

export default App;
