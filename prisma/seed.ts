import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

/**
 * Creating test coaches, students, and slots
 */
async function main() {
	const coach1 = await prisma.user.create({
		data: {
			name: "John Coach",
			email: "coach1@stepful.com",
			phoneNumber: "123-456-7890",
			role: Role.COACH,
		},
	});

	const coach2 = await prisma.user.create({
		data: {
			name: "Jane Coach",
			email: "coach2@stepful.com",
			phoneNumber: "234-567-8901",
			role: Role.COACH,
		},
	});

	// Create test students
	const student1 = await prisma.user.create({
		data: {
			name: "Alice Student",
			email: "student1@email.com",
			phoneNumber: "345-678-9012",
			role: Role.STUDENT,
		},
	});

	const student2 = await prisma.user.create({
		data: {
			name: "Bob Student",
			email: "student2@email.com",
			phoneNumber: "456-789-0123",
			role: Role.STUDENT,
		},
	});

	// Create an available slot with coach1 (We're keeping the slot unbooked for testing)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const slot1 = await prisma.session.create({
		data: {
			startTime: tomorrow,
			endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
			coachId: coach1.id,
		},
	});

	// Create a booked slot with coach2 and student1
	const slot2 = await prisma.session.create({
		data: {
			startTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // 3 hours after slot1
			endTime: new Date(tomorrow.getTime() + 5 * 60 * 60 * 1000), // 2 hours later
			coachId: coach2.id,
			studentId: student1.id, // Booked by student1
		},
	});

	// Create a slot booked by student2
	const slot3 = await prisma.session.create({
		data: {
			startTime: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000), // 6 hours after slot1
			endTime: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // 2 hours later
			coachId: coach1.id,
			studentId: student2.id, // Booked by student2
		},
	});

	// Adding feedback for the booked slots
	await prisma.session.update({
		where: { id: slot2.id },
		data: {
			rating: 5,
			notes: "Great session! Path forward was clear and actionable.",
			coachId: coach2.id,
			studentId: student1.id,
		},
	});

	await prisma.session.update({
		where: { id: slot3.id },
		data: {
			rating: 4,
			notes: "Good session, learned a lot. Student was very engaged and motivated.",
			coachId: coach1.id,
			studentId: student2.id,
		},
	});

	console.log("Database seeded successfully!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
