import { prisma } from "../lib/db";

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
	console.log("Seed complete");
}

main().finally(async () => {
	await prisma.$disconnect();
});
