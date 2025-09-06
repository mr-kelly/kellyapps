import { TRPCProvider } from "@fincy/domains/trpcClient";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
	title: "Fincy Web",
	description: "Fresh Next.js app",
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
