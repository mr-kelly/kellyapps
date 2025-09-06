import { useTRPC } from "@fincy/domains/trpcClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function TaskDetailScreen() {
	const { id: rawId } = useLocalSearchParams<{ id?: string }>();
	const id =
		typeof rawId === "string"
			? rawId
			: Array.isArray(rawId)
				? rawId[0]
				: undefined;
	const router = useRouter();
	const trpc = useTRPC();
	const getQuery = trpc.tasks.get.useQuery({ id: id || "" }, { enabled: !!id });
	const runMutation = trpc.tasks.run.useMutation({
		onSuccess: () => getQuery.refetch(),
	});
	const removeMutation = trpc.tasks.remove.useMutation({
		onSuccess: () => {
			router.back();
		},
	});
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (copied) {
			const t = setTimeout(() => setCopied(false), 1800);
			return () => clearTimeout(t);
		}
	}, [copied]);

	if (!id)
		return (
			<View style={styles.center}>
				<Text style={styles.muted}>No id</Text>
			</View>
		);
	if (getQuery.isLoading)
		return (
			<View style={styles.center}>
				<ActivityIndicator />
			</View>
		);
	if (!getQuery.data)
		return (
			<View style={styles.center}>
				<Text style={styles.muted}>Not found</Text>
			</View>
		);

	const task = getQuery.data;
	const summary = task?.lastSummary as
		| undefined
		| { headlines: string[]; takeaways: string[] };

	function run() {
		if (id) runMutation.mutate({ id });
	}
	function remove() {
		Alert.alert("Delete Task", "Are you sure?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => id && removeMutation.mutate({ id }),
			},
		]);
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			<TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
				<Text style={styles.backText}>‹ Back</Text>
			</TouchableOpacity>
			<Text style={styles.title}>{task?.title}</Text>
			<Text style={styles.meta}>
				{task?.sourceType} · {task?.frequency} · {task?.timezone}
			</Text>
			<View style={styles.badgesRow}>
				<View
					style={[
						styles.badge,
						task?.status === "done_today"
							? styles.badgeDone
							: task?.status === "error"
								? styles.badgeError
								: styles.badgeNeutral,
					]}
				>
					<Text style={styles.badgeText}>
						{task?.status === "done_today" ? "Done Today" : task?.status}
					</Text>
				</View>
				{task?.lastRunAt && (
					<View style={[styles.badge, styles.badgeNeutral]}>
						<Text style={styles.badgeText}>
							Last{" "}
							{new Date(task.lastRunAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</View>
				)}
			</View>
			<View style={styles.actionsRow}>
				<TouchableOpacity
					onPress={run}
					style={[styles.actionBtn, styles.primaryAction]}
					disabled={runMutation.status === "pending"}
				>
					<Text style={styles.actionText}>
						{runMutation.status === "pending" ? "Running..." : "Run"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={remove}
					style={[styles.actionBtn, styles.dangerAction]}
					disabled={removeMutation.status === "pending"}
				>
					<Text style={styles.actionText}>
						{removeMutation.status === "pending" ? "Deleting..." : "Delete"}
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Summary</Text>
				{summary ? (
					<View style={styles.summaryBox}>
						<Text style={styles.sectionSub}>Headlines</Text>
						{summary.headlines.map((h) => (
							<Text key={h} style={styles.listItem}>
								• {h}
							</Text>
						))}
						<Text style={[styles.sectionSub, { marginTop: 16 }]}>
							Takeaways
						</Text>
						{summary.takeaways.map((t, i) => (
							<Text key={t} style={styles.listItem}>
								{i + 1}. {t}
							</Text>
						))}
					</View>
				) : (
					<Text style={styles.muted}>No summary yet.</Text>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#111" },
	content: { padding: 16, paddingBottom: 60 },
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#111",
	},
	muted: { color: "#777" },
	backBtn: { marginBottom: 8 },
	backText: { color: "#3b82f6", fontSize: 16 },
	title: { fontSize: 22, fontWeight: "700", color: "white", marginBottom: 4 },
	meta: { fontSize: 12, color: "#aaa", marginBottom: 10 },
	badgesRow: {
		flexDirection: "row",
		gap: 8,
		flexWrap: "wrap",
		marginBottom: 16,
	},
	badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
	badgeText: { fontSize: 11, fontWeight: "600", color: "white" },
	badgeDone: { backgroundColor: "#15803d" },
	badgeError: { backgroundColor: "#b91c1c" },
	badgeNeutral: { backgroundColor: "#374151" },
	actionsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
	actionBtn: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
	},
	primaryAction: { backgroundColor: "#2563eb" },
	dangerAction: { backgroundColor: "#dc2626" },
	actionText: { color: "white", fontWeight: "600" },
	section: { marginBottom: 24 },
	sectionTitle: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
	},
	sectionSub: {
		color: "white",
		fontSize: 13,
		fontWeight: "600",
		marginBottom: 6,
	},
	summaryBox: { backgroundColor: "#1e1e1e", padding: 14, borderRadius: 12 },
	listItem: { color: "#ddd", fontSize: 13, marginBottom: 4 },
});
