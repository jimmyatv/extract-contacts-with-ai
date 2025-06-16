<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class Contacts extends Controller
{
    public function add_contact(Request $request) {
        $id = DB::table('contacts')->insertGetId([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'phone' => $request->phone,
            'email' => $request->email,
            'company' => $request->company,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $contact = DB::table('contacts')->where('id', $id)->first();

        return response()->json($contact);
    }

    //Edit contact
    public function edit_contact(Request $request) {
        $data = $request->all();
        $updateData = $data;
        unset($updateData['id']);

        DB::table('contacts')->where('id', $data['id'])->update($updateData);

        $contact = DB::table('contacts')->where('id', $data['id'])->first();

        return response()->json($contact);
    }

    //Delete contact
    public function delete_contact($id) {
        DB::table('contacts')->where('id', $id)->delete();
    }

    //Parse AI
   public function parse_ai(Request $request)
{
    try {
        $text = $request->input('message');

        $prompt = <<<EOT
Extract the following fields from this message:
- first_name
- last_name
- email
- phone
- company

Respond ONLY in valid JSON format.

Message:
"""$text"""
EOT;

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openai.api_key'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant that extracts contact details from text.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0,
        ]);

        $content = $response->json()['choices'][0]['message']['content'] ?? null;

        $parsed = json_decode($content, true);

        return response()->json([
            'success' => true,
            'data' => $parsed,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
}

};
