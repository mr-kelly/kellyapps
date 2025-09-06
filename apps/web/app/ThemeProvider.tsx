"use client";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import type { ReactNode } from "react";

const theme = extendTheme({
	colorSchemes: {
		dark: {
			palette: {
				background: {
					body: "#0d0f12",
					surface: "#161a1e",
					level1: "#161a1e",
				},
				primary: { 500: "#3d82f6" },
				success: { 500: "#22c55e" },
				warning: { 500: "#f59e0b" },
				danger: { 500: "#ef4444" },
			},
		},
	},
	fontFamily: { body: "system-ui, ui-sans-serif, sans-serif" },
	shadow: {
		sm: "0 2px 4px -1px rgba(0,0,0,0.4), 0 4px 12px -2px rgba(0,0,0,0.3)",
	},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
	return (
		<CssVarsProvider theme={theme} defaultMode="dark" disableTransitionOnChange>
			{children}
		</CssVarsProvider>
	);
}

export default ThemeProvider;
