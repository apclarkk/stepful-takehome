import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SessionType } from "@/hooks/useSessions";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const coachId = searchParams.get("coachId");
		const studentId = searchParams.get("studentId");
		const type = searchParams.get("type") as SessionType;
		const now = new Date();

		let where: Record<string, any> = {};

		if (coachId) {
			// Coach is querying - just show their sessions
			where.coachId = coachId;
		} else if (studentId) {
			// Student is querying - show their sessions AND available sessions
			where = {
				OR: [{ studentId }, { studentId: null }],
			};
		}

		// Filter sessions based on type (upcoming or past)
		if (type === "upcoming") {
			where.endTime = {
				gte: now,
			};
		} else if (type === "past") {
			where.endTime = {
				lt: now,
			};
		}

		const sessions = await prisma.session.findMany({
			where,
			include: {
				coach: true,
				student: true,
			},
		});
		return NextResponse.json(sessions);
	} catch (error: unknown) {
		console.error("Error fetching sessions:", error);
		return NextResponse.json(
			{ error: "Failed to fetch sessions" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { coachId, studentId, startTime, endTime, notes, rating } =
			await request.json();

		// TODO: Add zod validation
		if (!coachId || startTime || !endTime) {
			return NextResponse.json(
				{ error: "Missing required parameters" },
				{ status: 400 }
			);
		}

		const session = await prisma.session.create({
			data: {
				coachId,
				studentId,
				startTime,
				endTime,
				notes,
				rating: +rating,
			},
		});
		return NextResponse.json(session);
	} catch (error: unknown) {
		console.error("Error creating session:", error);
		return NextResponse.json(
			{ error: "Failed to create session" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id") as string;
		const body = await request.json();

		// TODO: Add zod validation
		if (!body) {
			return NextResponse.json(
				{ error: "Missing body" },
				{ status: 400 }
			);
		}

		const session = await prisma.session.update({
			where: { id },
			data: body,
		});
		return NextResponse.json(session);
	} catch (error: unknown) {
		console.error("Error updating session:", error);
		return NextResponse.json(
			{ error: "Failed to update session" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id") as string;

		const session = await prisma.session.delete({ where: { id } });

		return NextResponse.json({ session }, { status: 200 });
	} catch (error: unknown) {
		console.error("Error updating session:", error);
		return NextResponse.json(
			{ error: "Failed to delete session" },
			{ status: 500 }
		);
	}
}
