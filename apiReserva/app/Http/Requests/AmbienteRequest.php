<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AmbienteRequest extends FormRequest
{
    /*public function authorize()
    {
        
    }
    */
    public function rules()
    {
        return [
            'nombre' => 'unique:ambientes'
        ];
    }

    public function messages()
    {
        return [
            
            'nombre.unique' => 'El campo nombre debe ser unico.',
            
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Datos invalidos',
            'errors' => $validator->errors()
        ], 422));
    }
}
