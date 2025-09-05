import { type RequestContext, appRouter } from "@fincy/domains/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

function createContext(): RequestContext {
	// Extend with auth/session extraction
	return {};
}

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext,
	});

export { handler as GET, handler as POST };
