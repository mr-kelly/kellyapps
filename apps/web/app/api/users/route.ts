import { prisma } from "@fincy/domains/prisma";

export async function GET() {
	const users = await prisma.user.findMany({
		include: { posts: true },
		take: 20,
		orderBy: { createdAt: "desc" },
	});
	return Response.json(users);
}
