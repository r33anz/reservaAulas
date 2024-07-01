<?php
namespace App\Services;
use App\Models\Inhabilitado;
use App\Models\Solicitud;
use Illuminate\Support\Facades\DB;
class InhabilitadorService
{
    public function inhabilitar($idSolicitud)
    {
        // Cambiar el estado de la solicitud a 'inhabilitada'
        $solicitud = Solicitud::find($idSolicitud);
        $solicitud->estado = 'cancelado';
        $solicitud->save();

        // Agregar a la tabla inhabilitados
        $periodoIni = $solicitud->periodo_ini_id;
        $periodoFin = $solicitud->periodo_fin_id;
        $idAmbiente = DB::table('ambiente_solicitud')
                        ->where('solicitud_id',$idSolicitud)
                        ->value('ambiente_id');

                     
        for ($i=$periodoIni; $i <= $periodoFin ; $i++) { 
            Inhabilitado::create([
                'periodo_id' =>$i,
                'ambiente_id'=>$idAmbiente,
                'fecha' => $solicitud->fechaReserva,
            ]);
        }
    }
}