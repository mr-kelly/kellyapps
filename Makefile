
dev-mobile:
	pnpm --filter @fincy/mobile start
	pnpm --filter @fincy/mobile ios
	pnpm --filter @fincy/mobile android
	pnpm --filter @fincy/mobile web

lint:
	pnpm run lint

db-migrate:
	pnpm --filter @fincy/domains prisma:migrate