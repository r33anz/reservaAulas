<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Reservas</title>
    <style>
        h1, h2 {
            text-align: center;
        }
        .subtitle {
            text-decoration: underline;
            margin-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>Reporte de Reservas</h1>
    
    <h2 class="subtitle">Ambientes Más Usados</h2>
    <table>
        <thead>
            <tr>
                <th>Ambiente</th>
                <th>Total Reservas</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($ambientesMasUsados as $ambiente)
                <tr>
                    <td>{{ $ambiente->nombre }}</td>
                    <td>{{ $ambiente->total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="subtitle">Fechas con Más Reservas</h2>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Total Reservas</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($fechasMasReservadas as $fecha)
                <tr>
                    <td>{{ $fecha->fechaReserva }}</td>
                    <td>{{ $fecha->total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="subtitle">Razones de Solicitud</h2>
    <table>
        <thead>
            <tr>
                <th>Razón</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($razonesSolicitud as $razon)
                <tr>
                    <td>{{ $razon->razon }}</td>
                    <td>{{ $razon->total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="subtitle">Docentes con Más Reservas</h2>
    <table>
        <thead>
            <tr>
                <th>Docente</th>
                <th>Total Reservas</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($docentesMasReservas as $docente)
                <tr>
                    <td>{{ $docente->name }}</td>
                    <td>{{ $docente->total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <h2 class="subtitle">Razones de Rechazo</h2>
    <table>
        <thead>
            <tr>
                <th>Razón de Rechazo</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($razonesRechazo as $rechazo)
                <tr>
                    <td>{{ $rechazo->razonRechazo }}</td>
                    <td>{{ $rechazo->total }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
