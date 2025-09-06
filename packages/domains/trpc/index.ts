export * from "./trpcContext";
import { z } from "zod";
import { tasksRouter } from "./routers/tasks";
import { procedure, router } from "./trpcContext";

const helloRouter = router({
	hello: procedure
		.input(z.object({ name: z.string().default("World") }).optional())
		.query(({ input }) => {
			const name = input?.name ?? "World";
			return { greeting: `Hello, ${name}!` };
		}),
});

export const appRouter = router({
	tasks: tasksRouter,
	util: helloRouter,
});

export type AppRouter = typeof appRouter;
