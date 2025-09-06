import { prisma } from ".";

async function main() {
	const user = await prisma.user.upsert({
		where: { email: "demo@example.com" },
		update: {},
		create: { email: "demo@example.com", name: "Demo User" },
	});
	await prisma.post.create({
		data: {
			title: "Hello Prisma",
			content: "First post content",
			authorId: user.id,
			published: true,
		},
	});

	// Sample tasks
	const tasksData = [
		{
			title: "Daily AI Market News",
			sourceType: "url" as const,
			sourceInput: "https://example.com/markets",
			frequency: "daily" as const,
			delivery: ["in-app"],
			outputFormat: "summary" as const,
			language: "en" as const,
			triggerTime: "07:30",
			timezone: "HKT" as const,
			status: "scheduled" as const,
		},
		{
			title: "Weekly Crypto Digest",
			sourceType: "keyword" as const,
			sourceInput: "crypto",
			frequency: "weekly" as const,
			delivery: ["in-app", "email"],
			outputFormat: "summary" as const,
			language: "en" as const,
			triggerTime: "08:00",
			timezone: "ET" as const,
			status: "scheduled" as const,
		},
		{
			title: "香港 財經 新聞",
			sourceType: "keyword" as const,
			sourceInput: "香港 財經",
			frequency: "daily" as const,
			delivery: ["in-app"],
			outputFormat: "summary" as const,
			language: "zh_HK" as const,
			triggerTime: "09:00",
			timezone: "HKT" as const,
			status: "scheduled" as const,
		},
	];

	for (const t of tasksData) {
		await prisma.task.create({
			data: {
				...t,
				delivery: JSON.stringify(t.delivery),
				nextRunAt: new Date(),
			},
		});
	}

	console.log("Seed complete (domains) with sample tasks");
}

main().finally(async () => {
	await prisma.$disconnect();
});
