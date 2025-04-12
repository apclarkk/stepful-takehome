'use client';
import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { RolePill } from '../RolePill';
import { Role } from '@prisma/client';
import { Input } from '../Input';

export const Onboarding = () => {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { users } = useUsers();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement form submission
    };

    return (
        <div className="bg-white rounded-lg shadow-md max-w-md w-full mx-auto p-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="text-center gap-4">
                        <h1 className="text-2xl font-semibold">Welcome!</h1>
                        <h2 className="text-xl text-pink">Please create your user</h2>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <RolePill
                            role="COACH"
                            onClick={() => setSelectedRole('COACH')}
                            active={selectedRole === 'COACH'}
                        >
                            Coach
                        </RolePill>
                        <RolePill
                            role="STUDENT"
                            onClick={() => setSelectedRole('STUDENT')}
                            active={selectedRole === 'STUDENT'}
                        >
                            Student
                        </RolePill>
                    </div>
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
                    </div>
                </form>

                {users?.length && (
                    <div className="text-center">
                        <p className="font-medium mb-2">or</p>
                        <p className="text-pink text-lg mb-4">Select from an existing user</p>
                        <select
                            className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-pink"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-pink text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink"
                    disabled={!selectedRole || !firstName || !lastName || !phoneNumber}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

