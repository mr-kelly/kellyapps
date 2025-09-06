import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export interface RequestContext {
	userId?: string;
}

const t = initTRPC.context<RequestContext>().create({ transformer: superjson });

export const router = t.router;
export const procedure = t.procedure;
