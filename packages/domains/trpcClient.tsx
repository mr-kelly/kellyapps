"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import React from "react";
import superjson from "superjson";
import type { AppRouter } from "./trpc";

// Internal singleton instance (not exported)
const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
	createTRPCReact<AppRouter>();

// Hook for consuming the typed tRPC proxy without importing `trpc` directly.
export function useTRPC(): typeof trpc {
	return trpc;
}

// (Removed useTRPCQuery wrapper per simplification request)

// Optional: expose raw hook groups for future extension
export type { AppRouter } from "./trpc";

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
