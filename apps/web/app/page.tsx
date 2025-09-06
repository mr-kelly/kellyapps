"use client";
import { useTRPC } from "@fincy/domains/trpcClient";
import type { Task } from "@fincy/domains/types/task";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { EmptyState } from "./(components)/EmptyState";
import { NewTaskDialog } from "./(components)/NewTaskDialog";
import { QuickActionsBar } from "./(components)/QuickActionsBar";
import { TaskCard } from "./(components)/TaskCard";
import { TaskDetailPanel } from "./(components)/TaskDetailPanel";

export default function HomePage() {
	const trpc = useTRPC();
	const listQuery = trpc.tasks.list.useQuery();
	const queryClient = useQueryClient();
	const createMutation = trpc.tasks.create.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	const removeMutation = trpc.tasks.remove.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	type TaskRow = {
		id: string;
		title: string;
		status: string;
		sourceType: string;
		sourceInput: string;
		frequency: string;
		delivery: string[];
		outputFormat: string;
		language: string;
		triggerTime: string;
		timezone: string;
		lastRunAt: Date | null;
		nextRunAt: Date | null;
		lastSummary: unknown | null;
		createdAt: Date;
		updatedAt: Date;
	};
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
		onError: (_err, _vars, ctx) => {
			const key = ["tasks", "list"] as const;
			if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
		},
		onSettled: () => listQuery.refetch(),
	});
	const runAllMutation = trpc.tasks.runAll.useMutation({
		onMutate: async () => {
			const key = ["tasks", "list"] as const;
			await queryClient.cancelQueries({ queryKey: key });
			const prev = queryClient.getQueryData<Task[]>(key);
			if (prev) {
				queryClient.setQueryData<Task[]>(
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
	const hello = trpc.util.hello.useQuery({ name: "Web" });
	const tasks: Task[] = (listQuery.data as Task[] | undefined) ?? [];
	const [selectedId, setSelectedId] = React.useState<string | undefined>();
	const selected = tasks.find((t) => t.id === selectedId);
	const [showNew, setShowNew] = React.useState(false);
	const [mobileDetailOpen, setMobileDetailOpen] = React.useState(false);

	function openTask(id: string) {
		setSelectedId(id);
		setMobileDetailOpen(true);
	}
	const runAll = () => runAllMutation.mutate();
	const create = (partial: { title: string }) => {
		createMutation.mutate({
			title: partial.title,
			sourceType: "url",
			sourceInput: "",
			frequency: "daily",
			delivery: ["in-app"],
			outputFormat: "summary",
			language: "en",
			triggerTime: "07:30",
			timezone: "HKT",
		});
	};

	return (
		<Box
			component="main"
			sx={{
				display: "flex",
				flexDirection: { xs: "column", md: "row" },
				gap: { xs: 2, md: 3 },
				px: { xs: 2, md: 3 },
				pt: 2,
				pb: { xs: 10, md: 2 },
				maxWidth: 1600,
				mx: "auto",
				width: "100%",
			}}
		>
			{/* Task List */}
			<Box
				component="section"
				sx={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 2,
					flexBasis: { md: "33%" },
				}}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography level="title-md">Tasks</Typography>
					<Typography level="body-sm" color="neutral">
						{hello.data?.greeting}
					</Typography>
					<Button
						size="sm"
						onClick={() => setShowNew(true)}
						variant="solid"
						color="primary"
					>
						+ New
					</Button>
				</Stack>
				{tasks.length === 0 ? (
					<EmptyState onCreate={() => setShowNew(true)} />
				) : (
					<Stack gap={1.5}>
						{tasks.map((t) => (
							<TaskCard
								key={t.id}
								task={t}
								onOpen={() => openTask(t.id)}
								onShare={() => alert("Share coming soon")}
								onDelete={() => removeMutation.mutate({ id: t.id })}
								onDuplicate={() => create({ title: `${t.title} (copy)` })}
								onEdit={() => alert("Edit placeholder")}
							/>
						))}
					</Stack>
				)}
			</Box>
			{/* Detail Panel (desktop) */}
			<Box
				component="aside"
				sx={{
					display: { xs: "none", md: "block" },
					flexBasis: { md: "33%" },
					bgcolor: "background.surface",
					border: "1px solid",
					borderColor: "neutral.outlinedBorder",
					borderRadius: "xl",
					overflow: "hidden",
					minHeight: 540,
				}}
			>
				<TaskDetailPanel
					task={selected}
					onClose={() => setSelectedId(undefined)}
					regenerate={(id) => runMutation.mutate({ id })}
					runOne={(id) => runMutation.mutate({ id })}
				/>
			</Box>
			{/* Quick Actions (desktop) */}
			<Box sx={{ display: { xs: "none", md: "flex" }, flexBasis: 220 }}>
				<QuickActionsBar
					onNew={() => setShowNew(true)}
					onRunAll={runAll}
					onExport={() => alert("Export coming soon")}
				/>
			</Box>

			{/* Mobile Task Detail Drawer */}
			{mobileDetailOpen && (
				<Box
					sx={{
						display: { md: "none" },
						position: "fixed",
						inset: 0,
						zIndex: 30,
						displayPrint: "none",
					}}
				>
					<Box
						onClick={() => setMobileDetailOpen(false)}
						sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.7)" }}
					/>
					<Sheet
						variant="solid"
						sx={{
							position: "relative",
							mt: "auto",
							height: "70%",
							width: "100%",
							borderTopLeftRadius: "lg",
							borderTopRightRadius: "lg",
							border: "1px solid",
							borderColor: "neutral.outlinedBorder",
							bgcolor: "background.level1",
						}}
					>
						<TaskDetailPanel
							task={selected}
							onClose={() => setMobileDetailOpen(false)}
							regenerate={(id) => runMutation.mutate({ id })}
							runOne={(id) => runMutation.mutate({ id })}
						/>
					</Sheet>
				</Box>
			)}

			{/* Mobile Quick Actions Bar */}
			<Box
				sx={{
					display: { md: "none" },
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 20,
				}}
			>
				<QuickActionsBar
					onNew={() => setShowNew(true)}
					onRunAll={runAll}
					onExport={() => alert("Export coming soon")}
				/>
			</Box>

			<NewTaskDialog
				open={showNew}
				onClose={() => setShowNew(false)}
				create={(p) => create({ title: p.title })}
			/>
		</Box>
	);
}
