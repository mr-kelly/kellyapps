import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { TRPCProvider } from "@fincy/domains/trpcClient";
import Constants from "expo-constants";

function getBaseUrl() {
	if (typeof window !== "undefined") return ""; // web
	const debuggerHost = (Constants as { expoConfig?: { hostUri?: string } })
		.expoConfig?.hostUri;
	if (debuggerHost) {
		const host = debuggerHost.split(":")[0];
		return `http://${host}:3000`;
	}
	return "http://localhost:3000";
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<TRPCProvider baseUrl={getBaseUrl()}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
				<StatusBar style="auto" />
			</ThemeProvider>
		</TRPCProvider>
	);
}
