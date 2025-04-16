import { Session, User } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type SessionType = "upcoming" | "past";

interface UseSessionsOptions {
	user: User;
	type: SessionType;
}

export function useSessions({ user, type = "upcoming" }: UseSessionsOptions) {
	const queryClient = useQueryClient();

	const { id: userId, role } = user;

	const { data: userSessions } = useQuery<
		(Session & { coach: User | null; student: User | null })[]
	>({
		queryKey: ["sessions", userId, type],
		queryFn: async () => {
			const params = new URLSearchParams({
				[role === "COACH" ? "coachId" : "studentId"]: userId,
				type,
			});

			const response = await fetch(`/api/sessions?${params}`);
			if (!response.ok) {
				throw new Error("Failed to fetch sessions");
			}
			return response.json();
		},
		enabled: Boolean(userId && type),
	});

	const { mutateAsync: deleteSession } = useMutation<Session, Error, string>({
		mutationFn: async (sessionId: string) => {
			const response = await fetch(`/api/sessions?id=${sessionId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete session");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sessions", userId, type],
			});
		},
	});

	const { mutateAsync: updateSession } = useMutation<
		Session,
		Error,
		{ sessionId: string; sessionData: Partial<Session> }
	>({
		mutationFn: async ({ sessionId, sessionData }) => {
			const response = await fetch(`/api/sessions?id=${sessionId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(sessionData),
			});

			if (!response.ok) {
				throw new Error("Failed to update session");
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["sessions", userId, type],
			});
		},
	});

	return { userSessions, deleteSession, updateSession };
}
