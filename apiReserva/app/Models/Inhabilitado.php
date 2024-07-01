<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inhabilitado extends Model
{
    use HasFactory;
    protected $fillable = ['ambiente_id','periodo_id','fecha'];

    public function ambiente(){
        return $this->belongsTo(Ambiente::class);
    }

    public function periodo(){
        return $this->belongsTo(Periodo::class);
    }

    // Habilitar un ambiente
    public static function habilitar($idAmbiente, $idPeriodos, $fecha){
        foreach ($idPeriodos as $idPeriodo) {
            if (!Periodo::find($idPeriodo)) {
                throw new \Exception("El periodo $idPeriodo no existe.", 404);
            }
            if (!Ambiente::find($idAmbiente)) {
                throw new \Exception("El ambiente $idAmbiente no existe.", 404);
            }
            self::where('ambiente_id', $idAmbiente)
                ->where('periodo_id', $idPeriodo)
                ->where('fecha', $fecha)
                ->delete();
        }
    }

    // Inhabilitar un ambiente
    public static function inhabilitar($idAmbiente, $idPeriodos, $fecha){
        foreach ($idPeriodos as $idPeriodo) {
            if (!Periodo::find($idPeriodo)) {
                throw new \Exception("El periodo $idPeriodo no existe.", 404);
            }
            if (!Ambiente::find($idAmbiente)) {
                throw new \Exception("El ambiente $idAmbiente no existe.", 404);
            }
            self::create([
                'ambiente_id' => $idAmbiente,
                'periodo_id' => $idPeriodo,
                'fecha' => $fecha,
            ]);
        }
    }

    // Buscar periodos inhabilitados
    public static function buscarPeriodos($idAmbiente, $fecha){
        return self::select('periodo_id')
            ->where('ambiente_id', $idAmbiente)
            ->where('fecha', $fecha)
            ->pluck('periodo_id')
            ->toArray();
    }
}
