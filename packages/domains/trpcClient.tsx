"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import React from "react";
import superjson from "superjson";
import type { AppRouter } from "./trpc";

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
	createTRPCReact<AppRouter>();

export function TRPCProvider({
	children,
	baseUrl,
}: {
	children: React.ReactNode;
	/** Optional absolute base URL; if omitted will use relative '/api/trpc' (browser). */
	baseUrl?: string;
}) {
	const [queryClient] = React.useState(() => new QueryClient());
	const [trpcClient] = React.useState(() =>
		trpc.createClient({
			links: [
				loggerLink({ enabled: () => process.env.NODE_ENV === "development" }),
				httpBatchLink({
					url: `${baseUrl ?? ""}/api/trpc`,
					transformer: superjson,
				}),
			],
		}),
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
