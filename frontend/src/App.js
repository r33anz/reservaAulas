import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Home from './pages/Home';
import { AlertsProvider } from './components/Alert/AlertsContext';

function App() {

  return (
    <Home>
      <AlertsProvider>
        <RegistrarAmbiente />
      </AlertsProvider>
    </Home>
  );
}

export default App;
