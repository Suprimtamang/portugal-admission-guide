<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application owner
    |--------------------------------------------------------------------------
    |
    | Only this account can promote or demote superadmins. Other superadmins
    | retain desk/support access but cannot grant admin roles.
    |
    */

    'owner_email' => env('APP_OWNER_EMAIL', 'maxpal1234@gmail.com'),

];
