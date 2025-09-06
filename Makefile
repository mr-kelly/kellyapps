
dev:
	pnpm run dev

dev-mobile:
	pnpm --filter @fincy/mobile start
# 	pnpm --filter @fincy/mobile ios
# 	pnpm --filter @fincy/mobile android
# 	pnpm --filter @fincy/mobile web

dev-web:
	pnpm --filter @fincy/web dev

lint:
	pnpm run lint

db-migrate:
	pnpm --filter @fincy/domains prisma:migrate

build:
	pnpm --filter @fincy/web build
	pnpm --filter @fincy/mobile build

test:
	pnpm --filter @fincy/web test
	pnpm --filter @fincy/mobile test
	pnpm --filter @fincy/domains test