import { useUser } from '@/contexts/UserContext'
import { useSessions, SessionType } from '@/hooks/useSessions'
import { User, Session } from '@prisma/client'
import React, { useCallback, useMemo } from 'react'
import { Card } from '../Card'
import { SessionDetails } from './SessionDetails'
import { format, compareAsc } from 'date-fns'
import { useSessionType } from '@/providers/SessionTypeProvider'

export const SessionViewer = () => {
    const { user } = useUser()
    const { sessionType } = useSessionType()

    if (!user) {
        return <></>
    }

    return (
        <SessionViewerInner user={user} type={sessionType} />
    )
}

const SessionViewerInner = ({ user, type }: { user: User, type: SessionType }) => {
    const { userSessions, deleteSession, updateSession } = useSessions({ user, type })

    const handleUpdate = useCallback((sessionId: string, sessionData: Partial<Session>) => updateSession({ sessionId, sessionData }), [updateSession])

    const groupedSessions = useMemo(() => {
        if (!userSessions) return []

        // Sorting sessions
        const sortedSessions = [...userSessions].sort((a, b) =>
            compareAsc(new Date(a.startTime), new Date(b.startTime))
        )

        // Group by month
        return sortedSessions.reduce<{ month: string, sessions: typeof userSessions }[]>((acc, session) => {
            const monthKey = format(new Date(session.startTime), 'MMMM')

            const existingGroup = acc.find(group => group.month === monthKey)
            if (existingGroup) {
                existingGroup.sessions.push(session)
            } else {
                acc.push({ month: monthKey, sessions: [session] })
            }

            return acc
        }, [])
    }, [userSessions])

    return (
        <Card className="space-y-6">
            <div className="flex flex-col gap-4 w-full">
                {!groupedSessions.length && (
                    <div className='text-center'>
                        <p className='font-semibold'>No available sessions</p>
                    </div>
                )}
                {groupedSessions.map(({ month, sessions }) => (
                    <div className="space-y-4 w-full" key={month}>
                        <h2 className="text-xl font-semibold text-gray-800 pt-2">{month}</h2>
                        {sessions.map((session) => (
                            <SessionDetails
                                key={session.id}
                                session={session}
                                type={type}
                                onDelete={deleteSession}
                                onUpdate={handleUpdate}
                                user={user}
                            />
                        ))}
                    </div>

                ))}</div>
        </Card>
    )
}

