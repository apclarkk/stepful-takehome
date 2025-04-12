import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const coachId = searchParams.get("coachId");
		const studentId = searchParams.get("studentId");

		const where = {
			...(coachId && { coachId }),
			...(studentId && { studentId }),
		};

		const slots = await prisma.session.findMany({
			where,
			include: {
				coach: true,
				student: true,
			},
		});
		return NextResponse.json(slots);
	} catch (error: unknown) {
		console.error("Error fetching slots:", error);
		return NextResponse.json(
			{ error: "Failed to fetch slots" },
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

		const slot = await prisma.session.create({
			data: {
				coachId,
				studentId,
				startTime,
				endTime,
				notes,
				rating: +rating,
			},
		});
		return NextResponse.json(slot);
	} catch (error: unknown) {
		console.error("Error creating slot:", error);
		return NextResponse.json(
			{ error: "Failed to create slot" },
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

		const slot = await prisma.session.update({
			where: { id },
			data: body,
		});
		return NextResponse.json(slot);
	} catch (error: unknown) {
		console.error("Error updating slot:", error);
		return NextResponse.json(
			{ error: "Failed to update slot" },
			{ status: 500 }
		);
	}
}
