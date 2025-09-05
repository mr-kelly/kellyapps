
dev-mobile:
	pnpm --filter mobile start
	pnpm --filter mobile ios
	pnpm --filter mobile android
	pnpm --filter mobile web

lint:
	pnpm run lint