'use client';
import { useCallback, useState } from 'react';
import { Role } from '@prisma/client';
import { Input } from '../Input';
import { RoleSelection } from './RoleSelection';
import { useUser } from '@/contexts/UserContext';

export const Onboarding = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const { setUser, allUsers, createUser } = useUser();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        if (selectedUser) {
            setUser(allUsers?.find((user) => user.id === selectedUser));
            return;
        }

        // TODO: Add zod validation
        if (!selectedRole || !firstName || !lastName || !phoneNumber || !email) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const newUser = await createUser({
                name: `${firstName} ${lastName}`,
                phoneNumber,
                role: selectedRole as Role,
                email: email,
            });


            setUser(newUser);
        } catch (error) {
            console.error('Failed to create user:', error);
            alert('Failed to create user. Please try again.');
        }
    }, [selectedUser, selectedRole, firstName, lastName, phoneNumber, email, allUsers, createUser, setUser]);

    const handleReset = useCallback(() => {
        setSelectedRole(null);
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setSelectedUser(null);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-auto p-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="text-center gap-4">
                        <h1 className="text-2xl font-semibold">Welcome!</h1>
                        <h2 className="text-xl text-pink">Please create your user</h2>
                    </div>

                    <RoleSelection selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4">
                        <Input
                            label="First Name"
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                            placeholder="First Name"
                        />

                        <Input
                            label="Last Name"
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                            placeholder="Last Name"
                        />

                        <Input
                            label="Phone Number"
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                        />

                        <Input
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                </form>

                {allUsers?.length && (
                    <div className="flex flex-col gap-2 text-center">
                        <p>or</p>
                        <p className="text-pink text-lg">Select from an existing user</p>
                        <select
                            className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-pink"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUser(e.target.value)}
                            value={selectedUser || ""}
                        >
                            <option value="">Select a user</option>
                            {allUsers.map((user) => (
                                <option key={user.id} value={user.id}>{user.name} - {user.role.charAt(0).toUpperCase() + user.role.toLowerCase().slice(1)}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-pink text-white rounded-full focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-pink"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                {(firstName || lastName || phoneNumber || selectedUser || selectedRole) && (
                    <button
                        type="button"
                        className="w-full text-pink text-center mt-2 hover:underline cursor-pointer"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};
