import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrarAmbiente from './components/RegistrarAmbiente';
import Home from './pages/Home';

function App() {

  return (
    <Home>
        <RegistrarAmbiente />
    </Home>
  );
}

export default App;
