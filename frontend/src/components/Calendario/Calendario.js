import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "./style.css";
import { recuperarFechasSolicitud } from "../../services/Fechas.service";
import { useState } from "react";
import { useEffect } from "react";

dayjs.locale("es");

function Calendario() {
  const localizer = dayjsLocalizer(dayjs);
  const [event, setEvent] = useState([]);
  const getFechas = async () => {
    const data = await recuperarFechasSolicitud();
    let fechas = data.listaFechas;
    let events2 = [];
    for (let i = 0; i < fechas.length; i++) {
      if (fechas[i].reservas.length > 0) {
        const evento = {
          start: dayjs(fechas[i].fecha).toDate(),
          end: dayjs(fechas[i].fecha).toDate(),
          title: `${fechas[i].reservas.length} ${
            fechas[i].reservas.length > 1 ? "reservas" : "reserva"
          }`,
        };
        events2.push(evento);
      }
    }
    for (let i = 0; i < fechas.length; i++) {
      if (fechas[i].solicitudes.length > 0) {
        const evento = {
          start: dayjs(fechas[i].fecha).toDate(),
          end: dayjs(fechas[i].fecha).toDate(),
          title: `${fechas[i].solicitudes.length} ${
            fechas[i].solicitudes.length > 1 ? "solicitudes" : "solicitud"
          }`,
        };
        events2.push(evento);
      }
    }
    setEvent(events2);
  };

  useEffect(() => {
    getFechas();
  }, []);

  return (
    <>
      <div
        style={{
          height: "68vh",
          width: " 70vw",
        }}
      >
        <Calendar
          localizer={localizer}
          events={event}
          views={["month"]}
          defaultView="month"
          culture="es"
          onSelectSlot
          onSelectEvent
          selectable
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            dia: "Dia",
            more: "mas",
          }}
        />
      </div>
    </>
  );
}
export default Calendario;
