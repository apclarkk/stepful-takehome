import { Role } from '@prisma/client'
import React from 'react'
import { PeopleMultiple, Person } from 'akar-icons'

export const RolePill = ({ role, children, active = true, ...props }: { role: Role, children?: React.ReactNode, active?: boolean } & React.ComponentProps<'button'>) => {
    return (
        <button {...props} className={`flex items-center gap-1 px-4 py-1 border rounded-full cursor-pointer ${active ? 'text-white bg-pink border-pink' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {role === 'COACH' ? <PeopleMultiple strokeWidth={1.5} size={21} /> : <Person strokeWidth={1.5} size={21} />}
            {children ?? role}
        </button>
    )
}

