<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AmbienteRequest extends FormRequest
{
    
    public function authorize()
    {
        return false;
    }

    
    public function rules()
    {
        return [
            'nombre' => 'required|unique|regex:/^[A-Z0-9]+$/',
            'capacidad'=> 'required|integer|min:0',
            'piso_id'=>'required|integer',
            'piso'=> 'required|integer|min:0',
            'tipo'=> 'required'
        ];
    }
}
