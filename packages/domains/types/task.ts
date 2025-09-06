export interface TaskSummary {
	date: string;
	headlines: string[];
	takeaways: string[];
}
export type TaskStatus = "done_today" | "scheduled" | "error";
export type SourceType = "url" | "keyword" | "ticker";
export type Frequency = "daily" | "weekly" | "realtime";
export type Delivery = "in-app" | "email" | "im";
export type OutputFormat = "summary" | "pdf" | "ppt";
export type Language = "en" | "zh_HK";
export type Timezone = "HKT" | "ET";
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
	lastRunAt?: string | null;
	nextRunAt?: string | null;
	lastSummary?: TaskSummary | null;
	createdAt?: string;
	updatedAt?: string;
}
