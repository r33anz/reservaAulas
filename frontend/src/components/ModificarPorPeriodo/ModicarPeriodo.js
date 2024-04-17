import React, { useCallback, useState, useContext,useEffect, useRef  } from 'react';
import { Button } from 'react-bootstrap';
import { buscarAmbientePorNombre, modificarPerio ,estadoinhabilitado,habilita} from '../../services/ModificarPeriodo.service';
import './style.css';
import { AlertsContext } from "../Alert/AlertsContext";
import { ExclamationCircleFill } from 'react-bootstrap-icons';

const Modificarperdiodo = () => {
    const [nombreAmbiente, setNombreAmbiente] = useState(''); // Estado para almacenar el nombre del ambiente
    const [ambienteOptions, setAmbienteOptions] = useState([]); // Estado para almacenar las opciones de ambiente
    const [fecha, setFecha] = useState(''); // Estado para almacenar la fecha seleccionada
    const [idAmbiente, setId] = useState(''); // Estado para almacenar el ID del ambiente
    const [nombre, setNombre] = useState(''); // Estado para almacenar el nombre del ambiente
    const [periodosModificados, setPeriodosModificados] = useState([]);
    const { agregarAlert } = useContext(AlertsContext);
    const [idAmbienteModificar, setIdMo] = useState(''); // Estado para almacenar el ID del ambiente
    const [nombreModificar, setNombreMO] = useState(''); // Estado para almacenar el nombre del ambiente
    const [fechaModifica, setFechaMo] = useState(''); // Estado para almacenar la fecha seleccionada
    const optionsContainerRef = useRef(null); 
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
    const [consultarPresionado, setConsultarPresionado] = useState(false);
    const [nombreAmbienteFocused, setNombreAmbienteFocused] = useState(false);
    const [fechaAmbienteFocused, setFechaAmbienteFocused] = useState(false);
    // Función para buscar ambientes por nombre
    const buscarAmbiente = (nombre) => {
    if (nombre.trim() !== '') {
        buscarAmbientePorNombre(nombre)
            .then(data => {
                const idValue = data.respuesta[0].id;
                const nombreValue = data.respuesta[0].nombre;
                 //Actualizar estados con los valores obtenidos
                setId(idValue);
                setNombre(nombreValue);
                setAmbienteOptions(data.respuesta);
                setSelectedOptionIndex(-1); // Actualizar las opciones de ambiente con los datos obtenidos
                
            })
            .catch(error => {
                console.log('Error al buscar los ambientes:', error);
                setAmbienteOptions([]); // Limpiar las opciones de ambiente en caso de error
            });
    } else {
        // Limpiar los estados relacionados con el ambiente
        setId('');
        setNombre('');
        setAmbienteOptions([]);
    }
};


    // Función para modificar periodo
    const modifica = (idAmbiente,fecha) => {
        modificarPerio(idAmbiente,fecha)
            .then(data => {
                // Obtener solo la hora inicial de cada periodo y actualizar las opciones de periodo
                setPeriodosModificados(data.periodos);
                cambiarColorLabels(); 
            })
            .catch(error => {
                console.log('Error al buscar los ambientes:', error);
            });
    };

// Función para manejar el cambio en el campo de búsqueda de ambiente
const handleInputChange = (e) => {
    const newValue = e.target.value;
    // Validar que solo se permitan datos alfanuméricos
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
        buscarAmbiente(newValue);
        setNombreAmbiente(newValue);
    }
};

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
    // Función para manejar la selección de una opción de ambiente
    const handleOptionSelect = (selectedId, selectedNombre,index) => {
        setId(selectedId);
        setNombre(selectedNombre);
        setNombreAmbiente(selectedNombre);
        setAmbienteOptions([]);
        setSelectedOptionIndex(index);
        // Limpiar las opciones de ambiente después de seleccionar una
    };

    const handleConsultarClick = () => {
        
        // Obtener la fecha actual en formato ISO (YYYY-MM-DD)
        const fechaActual = new Date().toISOString().split('T')[0];
        
        // Verificar que se haya seleccionado un ambiente, que se haya ingresado una fecha y que la fecha sea igual o mayor a la fecha actual
        if (idAmbiente && fecha && fecha >= fechaActual) {
            setIdMo(idAmbiente);
            setNombreMO(nombre);
            setFechaMo(fecha);
            // Aquí puedes usar el ID del ambiente (almacenado en el estado 'id') y la fecha (almacenada en el estado 'fecha')
            modifica(idAmbiente, fecha);
            setConsultarPresionado(true);
            // Aquí puedes realizar cualquier otra operación que necesites con el ID y la fecha, como enviarlos a un servicio para obtener resultados específicos, etc.
    
        }
    };

    const estado = () => {
        const checkboxes = document.querySelectorAll('.periodos-container input[type="checkbox"]');
        const seleccionados = [];
        setNombreAmbiente(nombreModificar);
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                seleccionados.push({ id: checkbox.id });
                
                // Convertir checkbox.id a número
                const checkboxIdAsNumber = parseInt(checkbox.id, 10);
                // Verifica si el ID del checkbox está en periodosModificados
                if (periodosModificados.includes(checkboxIdAsNumber)) {
                    otraHabilitar(checkbox.id);
                } else {
                    otraFuncion(checkbox.id);
                }
                
            }
        });
        // Desmarcar todas las casillas de verificación
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        setFecha(fechaModifica);
        modifica(idAmbienteModificar,fechaModifica);

    };
    
    
