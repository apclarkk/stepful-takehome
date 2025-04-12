import React from 'react'
import { Role } from '@prisma/client'
import { RolePill } from '../RolePill'


export const RoleSelection = ({ selectedRole, setSelectedRole }: { selectedRole: Role | null, setSelectedRole: (role: Role) => void }): JSX.Element => {
    return (
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
    )
}

