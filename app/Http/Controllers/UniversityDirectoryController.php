<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class UniversityDirectoryController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('App/Universities', [
            'universities' => [
                [
                    'name' => 'Universidade de Lisboa',
                    'short' => 'ULisboa',
                    'paths' => ['National Call', 'International Student Contest'],
                    'notes' => 'Long-term residents (2+ years as of 1 Jan) are generally excluded from International Student status and use the national route.',
                    'language' => 'Portuguese B1 often required for PT-taught programmes; English for EN-taught.',
                    'links' => [
                        [
                            'label' => 'Access & admission',
                            'href' => 'https://www.ulisboa.pt/en/info/access-and-admission-ulisboa-1st-and-2nd-cycles',
                        ],
                        [
                            'label' => 'International students',
                            'href' => 'https://www.ulisboa.pt/en/international-students',
                        ],
                    ],
                ],
                [
                    'name' => 'Universidade do Porto',
                    'short' => 'U.Porto',
                    'paths' => ['National Call', 'International Contests'],
                    'notes' => 'Check faculty pages for prerequisites and language of instruction.',
                    'language' => 'Varies by programme — confirm on official pages.',
                    'links' => [
                        [
                            'label' => 'U.Porto admissions',
                            'href' => 'https://www.up.pt/portal/en/study/applications/',
                        ],
                    ],
                ],
                [
                    'name' => 'Universidade de Coimbra',
                    'short' => 'UC',
                    'paths' => ['National Contest', 'Special Contest for International Applicants'],
                    'notes' => 'Application systems differ by contest type — pick the correct one for your status.',
                    'language' => 'Programme-dependent.',
                    'links' => [
                        [
                            'label' => 'Bachelor & integrated masters',
                            'href' => 'https://www.uc.pt/en/applications/bachelors-and-integrated-masters-degrees/',
                        ],
                    ],
                ],
                [
                    'name' => 'NOVA University Lisbon (FCT)',
                    'short' => 'NOVA FCT',
                    'paths' => ['National Call', 'International'],
                    'notes' => 'International office publishes visa/residence guidance pointing to AIMA.',
                    'language' => 'Programme-dependent.',
                    'links' => [
                        [
                            'label' => 'Visa & residence permit',
                            'href' => 'https://www.fct.unl.pt/en/international/visa-and-residence-permit',
                        ],
                    ],
                ],
            ],
        ]);
    }
}
