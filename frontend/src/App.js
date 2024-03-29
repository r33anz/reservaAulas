import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';
import Buscar from './components/Busquedanombre/Buscar';
import RegistrarAmbiente from './components/RegistrarAmbiente';

function App() {

  return (
    <Home>
      <AlertsProvider>
        <RegistrarAmbiente />
      </AlertsProvider>
      <Buscar></Buscar>
    </Home>

  );
}

export default App;
