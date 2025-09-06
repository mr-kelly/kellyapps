import { useTRPC } from "@fincy/domains/trpcClient";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	FlatList,
	Modal,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
// no navigation yet

export default function TasksScreen() {
	const trpc = useTRPC();
	const router = useRouter();
	const queryClient = useQueryClient();
	const listQuery = trpc.tasks.list.useQuery();
	type TaskRow = NonNullable<typeof listQuery.data>[number];
	const tasks = listQuery.data ?? [];
	const [createOpen, setCreateOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");

	const createMutation = trpc.tasks.create.useMutation({
		onSuccess: () => {
			setCreateOpen(false);
			setNewTitle("");
			listQuery.refetch();
		},
	});
	const runMutation = trpc.tasks.run.useMutation({
		onMutate: async (vars) => {
			const key = ["tasks", "list"] as const;
			await queryClient.cancelQueries({ queryKey: key });
			const prev = queryClient.getQueryData<TaskRow[]>(key);
			if (prev) {
				queryClient.setQueryData<TaskRow[]>(
					key,
					prev.map((t) =>
						t.id === vars.id ? { ...t, status: "done_today" } : t,
					),
				);
			}
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			const key = ["tasks", "list"] as const;
			if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
		},
		onSettled: () => listQuery.refetch(),
	});
	const runAllMutation = trpc.tasks.runAll.useMutation({
		onMutate: async () => {
			const key = ["tasks", "list"] as const;
			const prev = queryClient.getQueryData<TaskRow[]>(key);
			if (prev) {
				queryClient.setQueryData<TaskRow[]>(
					key,
					prev.map((t) => ({ ...t, status: "done_today" })),
				);
			}
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			const key = ["tasks", "list"] as const;
			if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
		},
		onSettled: () => listQuery.refetch(),
	});
	function runOne(id: string) {
		runMutation.mutate({ id });
	}
	function runAll() {
		runAllMutation.mutate();
	}
	function createTask() {
		if (!newTitle.trim()) return;
		createMutation.mutate({
			title: newTitle.trim(),
			sourceType: "url",
			sourceInput: "",
			frequency: "daily",
			delivery: ["in-app"],
			outputFormat: "summary",
			language: "en",
			triggerTime: "07:30",
			timezone: "HKT",
		});
	}
	const refreshing = listQuery.isFetching;

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<Text style={styles.title}>Tasks</Text>
				<TouchableOpacity onPress={runAll} style={styles.runAllBtn}>
					<Text style={styles.runAllText}>Run All</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={tasks}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => listQuery.refetch()}
					/>
				}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<View style={{ flex: 1 }}>
							<Text
								style={styles.cardTitle}
								// @ts-ignore dynamic route not in inferred union yet
								onPress={() => router.push(`/task/${item.id}`)}
							>
								{item.title}
							</Text>
							<Text style={styles.meta}>
								{item.frequency} · {item.timezone} · {item.status}
							</Text>
							{(() => {
								type Summary = { headlines: string[] };
								const ls = item.lastSummary as unknown;
								if (
									ls &&
									typeof ls === "object" &&
									"headlines" in (ls as Summary) &&
									Array.isArray((ls as Summary).headlines) &&
									(ls as Summary).headlines.length > 0
								) {
									return (
										<Text numberOfLines={2} style={styles.summary}>
											{(ls as Summary).headlines[0]}
										</Text>
									);
								}
								return null;
							})()}
						</View>
						<TouchableOpacity
							onPress={() => runOne(item.id)}
							style={styles.runBtn}
						>
							<Text style={styles.runBtnText}>Run</Text>
						</TouchableOpacity>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.empty}>No tasks</Text>}
				contentContainerStyle={tasks.length ? undefined : styles.emptyContainer}
			/>
			<TouchableOpacity style={styles.fab} onPress={() => setCreateOpen(true)}>
				<Text style={styles.fabText}>＋</Text>
			</TouchableOpacity>
			<Modal visible={createOpen} transparent animationType="fade">
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>New Task</Text>
						<TextInput
							value={newTitle}
							onChangeText={setNewTitle}
							placeholder="Title"
							placeholderTextColor="#666"
							style={styles.input}
						/>
						<View style={styles.modalRow}>
							<TouchableOpacity
								style={styles.modalBtn}
								onPress={() => setCreateOpen(false)}
							>
								<Text style={styles.modalBtnText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalBtn, styles.modalPrimary]}
								onPress={createTask}
							>
								<Text style={styles.modalPrimaryText}>Create</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 12 },
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: { fontSize: 24, fontWeight: "600" },
	runAllBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		backgroundColor: "#444",
		borderRadius: 6,
	},
	runAllText: { color: "white", fontWeight: "500" },
	card: {
		flexDirection: "row",
		backgroundColor: "#1e1e1e",
		padding: 12,
		borderRadius: 10,
		alignItems: "flex-start",
		gap: 12,
		marginBottom: 10,
	},
	cardTitle: { fontSize: 16, fontWeight: "600", color: "white" },
	meta: { fontSize: 12, color: "#bbb", marginTop: 2 },
	summary: { fontSize: 12, color: "#ddd", marginTop: 6 },
	runBtn: {
		backgroundColor: "#2563eb",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		alignSelf: "center",
	},
	runBtnText: { color: "white", fontWeight: "600" },
	empty: { textAlign: "center", marginTop: 40, color: "#666" },
	emptyContainer: { flexGrow: 1, justifyContent: "center" },
	fab: {
		position: "absolute",
		right: 20,
		bottom: 30,
		backgroundColor: "#2563eb",
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
		elevation: 4,
	},
	fabText: { color: "white", fontSize: 32, marginTop: -4 },
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	modalCard: {
		backgroundColor: "#1e1e1e",
		padding: 20,
		borderRadius: 14,
		width: "100%",
		gap: 16,
	},
	modalTitle: { fontSize: 18, fontWeight: "600", color: "white" },
	input: {
		backgroundColor: "#2a2a2a",
		color: "white",
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 8,
		fontSize: 14,
	},
	modalRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
	modalBtn: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 8,
		backgroundColor: "#333",
	},
	modalBtnText: { color: "#ddd" },
	modalPrimary: { backgroundColor: "#2563eb" },
	modalPrimaryText: { color: "white", fontWeight: "600" },
});
