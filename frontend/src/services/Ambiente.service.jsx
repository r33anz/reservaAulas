export const getBloques = () => {
    return [
        { id: 1, name: "Edificio Nuevo" },
        { id: 2, name: "Bloque Antiguo" },
        { id: 3, name: "Departamento de Fisica" },
        { id: 4, name: "MEMI" },
        { id: 5, name: "Laboratorios" },
    ];
}

export const getTiposDeAmbiente = () => {
    return [
        { id: 1, name: "Aula común" },
        { id: 2, name: "Laboratorios" },
        { id: 3, name: "Sala de Informatica" },
        { id: 4, name: "Auditorio" },
    ];
}

export const getPiso = () => {
    return [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }];
}