# Task Enum Migration Notes

You changed Task columns from TEXT to enums (SourceType, Frequency, OutputFormat, Language, Timezone, TaskStatus).
If existing Task rows exist you must:
1. Dump / inspect current values.
2. Map status 'done-today' -> 'done_today'; language 'zh-HK' -> 'zh_HK'.
3. Apply migration (prisma migrate dev) – this will likely fail if incompatible existing data.
4. Option A: truncate table then migrate.
   SQL: TRUNCATE TABLE "Task";
5. Option B: create temp columns, copy converted values, drop old columns (manual SQL) then adjust schema.

After running migration regenerate client:
`pnpm --filter @fincy/domains prisma:generate`