const otraHabilitar = (id) => {
        const ids = [id];
        habilita(idAmbienteModificar,ids,fechaModifica)
        // Llama a otras funciones aquí si es necesario
    };
    const otraFuncion = (id) => {
        const ids = [id];
        estadoinhabilitado(idAmbienteModificar,ids,fechaModifica)
        // Llama a otras funciones aquí si es necesario
    };

    const cambiarColorLabels = useCallback((periodo) => {
        // Verificar si el periodo está modificado
        const periodoModificado = periodosModificados.includes(periodo);
        // Devolver una clase CSS dependiendo del estado del periodo
        return periodoModificado ? 'periodos-inhabilitados' : 'periodos-habilitados';
    }, [periodosModificados]);
    
    const handleFechaChange = (e) => {
        const nuevaFecha = e.target.value;
        
        // Obtener la fecha actual en formato ISO (YYYY-MM-DD)
        const fechaActual = new Date().toISOString().split('T')[0];
        setFecha(nuevaFecha);
        
    };
    const handleInputFocus = () => {
        setNombreAmbienteFocused(true);
        // Aquí puedes ejecutar la lógica que deseas cuando el input recibe el foco
        if(nombreAmbiente.length > 0){
          buscarAmbiente(nombreAmbiente);
        console.log("El input ha recibido el foco.");
        }
      };
      const handleInputFocus2 = () => {
        setFechaAmbienteFocused(true);
        // Aquí puedes ejecutar la lógica que deseas cuando el input recibe el foco
        
      };

    return (
        <div className="buscar-container">
            <h1 className='bb'>Modifica ambiente por periodo</h1>
            <div className="search-field1">
                <label htmlFor="buscar-input1">Nombre del ambiente:</label>
                <input
                    type="text"
                    id="buscar-input"
                    value={nombreAmbiente}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                />
                {nombreAmbiente.length <= 0 && nombreAmbienteFocused && (
                        <div className="error">obligatorio.</div>
                    )}
                {nombreAmbiente.length > 0 && (
                <div className="options-container" ref={optionsContainerRef}>
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
            <div className='ModificarPeriodo-fecha'>
            <label htmlFor="fecha-input">Fecha:</label>
                <input
                    type="date"
                    id="fecha-input"
                    value={fecha}
                    onChange={handleFechaChange}
                    onFocus={handleInputFocus2}
                />
                {fechaAmbienteFocused && (
                fecha.length <= 0 ? (
                <div className="error1">Fecha obligatoria.</div>
                ) : fecha < new Date().toISOString().split('T')[0] ? (
                <div className="error1">Solo fecha actual o posterior.</div>
                ) : null
                )}
            </div>
            <Button className="consultar-button" onClick={handleConsultarClick}>Consultar</Button>
            {consultarPresionado && ( // Renderizar los checkbox y el botón de modificar solo si se ha presionado el botón de consultar
            <div>
            <div className="periodos-container">
            <h1>Periodos:</h1>
                <div>
                    <input
                        type="checkbox"
                        id="1"
                        name="periodo1"
                        value="periodo1"
                    />
                    <label htmlFor="periodo1" className={cambiarColorLabels(1)}>6:45-8:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="2"
                        name="periodo2"
                        value="periodo2"
                    />
                    <label htmlFor="periodo2" className={cambiarColorLabels(2)} >8:15-9:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="3"
                        name="periodo3"
                        value="periodo3"
                    />
                    <label htmlFor="periodo3" className={cambiarColorLabels(3)} >9:45-11:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="4"
                        name="periodo4"
                        value="periodo4"
                    />
                    <label htmlFor="periodo4" className={cambiarColorLabels(4)}>11:15-12:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="5"
                        name="periodo5"
                        value="periodo5"
                    />
                    <label  htmlFor="periodo5" className={cambiarColorLabels(5)}>12:45-14:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="6"
                        name="periodo6"
                        value="periodo6"
                    />
                    <label htmlFor="periodo6" className={cambiarColorLabels(6)}>14:15-15:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="7"
                        name="periodo7"
                        value="periodo7"
                    />
                    <label htmlFor="periodo7" className={cambiarColorLabels(7)}>15:45-17:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="8"
                        name="periodo8"
                        value="periodo8"
                    />
                    <label htmlFor="periodo8" className={cambiarColorLabels(8)}>17:15-16:45</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="9"
                        name="periodo9"
                        value="periodo9"
                    />
                    <label htmlFor="periodo9" className={cambiarColorLabels(9)}>16:45-20:15</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="10"
                        name="periodo10"
                        value="periodo10"
                    />
                    <label htmlFor="periodo10" className={cambiarColorLabels(10)}>20:15-21:45</label>
                </div>
                {/* Agrega más periodos aquí si es necesario */}
            </div> 
            <Button className="modi" onClick={estado}>Modificar</Button>
            </div>
            )}
            <div className="ambiente-details">
          <h1>Detalle</h1>
          <div className="datos">
          <p>Color blanco hace a periodos habilitados.</p>
          <p>Color gris hace referencia a periodos  </p>
          <p>inhabilitados. </p>
          <p>Color rojo para periodos ya reservados </p>
          {/* Mostrar el id y el nombre del ambiente */}
          </div>
        </div>
           
        </div>
        
    );
    
};

export default Modificarperdiodo;