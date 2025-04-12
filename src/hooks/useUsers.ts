import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@prisma/client";

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">;

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

	const { mutateAsync: createUser, isPending: isCreatingUser } = useMutation<
		User,
		Error,
		CreateUserInput
	>({
		mutationFn: async (input: CreateUserInput) => {
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
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			return data;
		},
	});

	return {
		users,
		isLoadingUsers,
		createUser,
		isCreatingUser,
	};
}
