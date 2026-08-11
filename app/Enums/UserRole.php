<?php

namespace App\Enums;

enum UserRole: string
{
    case Superadmin = 'superadmin';
    case User = 'user';

    public function label(): string
    {
        return match ($this) {
            self::Superadmin => 'Superadmin',
            self::User => 'Applicant',
        };
    }
}
