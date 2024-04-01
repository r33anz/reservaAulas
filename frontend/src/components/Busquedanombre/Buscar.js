import React, { useState, useEffect } from "react";
import { buscarAmbientePorNombre, recuperarAmbientePorID } from '../../services/Busqueda.service';
import { Button } from 'react-bootstrap';
import './Style.css';

const Buscar = () => {
  const [nombreAmbiente, setNombreAmbiente] = useState(''); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [ambienteDetails, setAmbienteDetails] = useState(null); // Estado para almacenar los detalles del ambiente
  const [id, setId] = useState(''); // Estado para almacenar el id del ambiente
  const [nombre, setNombre] = useState('');

  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = (nombre) => {
    if (nombre.trim() !== '') {
      buscarAmbientePorNombre(nombre)
        .then(data => {
          const idValue = data.respuesta[0].id;
          const nombreValue = data.respuesta[0].nombre;

          // Actualizar estados con los valores obtenidos
          setId(idValue);
          setNombre(nombreValue);
          setAmbienteOptions(data.respuesta); // Actualizar las opciones de ambiente con los datos obtenidos
        })
        .catch(error => {
          console.log('Error al buscar los ambientes:', error);
          setAmbienteOptions([]); // Limpiar las opciones de ambiente en caso de error
        });
    } else {
      // Si el input está vacío, limpiar las opciones de ambiente
      setAmbienteOptions([]);
    }
  };

  // Función para manejar el cambio en el campo de entrada
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setNombreAmbiente(newValue); // Actualizar el estado con el nuevo valor del campo de entrada
    buscarAmbiente(newValue); // Realizar la búsqueda de ambientes automáticamente cada vez que cambia el valor del campo de entrada
  };

  // Función para seleccionar un ambiente de la lista de opciones
  const handleOptionSelect = (selectedId, selectedNombre) => {
    setId(selectedId);
    setNombre(selectedNombre);
    setNombreAmbiente(selectedNombre);
    setAmbienteOptions([]); // Limpiar las opciones de ambiente después de seleccionar una
    
    recuperar(selectedId);
  };


  // Recuperar los datos del ambiente por su ID
  const recuperar = (id) => {
    recuperarAmbientePorID(id)
      .then(data => {
        // Actualizar estado con los detalles del ambiente
        setAmbienteDetails(data);
      })
      .catch(error => {
        console.log('Error al buscar el ambiente:', error);
        setAmbienteDetails(null); // Limpiar los detalles del ambiente en caso de error
      });
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
          onChange={handleInputChange} 
        />
        {ambienteOptions.length > 0 && (
          <div className="options-container">
            {ambienteOptions.map(option => (
              <div 
                key={option.id} 
                onClick={() => handleOptionSelect(option.id, option.nombre)}
                className="option"
              >
                {option.nombre}
              </div>
            ))}
          </div>
          
        )}
        
      </div>
      {/* Mostrar los detalles del ambiente si están disponibles */}
      {ambienteDetails && (
        <div className="ambiente-details">
          <h1>Detalle</h1>
          <p>nombre: {ambienteDetails.nombre}</p>
          <p>Capacidad: {ambienteDetails.capacidad}</p>
          <p>Tipo de ambiente: {ambienteDetails.tipo}</p>
          <p>Piso: {ambienteDetails.piso}</p>
          {/* Mostrar el id y el nombre del ambiente */}
          
        </div>
      )}
      
    </div>
  );
};

export default Buscar;
