"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TaskStatus = "done-today" | "scheduled" | "error";
export type SourceType = "url" | "keyword" | "ticker";
export type Frequency = "daily" | "weekly" | "realtime";
export type Delivery = "in-app" | "email" | "im";

export interface TaskSummary {
	date: string; // ISO date (yyyy-mm-dd)
	headlines: string[]; // length 5
	takeaways: string[]; // length 3
}

export interface Task {
	id: string;
	title: string;
	sourceType: SourceType;
	sourceInput: string;
	frequency: Frequency;
	delivery: Delivery[];
	outputFormat: "summary" | "pdf" | "ppt";
	language: "en" | "zh-HK";
	triggerTime: string; // HH:MM
	timezone: "HKT" | "ET";
	status: TaskStatus;
	lastRunAt?: string; // ISO datetime
	nextRunAt?: string; // ISO datetime
	lastSummary?: TaskSummary;
}

const STORAGE_KEY = "news-summary-agent.tasks.v1";

function todayISODate() {
	return new Date().toISOString().slice(0, 10);
}

function fakeSummary(
	title: string,
	tz: "HKT" | "ET",
	lang: "en" | "zh-HK",
): TaskSummary {
	const date = todayISODate();
	const base = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ")[0] || "Market";
	const headlinesEn = [
		`${base} futures edge higher amid cautious sentiment`,
		"Liquidity watch: funding rates steady across majors",
		"Regulatory focus intensifies on cross-border flows",
		"Analysts highlight rotation into quality balance sheets",
		"Volatility suppressed as participants await catalysts",
	];
	const takeawaysEn = [
		"Maintain disciplined positioning into macro prints",
		"Watch credit spreads for early stress signals",
		"Liquidity pockets thinning near session open",
	];
	const zhMap = {
		h1: `${base} 期貨溫和走高 市場氣氛審慎`,
		h2: "資金利率穩定 無明顯偏差",
		h3: "監管關注加強 跨境資金流聚焦",
		h4: "分析指資金輪動至資產負債表穩健股份",
		h5: "波動率受抑 市場等待觸發因素",
		t1: "數據公布前保持紀律倉位",
		t2: "留意信貸利差作早期壓力指標",
		t3: "開市前流動性口袋收窄",
	} as const;
	const headlinesZh = [zhMap.h1, zhMap.h2, zhMap.h3, zhMap.h4, zhMap.h5];
	const takeawaysZh = [zhMap.t1, zhMap.t2, zhMap.t3];
	return {
		date,
		headlines: lang === "en" ? headlinesEn : headlinesZh,
		takeaways: lang === "en" ? takeawaysEn : takeawaysZh,
	};
}

function seedTasks(): Task[] {
	const now = new Date();
	// today date pre-compute (reserved for future scheduling logic)
	const iso = (d: Date) => d.toISOString();
	const a = new Date(now);
	a.setHours(7, 30, 0, 0);
	const b = new Date(now);
	b.setHours(8, 0, 0, 0);
	const c = new Date(now);
	c.setHours(21, 0, 0, 0);
	const tasks: Task[] = [
		{
			id: "hk-morning",
			title: "HK Morning Brief — 07:30",
			sourceType: "ticker",
			sourceInput: "HSI,700,3690",
			frequency: "daily",
			delivery: ["in-app"],
			outputFormat: "summary",
			language: "zh-HK",
			triggerTime: "07:30",
			timezone: "HKT",
			status: "scheduled",
			nextRunAt: iso(a),
		},
		{
			id: "us-morning",
			title: "US Morning Brief — 08:00",
			sourceType: "keyword",
			sourceInput: "macro, rate futures",
			frequency: "daily",
			delivery: ["in-app", "email"],
			outputFormat: "summary",
			language: "en",
			triggerTime: "08:00",
			timezone: "ET",
			status: "scheduled",
			nextRunAt: iso(b),
		},
		{
			id: "aapl-earnings",
			title: "AAPL Earnings Watch",
			sourceType: "ticker",
			sourceInput: "AAPL",
			frequency: "weekly",
			delivery: ["in-app"],
			outputFormat: "summary",
			language: "en",
			triggerTime: "21:00",
			timezone: "ET",
			status: Math.random() < 0.4 ? "error" : "scheduled",
			nextRunAt: iso(c),
		},
	];
	return tasks.map((t) => ({ ...t, lastSummary: undefined }));
}

function load(): Task[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			const seeded = seedTasks();
			localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
			return seeded;
		}
		return JSON.parse(raw) as Task[];
	} catch {
		return [];
	}
}

function persist(tasks: Task[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	} catch (e) {
		// ignore persistence errors (quota / private mode)
	}
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
}

export function useTasks(): UseTasksApi {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [selectedId, setSelectedId] = useState<string | undefined>();

	useEffect(() => {
		setTasks(load());
	}, []);
	useEffect(() => {
		if (tasks.length) persist(tasks);
	}, [tasks]);

	const select = useCallback((id?: string) => setSelectedId(id), []);

	const create = useCallback(
		(partial: Partial<Task> & { title: string }): Task => {
			const task: Task = {
				id: crypto.randomUUID(),
				title: partial.title,
				sourceType: partial.sourceType || "url",
				sourceInput: partial.sourceInput || "",
				frequency: partial.frequency || "daily",
				delivery: partial.delivery || ["in-app"],
				outputFormat: partial.outputFormat || "summary",
				language: partial.language || "en",
				triggerTime: partial.triggerTime || "07:30",
				timezone: partial.timezone || "HKT",
				status: "scheduled",
				nextRunAt: new Date().toISOString(),
			};
			setTasks((prev) => [...prev, task]);
			setSelectedId(task.id);
			return task;
		},
		[],
	);

	const update = useCallback((id: string, patch: Partial<Task>) => {
		setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
	}, []);

	const remove = useCallback((id: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== id));
		setSelectedId((p) => (p === id ? undefined : p));
	}, []);

	const run = useCallback((task: Task) => {
		const summary = fakeSummary(task.title, task.timezone, task.language);
		const nowIso = new Date().toISOString();
		return {
			...task,
			status: "done-today",
			lastRunAt: nowIso,
			lastSummary: summary,
		} as Task;
	}, []);

	const runAll = useCallback(() => {
		setTasks((prev) => prev.map(run));
	}, [run]);

	const runOne = useCallback(
		(id: string) => {
			setTasks((prev) => prev.map((t) => (t.id === id ? run(t) : t)));
		},
		[run],
	);

	const regenerate = useCallback((id: string) => runOne(id), [runOne]);

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
	};
}
