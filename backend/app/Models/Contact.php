<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;


class Contact extends Model
{
    public static function get_contacts() {
        $contacts = DB::table('contacts')->get();
        return $contacts;
    }

}



