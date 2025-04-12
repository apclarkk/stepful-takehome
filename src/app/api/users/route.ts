import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const role = searchParams.get("role") as Role | null;

		const users = await prisma.user.findMany({
			where: role ? { role } : undefined,
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const { name, role, email, phoneNumber } = await request.json();
		// TODO: Add zod validation
		const user = await prisma.user.create({
			data: {
				name,
				role,
				email,
				phoneNumber,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 }
		);
	}
}
