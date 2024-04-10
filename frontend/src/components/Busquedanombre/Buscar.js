import React, { useState, useEffect, useRef } from "react";
import { buscarAmbientePorNombre, recuperarAmbientePorID } from '../../services/Busqueda.service';
import './Style.css';

const Buscar = () => {
  const [nombreAmbiente, setNombreAmbiente] = useState(''); // Estado para almacenar el nombre del ambiente
  const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
  const [ambienteDetails, setAmbienteDetails] = useState(null); // Estado para almacenar los detalles del ambiente
  // (FIX:Marco) 'id' is assigned a value but never used
  // eslint-disable-next-line
  const [id, setId] = useState(''); // Estado para almacenar el id del ambiente
  // (FIX:Marco) 'nombre' is assigned a value but never used 
  // eslint-disable-next-line
  const [nombre, setNombre] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1); // Estado para rastrear el índice de la opción seleccionada
  const containerRef = useRef(null);

  const optionsContainerRef = useRef(null); // Referencia al contenedor de opciones

  // Función para buscar los ambientes que coinciden con el nombre
  const buscarAmbiente = (nombre) => {
    if (nombre.trim() !== '') {
      buscarAmbientePorNombre(nombre)
        .then(data => {
          setAmbienteOptions(data.respuesta); // Actualizar las opciones de ambiente con los datos obtenidos
          setSelectedOptionIndex(-1); // Reiniciar el índice de la opción seleccionada al buscar nuevamente
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
    console.log(nombreAmbiente.length);
    const newValue = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
    setNombreAmbiente(newValue);
    buscarAmbiente(newValue);
    }
  };

  // Manejar eventos de teclado para la navegación de opciones
  const handleKeyDown = (e) => {
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedOptionIndex(prevIndex => Math.max(prevIndex - 1, 0)); // Mover hacia arriba y no por debajo de 0
      scrollIntoViewarriba();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedOptionIndex(prevIndex => Math.min(prevIndex + 1, ambienteOptions.length - 1)); // Mover hacia abajo y no más allá del último índice
      scrollIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById("buscar-input").blur();
      // Si no se ha seleccionado ninguna opción con las flechas, seleccionar la primera opción si está disponible
      if (selectedOptionIndex === -1 && ambienteOptions.length > 0) {
        handleOptionSelect(ambienteOptions[0].id, ambienteOptions[0].nombre, 0);
        
      } else if (selectedOptionIndex >= 0 && selectedOptionIndex < ambienteOptions.length) {
        handleOptionSelect(ambienteOptions[selectedOptionIndex].id, ambienteOptions[selectedOptionIndex].nombre, selectedOptionIndex);
      }
    }
  };
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Realiza la misma lógica que en el caso de 'Enter' dentro de handleKeyDown
      document.getElementById("buscar-input").blur();
      setNombreAmbiente(nombre);
    }
  });
  // Función para hacer scroll al elemento seleccionado
  const scrollIntoView = () => {
    if (optionsContainerRef.current && selectedOptionIndex >= 0) {
      const selectedOptionElement = optionsContainerRef.current.childNodes[selectedOptionIndex];
      selectedOptionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollIntoViewarriba = () => {
    if (optionsContainerRef.current && selectedOptionIndex >= 0) {
      const selectedOptionElement = optionsContainerRef.current.childNodes[selectedOptionIndex];
      selectedOptionElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const handleInputFocus = () => {
    // Aquí puedes ejecutar la lógica que deseas cuando el input recibe el foco
    if(nombreAmbiente.length > 0){
      buscarAmbiente(nombreAmbiente);
    console.log("El input ha recibido el foco.");
    }
  };

  useEffect(() => {
    function handleClickOutside() {
      setAmbienteOptions([]); // Limpiar las opciones de ambiente al hacer clic fuera del campo
    }

    // Agregar un event listener para hacer clic fuera del campo de entrada
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Función para seleccionar un ambiente de la lista de opciones
  const handleOptionSelect = (selectedId, selectedNombre, index) => {
    setId(selectedId);
    setNombre(selectedNombre);
    setNombreAmbiente(selectedNombre);
    setAmbienteOptions([]); // Limpiar las opciones de ambiente después de seleccionar una
    setSelectedOptionIndex(index); // Actualizar el índice de la opción seleccionada
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
    <div className="buscarcontainer">
      <h1 className='titulo'>Búsqueda por nombre</h1>
      <div className="search-field">
        <label htmlFor="buscar-input">Nombre del ambiente:</label>
        <input
          type="text"
          id="buscar-input"
          value={nombreAmbiente}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown} // Manejar eventos de teclado
        />
        {nombreAmbiente.length > 0 && (
          <div className="optionscontainer" ref={optionsContainerRef}>
            {ambienteOptions.map((option, index) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.nombre, index)}
                className={index === selectedOptionIndex ? 'selected' : 'option1'}
              >
                {option.nombre}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Mostrar los detalles del ambiente si están disponibles */}
      {ambienteDetails && (
        <div className="ambientedetails">
          <h1>Detalle</h1>
          <div className="datos">
            <p>Nombre: {ambienteDetails.nombre}</p>
            <p>Capacidad: {ambienteDetails.capacidad}</p>
            <p>Tipo de Ambiente: {ambienteDetails.tipo}</p>
            <p>Bloque: {ambienteDetails.nombreBloque}</p>
            <p>Piso: {ambienteDetails.nroPiso}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buscar;