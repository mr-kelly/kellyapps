import { TRPCProvider } from "@fincy/domains/trpcClient";
import type React from "react";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata = {
	title: "Daily News Summary Agent",
	description: "Finance briefing task center demo",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className="min-h-screen">
				<TRPCProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</TRPCProvider>
			</body>
		</html>
	);
}
