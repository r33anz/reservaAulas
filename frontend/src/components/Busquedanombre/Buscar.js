import React, { useState } from "react";
import { Button } from 'react-bootstrap';
import { buscarAmbientePorNombre ,recuperarAmbientePorID} from '../../services/Busqueda.service';


import './Style.css';

const Buscar = () => {
  const [nombreAmbiente, setNombreAmbiente] = useState(''); // Estado para almacenar el nombre del ambiente
  const [ambienteDetails, setAmbienteDetails] = useState(null); // Estado para almacenar los detalles del ambiente
  const [id, setId] = useState(''); // Estado para almacenar el id del ambiente
  const [nombre, setNombre] = useState('');

  // Función para buscar el ambiente
  const buscarAmbiente = (nombre) => {
    buscarAmbientePorNombre(nombre)
      .then(data => {
        const idValue = data.respuesta[0].id;
        const nombreValue = data.respuesta[0].nombre;

        // Actualizar estados con los valores obtenidos
        setId(idValue);
        setNombre(nombreValue);

        setAmbienteDetails(data); // Establecer los detalles del ambiente en el estado
       //console.log(data);

        // Extraer el id y el nombre del objeto data y almacenarlos en las variables id y nombre
        
      })
      .catch(error => {
       // console.log('Error al buscar el ambiente:', error);
        setAmbienteDetails(null); // Limpiar los detalles del ambiente en caso de error
      });
  };

  const recuperar = (id) => {
    console.log("ssssss");
    recuperarAmbientePorID(id)
      .then(data => {
        // Actualizar estados con los valores obtenidos
        //setAmbienteDetails(data); // Establecer los detalles del ambiente en el estado
        console.log(data);

        // Extraer el id y el nombre del objeto data y almacenarlos en las variables id y nombre
        
      })
      .catch(error => {
        console.log('Error al buscar el ambiente:', error);
        setAmbienteDetails(null); // Limpiar los detalles del ambiente en caso de error
      });
  };



  // Función para manejar el cambio en el campo de entrada
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setNombreAmbiente(newValue); // Actualizar el estado con el nuevo valor del campo de entrada
    buscarAmbiente(newValue); // Realizar la búsqueda del ambiente automáticamente cada vez que cambia el valor del campo de entrada
  };

  return (
    <div className="buscar-container">
      <h1 className='bb'>Búsqueda por nombre</h1>
      <div className="search-field">
        <label htmlFor="buscar-input">Nombre del ambiente:</label>
        <input 
          type="text" 
          id="buscar-input" 
          value={nombreAmbiente}
          onChange={handleInputChange} // Llamar a la función handleInputChange cuando cambie el valor del campo de entrada
        />
        <Button 
          className="btn RegistrarAmbiente-button-register" 
          size="sm" 
          style={{ marginLeft: '30px' }}
          onClick={() => recuperar(id)
          } // Llamar a la función buscarAmbiente cuando se hace clic en el botón de búsqueda
        >
          Buscar
        </Button>
      </div>
      {/* Mostrar los detalles del ambiente si están disponibles */}
      {ambienteDetails && (
        <div className="ambiente-details">
          <h2>Detalles del ambiente {nombreAmbiente}</h2>
          {/* Mostrar los detalles del ambiente según la estructura de datos que se reciba */}
          {/* Por ejemplo: */}
          <p>Capacidad: {ambienteDetails.capacidad}</p>
          <p>Tipo de ambiente: {ambienteDetails.tipo}</p>
          <p>Piso: {ambienteDetails.piso}</p>

          {/* Mostrar el id y el nombre del ambiente */}
          <p>ID del ambiente: {id}</p>
          <p>Nombre del ambiente: {nombre}</p>
        </div>
      )}
    </div>
  );
};

export default Buscar;




