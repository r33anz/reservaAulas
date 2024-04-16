import {Calendar, dayjsLocalizer} from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from 'dayjs';
import "dayjs/locale/es";
import "./style.css";

dayjs.locale("es");

function Calendario(){
  const localizer = dayjsLocalizer(dayjs);

  const events = [
    {
      start: dayjs('2024-04-10T12:00:00').toDate(),
      end: dayjs('2024-04-10T13:00:00').toDate(),
      title: "2 Reservas"
    },
    {
      start: dayjs('2024-04-10T12:00:00').toDate(),
      end: dayjs('2024-04-10T13:00:00').toDate(),
      title: "3 Solicitudes"
    },
    {
      start: dayjs('2024-04-15T12:00:00').toDate(),
      end: dayjs('2024-04-15T13:00:00').toDate(),
      title: "3 Solicitudes"
    },
    {
      start: dayjs('2024-04-18T12:00:00').toDate(),
      end: dayjs('2024-04-18T13:00:00').toDate(),
      title: "4 Solicitudes"
    },
    {
      start: dayjs('2024-04-26T12:00:00').toDate(),
      end: dayjs('2024-04-26T13:00:00').toDate(),
      title: "2 Reservas"
    },
    {
      start: dayjs('2024-04-26T12:00:00').toDate(),
      end: dayjs('2024-04-26T13:00:00').toDate(),
      title: "1 Solicitud"
    },
    {
      start: dayjs('2024-04-13T12:00:00').toDate(),
      end: dayjs('2024-04-13T13:00:00').toDate(),
      title: "1 Reserva"
    },
    {
      start: dayjs('2024-04-13T12:00:00').toDate(),
      end: dayjs('2024-04-13T13:00:00').toDate(),
      title: "2 Solicitudes"
    },
    {
      start: dayjs('2024-04-23T12:00:00').toDate(),
      end: dayjs('2024-04-23T13:00:00').toDate(),
      title: "2 Reservas"
    },
    {
      start: dayjs('2024-04-23T12:00:00').toDate(),
      end: dayjs('2024-04-23T13:00:00').toDate(),
      title: "1 Solicitud"
    },
    {
      start: dayjs('2024-04-17T12:00:00').toDate(),
      end: dayjs('2024-04-17T13:00:00').toDate(),
      title: "2 Reservas"
    },
    {
      start: dayjs('2024-04-18T12:00:00').toDate(),
      end: dayjs('2024-04-18T13:00:00').toDate(),
      title: "1 Solicitud"
    },
  ]
  return (
    <div style={{
      height: "80vh" ,
      width: " 70vw",
    }}>
      <Calendar 
        localizer={localizer}
        events = {events}
        views={["month" , ]}
        defaultView="month"
        culture='es'
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          dia: "Dia",
          more: "mas"
        }}
      />
    
    </div>

  )
}
export default Calendario