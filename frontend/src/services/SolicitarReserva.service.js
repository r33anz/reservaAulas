import axios from 'axios';

const apiUrl = process.env.REACT_APP_URL;

export const getBloques = (id) => {
    if(id==="1"){
    return [
        { id: 1, name: "Introduccion a la programacion"},
        { id: 2, name: "Elementos de programacion"},
        { id: 3, name: "Algoritmos Avanzados"},
        
    ];
}else if(id==="2"){
    return [
        { id: 4, name: "Base de datos I"},
        { id: 5, name: "Programacion Funcional"},
    ];
}else if(id==="3"){
    return [
        { id: 4, name: "Base de datos I"},
        { id: 5, name: "Programacion Funcional"},
        { id: 9, name: "Taller de base de datos"},
        
    ];
}else if(id==="4"){
    return [
        { id: 8, name: "Ingieneria de Software"},
       
    ];
}else if(id==="5"){
    return [
        { id: 9, name: "Taller de base de datos"},
        
    ];
}
} 


export const razon = () => {
   
    return [
        { id: 1, name: "Primer Parcial"},
        { id: 2, name: "Segundo Parcial"},
        { id: 3, name: "Examen Final"},
        { id: 4, name: "Segunda Instancia"},
        { id: 5, name: "Examen de mesa"},
        
        
    ];

} 


export const getGruposPorBloque = (nombreMateria) => {
   
    const gruposPredeterminados = {
        "Introduccion a la programacion": [1],
        "Elementos de programacion": [1],
        "Algoritmos Avanzados": [1],
        "Base de datos I": [3, 5],
        "Programacion Funcional": [4, 6],
        "Base de datos II": [3, 5],
        "Graficacion de Computadoras": [9],
        "Ingieneria de Software": [9],
        "Taller de base de datos": [1, 2]
    };
    return gruposPredeterminados[nombreMateria];
};

export const getDocente = (id) => {
    return axios.get(`${apiUrl}/docentes/${id}`)
    .then(function (response) {
      //console.log(response.data.nombre);
      return response.data; // Devuelve los datos del ambiente encontrado
    });
  };

  export const postReserva = (reserva) => {
    console.log(reserva);
    return axios.post(`${apiUrl}/realizarSolicitud`, reserva)
      .then(function(response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function(error) {
        console.log("response");
        if (error.response) {
          console.log(error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          console.log(error.request);
          return Promise.reject(error.request);
        } else {
          console.log("Error", error.message);
          return Promise.reject(error.message);
        }
      });
  };
  
  export const postReserva2 = (reserva) => {
    console.log(reserva);
    return axios.post(`${apiUrl}/realizarSolicitudP2`, reserva)
      .then(function(response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function(error) {
        console.log("response");
        if (error.response) {
          console.log(error.response.data);
          return Promise.reject(error.response.data);
        } else if (error.request) {
          console.log(error.request);
          return Promise.reject(error.request);
        } else {
          console.log("Error", error.message);
          return Promise.reject(error.message);
        }
      });
  };

export const recuperarAmbientePorID = (id) => {
    return axios.get(`${apiUrl}/ambiente/${id}`).then(function (response) {
      
      return response.data; // Devuelve los datos del ambiente encontrado
    });
  };