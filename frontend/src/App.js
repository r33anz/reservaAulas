import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Calendario from './components/Calendario';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import Buscar from './components/Busquedanombre/Buscar';
import ModificarPeriodo from './components/ModificarPorPeriodo/ModicarPeriodo';
import RegistrarAmbiente from './components/RegistrarAmbiente';

function App() {

  return (
    <Home>
      <AlertsProvider>
      <Buscar/>
      </AlertsProvider>
        <Calendario />
    </Home>

  );
}

export default App;
