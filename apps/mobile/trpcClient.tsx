import type { AppRouter } from "@fincy/domains/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import Constants from "expo-constants";
import React from "react";
import superjson from "superjson";

export const trpc: ReturnType<typeof createTRPCReact<AppRouter>> =
	createTRPCReact<AppRouter>();

function getBaseUrl() {
	// Adjust for emulator / device
	if (typeof window !== "undefined") return "";
	const debuggerHost = (Constants as { expoConfig?: { hostUri?: string } })
		.expoConfig?.hostUri;
	if (debuggerHost) {
		const host = debuggerHost.split(":")[0];
		return `http://${host}:3000`; // assume web app running on 3000
	}
	return "http://localhost:3000";
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = React.useState(() => new QueryClient());
	const [trpcClient] = React.useState(() =>
		trpc.createClient({
			links: [
				loggerLink({ enabled: () => __DEV__ }),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
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
