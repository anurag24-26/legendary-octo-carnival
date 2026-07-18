# AI Fitness Coach — Telegram Bot

An AI-powered Telegram fitness coach built for home training, evidence-based coaching,
and a vegetarian diet. Powered by Groq's OpenAI-compatible API.

## Installation

```bash
npm install
cp .env.example .env
# edit .env and add your BOT_TOKEN and GROQ_API_KEY
npm run dev
```

That's it. The SQLite database and its tables are created automatically on first run.

## Environment Variables

| Variable            | Description                                              | Default                          |
|----------------------|-----------------------------------------------------------|-----------------------------------|
| `BOT_TOKEN`          | Telegram bot token from @BotFather                        | —                                 |
| `GROQ_API_KEY`       | Your free Groq API key                                    | —                                 |
| `MODEL_NAME`         | Groq model to use                                          | `llama-3.3-70b-versatile`         |
| `GROQ_BASE_URL`      | Groq's OpenAI-compatible base URL                          | `https://api.groq.com/openai/v1`  |
| `TIMEZONE`           | IANA timezone for scheduling                               | `Asia/Kolkata`                    |
| `DAILY_REPORT_TIME`  | 24h `HH:mm` time to send the morning brief                 | `06:30`                           |
| `PROTEIN_TARGET`     | Default daily protein target (g)                           | `120`                             |
| `CALORIE_TARGET`     | Default daily calorie target (kcal)                        | `2400`                            |
| `WATER_TARGET`       | Default daily water target (L)                             | `3.5`                             |
| `DATABASE_PATH`      | SQLite file path                                            | `./data/fitness.db`               |
| `LOG_LEVEL`          | pino log level                                               | `info`                            |

## Commands

**Training**
- `/today` — today's owed workout
- `/done` — mark today's workout complete (advances the schedule)
- `/skip` — skip today without losing the workout (it rolls into tomorrow)
- `/history` — recent workout log

**Body Metrics**
- `/weight <kg>`
- `/waist <cm>`
- `/photo` — instructions to submit a progress photo (send image with caption `front`/`side`/`back`)

**Nutrition**
- `/food <description>` — AI estimates calories/protein/fat/carbs
- `/protein <grams>`
- `/water <liters>`

**Recovery**
- `/sleep <hours> [quality 1-10]`

**Coaching**
- `/coach` — adaptive AI note grounded in your last 7-30 days of data
- `/progress` — physique photo tracking summary
- `/note <text>` — save a personal note
- `/report [daily|weekly|monthly]`

**Account**
- `/settings` — view/update protein, calorie, water targets
- `/export` — download all your data as JSON
- `/help`

Plain text messages (no `/` prefix) are routed to a free-form AI coach chat.

## How the Adaptive Workout Split Works

The split (`src/constants/workoutSplit.js`) is a **cycle**, not tied to calendar days.
Each user has a `splitIndex` pointer to the workout they currently owe. `/done` advances
the pointer; `/skip` does not. This means a missed Friday session is still waiting for
you on Saturday — nothing is ever permanently dropped, and the whole week's schedule
shifts forward automatically.

## Folder Structure

```
src/
  bot/
    commands/      One file per Telegram command
    handlers/       Message routing (photos, free text) + command registration
    middleware/     User bootstrap + centralized error handling
    bot.js          grammy Bot instance
  config/           Environment loading (zod-validated)
  constants/        Workout split, foods, app-wide constants
  database/
    schema.js       Drizzle ORM table definitions
    db.js           SQLite connection + auto-migration
    repositories/    One repository per table (generic factory for simple logs)
  prompts/          Coach persona system prompt
  scheduler/        node-cron jobs (daily report, alert checks)
  services/         Business logic (workouts, nutrition, coaching, photos, reports, alerts)
  utils/            Logger, date helpers, validation, ID generation
  index.js          Entrypoint
photos/             Compressed progress photos (per-user subfolders)
data/               SQLite database file lives here
logs/               pino log files
```

## Notes

- Groq's current models are text-only, so `/progress` reasons over photo submission
  cadence and measurable trends (waist/weight) rather than pixel-level image analysis.
- All coaching output is grounded in stored evidence — the AI is instructed to say
  "insufficient data" rather than invent trends.
