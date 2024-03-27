<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
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
            'nombre' => 'unique:ambientes|regex:/^[A-Z0-9]+$/',
        ];
    }

    // Este método personalizado permite definir mensajes de error personalizados.
    public function messages()
    {
        return [
            'nombre.unique' => 'El campo nombre debe ser unico.',
            'nombre.regex' => 'El campo nombre debe contener solo letras mayusculas y numeros.',
        ];
    }

    // Este método se llama cuando falla la validación.
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['message' => 'Datos invalidos', 'errors' => $validator->errors()], 422));
    }
}
