import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";

export function useUsers() {
	const queryClient = useQueryClient();

	const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			const response = await fetch("/api/users");
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			return response.json();
		},
	});

	const { mutate: createUser, isPending: isCreatingUser } = useMutation({
		mutationFn: async (
			input: Omit<User, "id" | "createdAt" | "updatedAt">
		) => {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			if (!response.ok) {
				throw new Error("Failed to create user");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	return {
		users,
		isLoadingUsers,
		createUser,
		isCreatingUser,
	};
}
