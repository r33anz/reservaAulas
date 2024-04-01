import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { buscarAmbientePorNombre, modificarPerio } from '../../services/ModificarPeriodo.service';
import './stily.css';

const Modificarperdiodo = () => {
    const [nombreAmbiente, setNombreAmbiente] = useState(''); // Estado para almacenar el nombre del ambiente
    const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
    const [periodosOptions, setPeriodosOptions] = useState([]); // Estado para almacenar las opciones de periodo
    const [resultados, setResultados] = useState([]); // Estado para almacenar los resultados de la consulta
    const [fecha, setFecha] = useState(''); // Estado para almacenar la fecha seleccionada
    const [aula, setAula] = useState(''); // Estado para almacenar el aula seleccionada
    const [periodo, setPeriodo] = useState(''); // Estado para almacenar el periodo seleccionado
    const [idAmbiente, setId] = useState(''); // Estado para almacenar el ID del ambiente
    const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre del ambiente
    const [periodosSeleccionados, setPeriodosSeleccionados] = useState([]); // Estado para almacenar los periodos seleccionados

    // Función para buscar ambientes por nombre
    const buscarAmbiente = (nombre) => {
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
    };

    // Función para modificar periodo
    const modifica = () => {
        modificarPerio()
            .then(data => {
                // Obtener solo la hora inicial de cada periodo y actualizar las opciones de periodo
                setPeriodosOptions(data);
                console.log(periodosOptions);
            })
            .catch(error => {
                console.log('Error al buscar los ambientes:', error);
                setPeriodosOptions([]); // Limpiar las opciones de periodo en caso de error
            });
    };

    // Función para manejar el cambio en el campo de búsqueda de ambiente
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setNombreAmbiente(newValue); // Actualizar el estado con el nuevo valor del campo de entrada
        buscarAmbiente(newValue); // Realizar la búsqueda de ambientes automáticamente cada vez que cambia el valor del campo de entrada
    };

    // Función para manejar la selección de una opción de ambiente
    const handleOptionSelect = (selectedId, selectedNombre) => {
        setId(selectedId);
        setNombre(selectedNombre);
        setNombreAmbiente(selectedNombre);
        setAmbienteOptions([]); // Limpiar las opciones de ambiente después de seleccionar una
    };

    const handleConsultarClick = () => {
        // Verificar que se haya seleccionado un ambiente y que se haya ingresado una fecha
        if (idAmbiente && fecha) {
            // Aquí puedes usar el ID del ambiente (almacenado en el estado 'id') y la fecha (almacenada en el estado 'fecha')
            console.log("ID del ambiente:", idAmbiente);
            console.log("Fecha ingresada:", fecha);
            
            // Aquí puedes realizar cualquier otra operación que necesites con el ID y la fecha, como enviarlos a un servicio para obtener resultados específicos, etc.
    
        } else {
            console.log("Debes seleccionar un ambiente e ingresar una fecha para realizar la consulta.");
        }
    };

    return (
        <div className="buscar-container">
            <h1 className='bb'>Modifica ambiente por periodo</h1>
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
            <div className='fecha'>
            <label  htmlFor="fecha-input">Fecha:</label>
                <input
                    type="date"
                    id="fecha-input"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </div >
            <Button className="consultar-button" onClick={handleConsultarClick}>Consultar</Button>
            <div className="periodos-container">
            <h1>Periodos:</h1>
                <div>
                    <input
                        type="checkbox"
                        id="periodo1"
                        name="periodo1"
                        value="periodo1"
                    />
                    <label htmlFor="periodo1">6:45-8:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo2"
                        name="periodo2"
                        value="periodo2"
                    />
                    <label htmlFor="periodo2">8:15-9:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo3"
                        name="periodo3"
                        value="periodo3"
                    />
                    <label htmlFor="periodo3">9:45-11:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo4"
                        name="periodo4"
                        value="periodo4"
                    />
                    <label htmlFor="periodo4">11:15-12:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo5"
                        name="periodo5"
                        value="periodo5"
                    />
                    <label htmlFor="periodo5">12:45-14:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo6"
                        name="periodo6"
                        value="periodo6"
                    />
                    <label htmlFor="periodo6">14:15-15:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo7"
                        name="periodo7"
                        value="periodo7"
                    />
                    <label htmlFor="periodo7">15:45-17:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo8"
                        name="periodo8"
                        value="periodo8"
                    />
                    <label htmlFor="periodo8">17:15-16:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo9"
                        name="periodo9"
                        value="periodo9"
                    />
                    <label htmlFor="periodo9">16:45-20:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="periodo10"
                        name="periodo10"
                        value="periodo10"
                    />
                    <label htmlFor="periodo10">20:15-21:45</label>
                </div>
                {/* Agrega más periodos aquí si es necesario */}
            </div>
        </div>
    );
    
};

export default Modificarperdiodo;
