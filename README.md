# LingoArc

Платформа изучения английского (A1–C1 + IELTS) по ТЗ v1.0.

## Быстрый старт (Windows, без Docker)

```bash
cd lingoarc
npm install
npm run db:push
npm run db:seed
npm run dev
```

Откройте http://localhost:3000

**Демо-вход:** `demo@lingoarc.com` / `demo1234`

Локально используется **PGlite** (встроенный PostgreSQL в папке `prisma/pglite-data`). В `.env` уже стоит `USE_PGLITE=true`.

## Production (Supabase / PostgreSQL)

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте connection string в `.env`:
   ```
   USE_PGLITE=false
   DATABASE_URL="postgresql://..."
   ```
3. `npx prisma db push && npm run db:seed:prisma`

## Стек

- Next.js 14 + TypeScript
- Tailwind + Shadcn-style UI
- Prisma + PostgreSQL (или PGlite локально)
- NextAuth.js v5

## Что работает (MVP)

- Вход / регистрация
- Дашборд, уроки (MCQ, fill-in, vocabulary), словарь, flashcards SRS
- IELTS Writing (AI scoring при наличии `OPENAI_API_KEY`)
- Грамматика, достижения, заглушки analytics / mock tests

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production build |
| `npm run db:push` | Создать схему PGlite |
| `npm run db:seed` | Демо-данные (PGlite) |
| `npm run db:seed:prisma` | Seed через Prisma (нужен PostgreSQL) |
