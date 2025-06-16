<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\DB;


class Contacts extends Controller
{
    public function add_contact(Request $request) {
        $data = $request->all();
        DB::table('contacts')->insert($data);
    }

    public function edit_contact(Request $request) {
        $data = $request->all();
        $insertData = $data;
        unset($insertData['id']);
        DB::table('contacts')->where('id', $data['id'])->update($insertData);
    }

    public function delete_contact($id) {
        DB::table('contacts')->where('id', $id)->delete();
    }

    public function parse_ai(Request $request) {
        $data = $request->all();
        DB::table('contacts')->insert($data);
    }
}
