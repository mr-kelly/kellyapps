import { z } from "zod";
import { prisma } from "../../prisma";
import { procedure, router } from "../trpcContext";
interface TaskRowDb {
	id: string;
	title: string;
	sourceType: string;
	sourceInput: string;
	frequency: string;
	delivery: string;
	outputFormat: string;
	language: string;
	triggerTime: string;
	timezone: string;
	status: string;
	lastRunAt: Date | null;
	nextRunAt: Date | null;
	lastSummary: unknown | null;
	createdAt: Date;
	updatedAt: Date;
}
function toApi(row: TaskRowDb) {
	return { ...row, delivery: JSON.parse(row.delivery) as string[] };
}

function buildSummary(title: string, _language: string) {
	const now = new Date();
	const date = now.toISOString().slice(0, 10);
	const base = title.split(" ")[0] || "Task";
	const headlines = [
		`${base} update one`,
		`${base} update two`,
		`${base} update three`,
		`${base} update four`,
		`${base} update five`,
	];
	const takeaways = ["Action A", "Action B", "Action C"];
	return { date, headlines, takeaways };
}

const taskIdInput = z.object({ id: z.string().min(1) });
const baseTaskShape = {
	title: z.string().min(2),
	sourceType: z.enum(["url", "keyword", "ticker"]),
	sourceInput: z.string().default(""),
	frequency: z.enum(["daily", "weekly", "realtime"]).default("daily"),
	delivery: z
		.array(z.enum(["in-app", "email", "im"]))
		.min(1)
		.default(["in-app"]),
	outputFormat: z.enum(["summary", "pdf", "ppt"]).default("summary"),
	language: z.enum(["en", "zh_HK"]).default("en"),
	triggerTime: z
		.string()
		.regex(/^[0-2]\d:[0-5]\d$/)
		.default("07:30"),
	timezone: z.enum(["HKT", "ET"]).default("HKT"),
};
const taskCreateInput = z.object(baseTaskShape);
const taskUpdatePatch = z
	.object({
		...baseTaskShape,
		language: z
			.enum(["en", "zh_HK", "zh-HK"])
			.transform((v) => (v === "zh-HK" ? "zh_HK" : v)),
	})
	.partial();

export const tasksRouter = router({
	list: procedure.query(async () => {
		const rows = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
		return rows.map(toApi);
	}),
	get: procedure.input(taskIdInput).query(async ({ input }) => {
		const row = await prisma.task.findUnique({ where: { id: input.id } });
		if (!row) return null;
		return toApi(row);
	}),
	create: procedure.input(taskCreateInput).mutation(async ({ input }) => {
		const created = await prisma.task.create({
			data: {
				...input,
				delivery: JSON.stringify(input.delivery),
				status: "scheduled",
				nextRunAt: new Date(),
			},
		});
		return toApi(created);
	}),
	update: procedure
		.input(z.object({ id: z.string().min(1), patch: taskUpdatePatch }))
		.mutation(async ({ input }) => {
			const { id, patch } = input;
			const data: Record<string, unknown> = { ...patch };
			if (patch.delivery) data.delivery = JSON.stringify(patch.delivery);
			// language comes already in DB enum form
			const updated = await prisma.task.update({ where: { id }, data });
			return toApi(updated);
		}),
	remove: procedure.input(taskIdInput).mutation(async ({ input }) => {
		await prisma.task.delete({ where: { id: input.id } });
		return { id: input.id };
	}),
	run: procedure.input(taskIdInput).mutation(async ({ input }) => {
		const row = await prisma.task.findUnique({ where: { id: input.id } });
		if (!row) throw new Error("Task not found");
		const summary = buildSummary(row.title, row.language);
		const updated = await prisma.task.update({
			where: { id: row.id },
			data: {
				status: "done_today",
				lastRunAt: new Date(),
				lastSummary: summary,
			},
		});
		return toApi(updated);
	}),
	runAll: procedure.mutation(async () => {
		const rows = await prisma.task.findMany();
		const results = await Promise.all(
			rows.map(async (r) => {
				const summary = buildSummary(r.title, r.language);
				const updated = await prisma.task.update({
					where: { id: r.id },
					data: {
						status: "done_today",
						lastRunAt: new Date(),
						lastSummary: summary,
					},
				});
				return toApi(updated);
			}),
		);
		return results;
	}),
});
