# Portugal Admission Guide

Interactive platform for immigrants applying to Portuguese universities via the **National Student** pathway.

## Stack

- Laravel 13 + Inertia React + Tailwind
- PostgreSQL (Herd / Homebrew)
- Neuron AI agent + **Groq** (free)
- Filament CMS (blog admin)

## URLs (Herd)

- Landing: http://portugal-admission-guide.test/
- Blog: http://portugal-admission-guide.test/blog
- App (login required): http://portugal-admission-guide.test/app/roadmap
- AI Assistant: http://portugal-admission-guide.test/app/chat
- Admin CMS: http://portugal-admission-guide.test/admin

## Setup

```bash
composer install
npm install && npm run build
cp .env.example .env   # if needed
php artisan key:generate
# Configure Postgres in .env, then:
php artisan migrate --seed
```

### Groq API (required for AI chat)

Add to `.env`:

```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URI=https://api.groq.com/openai/v1
```

Get a free key at https://console.groq.com

### Admin user for Filament

After seeding, mark a user as admin:

```bash
php artisan tinker --execute='App\Models\User::where("email","test@example.com")->update(["is_admin"=>true]);'
```

Default seeded user (if you ran full seed): `test@example.com` / `password`

## Features

- Public landing + blog
- Auth-gated roadmap, AIMA guide, university directory, AI agent
- Agent answers from certified DGES/DGE/AIMA/gov/uni chunks with citations
- `php artisan knowledge:ingest` refreshes curated knowledge corpus


