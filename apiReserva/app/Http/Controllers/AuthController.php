<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            Log::info('Login successful for user:', ['email' => $request->email]);
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login successful',
                'user' => Auth::user(),
                'id' => Auth::user()->id
            ]);
        }

        Log::warning('Invalid credentials for email:', ['email' => $request->email]);
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Cierre sesion']);
    }
}
