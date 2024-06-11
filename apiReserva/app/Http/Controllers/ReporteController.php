<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Solicitud;
use App\Models\Ambiente;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
class ReporteController extends Controller
{
    public function generarReporte()
    {
        // Obtener datos para el reporte
        $ambientesMasUsados = $this->getAmbientesMasUsados();
        $fechasMasReservadas = $this->getFechasMasReservadas();
        $razonesSolicitud = $this->getRazonesReserva();
        $docentesMasReservas = $this->getDocenteMasReserva();
        $razonesRechazo = $this->getRazonesRechazo();

        // Generar PDF
        $pdf = PDF::loadView('reports.template', compact(
            'ambientesMasUsados', 'fechasMasReservadas', 'razonesSolicitud', 'docentesMasReservas', 'razonesRechazo'
        ));
        $output = $pdf->output();
        $user = User::where('id', 0)->first();
        Mail::raw('Aquí está el reporte de reservas.', function ($message) use ($user, $output) {
            $message->to($user->email)
                    ->subject('Reporte de Reservas')
                    ->attachData($output, 'report.pdf');
        });
        return response()->json(['mensaje' => 'Reporte enviado por correo.']);
    }

    private function getAmbientesMasUsados()
    {
        return DB::table('ambiente_solicitud')
            ->join('ambientes', 'ambiente_solicitud.ambiente_id', '=', 'ambientes.id')
            ->join('solicituds', 'ambiente_solicitud.solicitud_id', '=', 'solicituds.id')
            ->select('ambientes.nombre', DB::raw('count(*) as total'))
            ->groupBy('ambientes.nombre')
            ->orderBy('total', 'desc')
            ->get();
    }

    private function getFechasMasReservadas()
    {
        return Solicitud::select('fechaReserva', DB::raw('count(*) as total'))
            ->groupBy('fechaReserva')
            ->orderBy('total', 'desc')
            ->get();
    }

    private function getRazonesReserva()
    {
        return Solicitud::select('razon', DB::raw('count(*) as total'))
            ->groupBy('razon')
            ->orderBy('total', 'desc')
            ->get();
    }

    private function getDocenteMasReserva()
    {
        return Solicitud::join('users', 'solicituds.docente_id', '=', 'users.id')
            ->select('users.name', DB::raw('count(*) as total'))
            ->groupBy('users.name')
            ->orderBy('total', 'desc')
            ->get();
    }

    private function getRazonesRechazo()
    {
        return Solicitud::where('estado', 'rechazado')
            ->select('razonRechazo', DB::raw('count(*) as total'))
            ->groupBy('razonRechazo')
            ->orderBy('total', 'desc')
            ->get();
    }
}
