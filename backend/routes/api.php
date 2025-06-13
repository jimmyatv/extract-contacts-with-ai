<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Contact;
use App\Http\Controllers\Contacts;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel!']);
});

Route::get('/contacts', function() {
    return Contact::get_contacts();
});

Route::post('/add_contact', [Contacts::class, 'add_contact']);
Route::put('/edit_contact', [Contacts::class, 'edit_contact']);
Route::put('/delete_contact/{id}', [Contacts::class, 'delete_contact']);
Route::post('/parse_ai', [Contacts::class, 'parse_ai']);
