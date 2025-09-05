import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

// Context definition (extend per-app when creating handler)
export interface RequestContext {
	userId?: string;
}

const t = initTRPC.context<RequestContext>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;

export const tasksRouter = router({
	hello: procedure
		.input(z.object({ name: z.string().default("World") }).optional())
		.query(({ input }) => {
			const name = input?.name ?? "World";
			return { greeting: `Hello, ${name}!` };
		}),
});

export const appRouter = router({ tasks: tasksRouter });
export type AppRouter = typeof appRouter;
