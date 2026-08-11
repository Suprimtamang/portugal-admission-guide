<?php

namespace Database\Seeders;

use App\Models\ChecklistItem;
use App\Models\RoadmapStep;
use Illuminate\Database\Seeder;

class RoadmapSeeder extends Seeder
{
    public function run(): void
    {
        $steps = [
            [
                'slug' => 'eligibility',
                'title' => '0. Eligibility Wizard',
                'icon' => '⚖️',
                'summary' => 'Can you apply as a National?',
                'intro' => "The definition of an 'International Student' determines your tuition fees. Immigrants can often apply as 'National Students' if they meet certain criteria.",
                'sort_order' => 0,
                'meta' => [
                    'type' => 'wizard',
                    'heading' => 'Check Your Status (Decree-Law 62/2018):',
                    'prompt' => 'Do you (or a parent) fall into any of these situations?',
                    'rules' => [
                        'I have resided legally in Portugal for more than 2 years uninterruptedly (as of Jan 1st).',
                        'I am here under Family Reunification (e.g., my parent or spouse has lived here legally for >2 years).',
                    ],
                    'success' => 'You are likely ELIGIBLE to apply as a National Student!',
                    'footnote' => 'Important: Time spent solely on a Study Visa (for a specific degree) usually doesn\'t count toward the 2-year conversion rule. Check with DGES via a ticket if unsure.',
                ],
                'checklist' => [],
            ],
            [
                'slug' => 'attestation',
                'title' => '1. Document Attestation',
                'icon' => '📄',
                'summary' => 'Legalizing Certificates',
                'intro' => 'Your certificates (Grade 10/11/12) must be legalized in a specific sequence to be valid in Portugal.',
                'sort_order' => 1,
                'meta' => [
                    'type' => 'checklist',
                ],
                'checklist' => [
                    'Board certificates from your home country (Grade 10/12)',
                    'Consular/MFA attestation in your home country',
                    'Embassy or Consulate stamp in Lisbon (Apostille/Legalization)',
                    'Portuguese Translations by a certified translator',
                ],
            ],
            [
                'slug' => 'equivalency',
                'title' => '2. Equivalency Stage',
                'icon' => '🏫',
                'summary' => 'Secondary School Visit',
                'intro' => 'You must convert your high school GPA to the Portuguese 0-20 scale. This is done at a public secondary school.',
                'sort_order' => 2,
                'meta' => [
                    'type' => 'equivalency',
                    'where_heading' => 'Where to go?',
                    'where_body' => 'Visit any Escola Secundária (High School). Make sure the receptionist is friendly and preferably speaks English.',
                    'school_name' => 'Agrupamento de Escolas das Laranjeiras',
                    'school_address' => 'Estrada das Laranjeiras 122, 1600-136 Lisboa',
                    'bring' => [
                        'Legalized Certificates (Step 1)',
                        'Portuguese Residency Card / Passport',
                        'Proof of Address (Atestado)',
                    ],
                    'tip' => 'Apply as early as possible (March/April). Waiting times can stretch to 4 months.',
                ],
                'checklist' => [],
            ],
            [
                'slug' => 'substitution',
                'title' => '3. Exam Substitution',
                'icon' => '🔁',
                'summary' => 'Artigo 20-A (The Secret)',
                'intro' => 'You can often substitute the Portuguese national entrance exams (Math A, Physics, etc.) with your final board results.',
                'sort_order' => 3,
                'meta' => [
                    'type' => 'email_template',
                    'note' => 'You must contact the CNAES (Commission for Higher Education Access) to request this.',
                    'email_to' => 'cnaes@dges.gov.pt',
                    'email_body' => "Assunto: Pedido de substituição de provas de ingresso (Artigo 20.º-A)\n\nExmos. Senhores,\nVenho por este meio solicitar a análise da substituição das provas de ingresso (Matemática A / Física e Química) pelos exames finais realizados no meu país de origem, ao abrigo do Artigo 20.º-A do Decreto-Lei n.º 296-A/98.\n\nSubmeto em anexo:\n1. Certificados de habilitações autenticados;\n2. Programas detalhados das disciplinas;\n3. Documento de equivalência obtido em Portugal.\n\nAtentamente,\n[Seu Nome Completo]\n[NIF / Número de Identificação]",
                ],
                'checklist' => [],
            ],
            [
                'slug' => 'gaes',
                'title' => '4. Password & GAES',
                'icon' => '🔑',
                'summary' => 'Identity Activation',
                'intro' => 'Before applying online, you must verify your identity in person at a GAES (Higher Education Access Office).',
                'sort_order' => 4,
                'meta' => [
                    'type' => 'gaes',
                    'portal_note' => 'Request the "Senha" (Password) online at the DGES portal, print the PDF, and visit one of these offices:',
                    'offices' => [
                        [
                            'label' => 'ISCTE (Lisbon)',
                            'name' => 'ISCTE - Instituto Universitário de Lisboa',
                            'address' => 'Av. das Forças Armadas, 1649-026 Lisboa',
                        ],
                        [
                            'label' => 'ULisboa (Lisbon)',
                            'name' => 'Reitoria da Universidade de Lisboa',
                            'address' => 'Al. da Cidade Universitária, 1649-004 Lisboa',
                        ],
                    ],
                    'warning_title' => "Don't have a Citizen Card?",
                    'warning_body' => 'Visit the GAES in early July to request an Internal Number. This is mandatory for foreign students without a CC.',
                ],
                'checklist' => [],
            ],
            [
                'slug' => 'finish',
                'title' => '5. Final Application',
                'icon' => '🎉',
                'summary' => 'The Result Stage',
                'intro' => 'Submit your top 6 course choices during the 1st Phase (usually July/August).',
                'sort_order' => 5,
                'meta' => [
                    'type' => 'finish',
                    'heading' => 'Roadmap Complete!',
                    'body' => "You've finished the administrative hurdles. Good luck with your university dream!",
                    'support_url' => 'https://www.dges.gov.pt/pt/pagina/be-com',
                    'support_label' => 'Contact DGES Support (e-balcão)',
                ],
                'checklist' => [],
            ],
        ];

        foreach ($steps as $data) {
            $checklist = $data['checklist'];
            unset($data['checklist']);

            $step = RoadmapStep::query()->updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );

            $step->checklistItems()->delete();

            foreach ($checklist as $index => $label) {
                ChecklistItem::query()->create([
                    'roadmap_step_id' => $step->id,
                    'label' => $label,
                    'sort_order' => $index,
                ]);
            }
        }
    }
}
