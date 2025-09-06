import React, { useCallback, useMemo } from "react";
import { useTRPC } from "../trpcClient";

export interface TaskSummary {
	date: string;
	headlines: string[];
	takeaways: string[];
}
export const SOURCE_TYPES = ["url", "keyword", "ticker"] as const;
export const FREQUENCIES = ["daily", "weekly", "realtime"] as const;
export const DELIVERIES = ["in-app", "email", "im"] as const;
export const OUTPUT_FORMATS = ["summary", "pdf", "ppt"] as const;
export const LANGUAGES = ["en", "zh-HK"] as const;
export const TIMEZONES = ["HKT", "ET"] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];
export type Frequency = (typeof FREQUENCIES)[number];
export type Delivery = (typeof DELIVERIES)[number];
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export type Language = (typeof LANGUAGES)[number];
export type Timezone = (typeof TIMEZONES)[number];
export type TaskStatus = "done-today" | "scheduled" | "error";

export interface Task {
	id: string;
	title: string;
	sourceType: SourceType;
	sourceInput: string;
	frequency: Frequency;
	delivery: Delivery[];
	outputFormat: OutputFormat;
	language: Language;
	triggerTime: string;
	timezone: Timezone;
	status: TaskStatus;
	lastRunAt?: string;
	nextRunAt?: string;
	lastSummary?: TaskSummary;
}

export interface UseTasksApi {
	tasks: Task[];
	selected?: Task;
	select: (id?: string) => void;
	create: (partial: Partial<Task> & { title: string }) => Task;
	update: (id: string, patch: Partial<Task>) => void;
	remove: (id: string) => void;
	runAll: () => void;
	runOne: (id: string) => void;
	regenerate: (id: string) => void;
	refreshing: boolean;
}

export function useTasks(): UseTasksApi {
	const trpc = useTRPC();
	const listQuery = trpc.tasks.list.useQuery();
	const createMutation = trpc.tasks.create.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	const updateMutation = trpc.tasks.update.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	const removeMutation = trpc.tasks.remove.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	const runMutation = trpc.tasks.run.useMutation({
		onSuccess: () => listQuery.refetch(),
	});
	const runAllMutation = trpc.tasks.runAll.useMutation({
		onSuccess: () => listQuery.refetch(),
	});

	const [selectedId, setSelectedId] = React.useState<string | undefined>();
	const select = useCallback((id?: string) => setSelectedId(id), []);

	const create = useCallback(
		(partial: Partial<Task> & { title: string }): Task => {
			const pick = <T extends readonly string[]>(
				arr: T,
				val: unknown,
				fallback: T[number],
			) => (arr.includes(val as string) ? (val as T[number]) : fallback);
			const base = {
				title: partial.title,
				sourceType: pick(SOURCE_TYPES, partial.sourceType, "url"),
				sourceInput: partial.sourceInput || "",
				frequency: pick(FREQUENCIES, partial.frequency, "daily"),
				delivery: (Array.isArray(partial.delivery)
					? partial.delivery.filter((d) => DELIVERIES.includes(d as Delivery))
					: ["in-app"]) as Delivery[],
				outputFormat: pick(OUTPUT_FORMATS, partial.outputFormat, "summary"),
				language: pick(LANGUAGES, partial.language, "en"),
				triggerTime: partial.triggerTime || "07:30",
				timezone: pick(TIMEZONES, partial.timezone, "HKT"),
			} satisfies Omit<
				Task,
				"id" | "status" | "nextRunAt" | "lastRunAt" | "lastSummary"
			>;
			createMutation.mutate({ ...base });
			const temp: Task = {
				id: "temp",
				status: "scheduled",
				nextRunAt: new Date().toISOString(),
				...base,
			};
			setSelectedId(temp.id);
			return temp;
		},
		[createMutation],
	);

	const update = useCallback(
		(id: string, patch: Partial<Task>) => {
			updateMutation.mutate({ id, patch: patch as Record<string, unknown> });
		},
		[updateMutation],
	);

	const remove = useCallback(
		(id: string) => {
			removeMutation.mutate({ id });
			setSelectedId((p) => (p === id ? undefined : p));
		},
		[removeMutation],
	);

	const runAll = useCallback(
		() => runAllMutation.mutate(undefined),
		[runAllMutation],
	);
	const runOne = useCallback(
		(id: string) => runMutation.mutate({ id }),
		[runMutation],
	);
	const regenerate = useCallback((id: string) => runOne(id), [runOne]);

	const tasks = (listQuery.data ?? []) as unknown as Task[];
	const selected = useMemo(
		() => tasks.find((t) => t.id === selectedId),
		[tasks, selectedId],
	);

	return {
		tasks,
		selected,
		select,
		create,
		update,
		remove,
		runAll,
		runOne,
		regenerate,
		refreshing: listQuery.isFetching,
	};
}
