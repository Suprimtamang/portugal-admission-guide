<?php

namespace Database\Seeders;

use App\Models\KnowledgeChunk;
use App\Models\KnowledgeSource;
use Illuminate\Database\Seeder;

class KnowledgeSeeder extends Seeder
{
    public function run(): void
    {
        $entries = [
            [
                'title' => 'DGES — International Student Statute exceptions',
                'url' => 'https://www.dges.gov.pt/en/pagina/international-students',
                'authority' => 'dges',
                'content' => 'Students who are not nationals of an EU/EEA country but have been legally residing in Portugal for more than two years, continuously, by January 1st of the year of application to higher education, as well as their children legally residing with them, are excluded from the International Student Statute and may apply through the National Call under the same conditions as national students. Residence for study while attending secondary education in Portugal is relevant for this purpose.',
            ],
            [
                'title' => 'DGE — Equivalence of foreign qualifications',
                'url' => 'https://www.dge.mec.pt/faq-equivalence-foreign-qualifications',
                'authority' => 'dge',
                'content' => 'Equivalence of foreign basic and secondary qualifications is ruled by Decree-Law no. 227/2005. Residents in Portugal request equivalence at a public or private secondary school with pedagogical autonomy in their area of residence. Citizens living outside Portugal should ask Direção-Geral da Educação (DGE) by post. Secondary equivalence is granted with a classification.',
            ],
            [
                'title' => 'gov.pt — Request foreign secondary equivalence',
                'url' => 'https://www2.gov.pt/pt/servicos/pedir-equivalencia-de-habilitacoes-estrangeiras-do-ensino-basico-e-secundario',
                'authority' => 'gov',
                'content' => 'To request equivalence of foreign basic/secondary qualifications in Portugal, apply at a school in your residence area. Documents typically include authenticated certificates (consular legalization or Hague Apostille), translation when required, grading scale information, and the school equivalence form.',
            ],
            [
                'title' => 'DGES — Substitution of entrance exams by foreign exams',
                'url' => 'https://www.dges.gov.pt/pt/pagina/substituicao-de-provas-de-ingresso-por-exames-estrangeiros-0',
                'authority' => 'dges',
                'content' => 'Holders of non-Portuguese secondary courses legally equivalent to Portuguese secondary education may substitute Portuguese entrance exams (provas de ingresso) with foreign final exams under Article 20.º-A of Decree-Law 296-A/98. Foreign exams must meet national scope/recognition conditions. Candidates generally need an equivalence certificate and must follow DGES/CNAES procedures and yearly homologation tables.',
            ],
            [
                'title' => 'AIMA — Studying in Portugal',
                'url' => 'https://aima.gov.pt/pt/estudar',
                'authority' => 'aima',
                'content' => 'AIMA (Agency for Integration, Migration and Asylum) publishes information for studying in Portugal, including residence permits for higher education students (Art. 91.º), student mobility, researchers, secondary/other students (Art. 92.º), trainees and volunteers. Always confirm current appointment and document rules on AIMA.',
            ],
            [
                'title' => 'AIMA — Higher education residence Art. 91',
                'url' => 'https://aima.gov.pt/pt/estudar/autorizacao-de-residencia-emitida-a-estudantes-do-ensino-superior-art-91-o',
                'authority' => 'aima',
                'content' => 'Residence permit requests for higher education students (Art. 91.º) are generally submitted by appointment (or electronic platform when available) in person with the official form. Supporting documents typically include proof of enrolment, tuition payment where applicable, means of subsistence, accommodation, health coverage, and identity documents. Incomplete files may not be accepted.',
            ],
            [
                'title' => 'ULisboa — Access and admission',
                'url' => 'https://www.ulisboa.pt/en/info/access-and-admission-ulisboa-1st-and-2nd-cycles',
                'authority' => 'university',
                'content' => 'Universidade de Lisboa distinguishes National Call applicants from the Special Competition for International Students. Non-EU nationals legally residing in Portugal for more than two uninterrupted years by 1 January of the application year (and their children living with them) are generally excluded from International Student status. Language requirements (often Portuguese B1 for PT-taught programmes) and prerequisites vary by study cycle.',
            ],
            [
                'title' => 'University of Coimbra — application contests',
                'url' => 'https://www.uc.pt/en/applications/bachelors-and-integrated-masters-degrees/',
                'authority' => 'university',
                'content' => 'University of Coimbra offers bachelor and integrated master access via the National Contest of Access and Admission, a Special Contest for International Applicants, contests for applicants over 23, holders of other degrees, and other special routes. Candidates must choose the contest matching their legal status.',
            ],
            [
                'title' => 'NOVA FCT — Visa and residence permit',
                'url' => 'https://www.fct.unl.pt/en/international/visa-and-residence-permit',
                'authority' => 'university',
                'content' => 'Non-EU students typically need a study visa before travel and must book an AIMA appointment after arrival to apply for a residence permit. University international offices point students to AIMA for official requirements. Apply for visas early because processing can take months.',
            ],
        ];

        foreach ($entries as $entry) {
            $source = KnowledgeSource::query()->updateOrCreate(
                ['url' => $entry['url']],
                [
                    'title' => $entry['title'],
                    'authority' => $entry['authority'],
                    'last_fetched_at' => now(),
                ]
            );

            $source->chunks()->delete();

            KnowledgeChunk::query()->create([
                'knowledge_source_id' => $source->id,
                'content' => $entry['content'],
                'chunk_index' => 0,
            ]);
        }
    }
}
