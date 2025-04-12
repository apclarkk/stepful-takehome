import { SessionType } from "@/hooks/useSessions";
import { Role, Session, User } from "@prisma/client";
import { ChatDots, MoreVerticalFill, Radio, RadioFill, Star } from "akar-icons";
import { format } from "date-fns";

import { useCallback, useState } from "react";

export type SessionDetailsExpanded = Session & {
    coach: User | null;
    student: User | null;
};

interface SessionDetailsProps {
    session: SessionDetailsExpanded;
    onDelete?: (sessionId: string) => void;
    onUpdate?: (sessionId: string, sessionData: Partial<Session>) => Promise<Session>;
    type: SessionType;
    user: User;
}

export const SessionDetails = ({
    session,
    onDelete,
    onUpdate,
    type,
    user
}: SessionDetailsProps) => {
    const { role } = user
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


    const showDetails = {
        delete: !!onDelete && role === "COACH",
        remove: !!onUpdate && role === "STUDENT" && session.studentId === user.id,
        select: !!onUpdate && role === "STUDENT" && !session.studentId,
        available: !session.studentId
    }

    return (
        <div className="bg-white flex justify-between w-full items-center border-l-2 pl-2 border-pink">
            <div className="w-1/4 flex flex-row gap-2 items-center">
                <div className="text-2xl font-semibold">
                    {format(new Date(session.startTime), "d")}
                </div>
                <div className=" ">
                    {format(new Date(session.startTime), "EEEE")}
                </div>
            </div>

            <div className="w-2/4">
                <div className="text-gray-500">
                    <p className="whitespace-nowrap">
                        {format(new Date(session.startTime), "h:mm a")} -{" "}
                        {format(new Date(session.endTime), "h:mm a")}{" "}
                        ({Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60))}hrs)</p>
                </div>
            </div>

            <div className="w-2/4">
                <UserInformation session={session} role={role} type={type} />
            </div>

            <div className="w-1/4">
                {showDetails.available ? (
                    <Radio size={24} />
                ) : (
                    <RadioFill size={24} />
                )}
            </div>

            <div className="w-1/4 flex items-center justify-end space-x-2">
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <MoreVerticalFill strokeWidth={1.5} size={24} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                                {/* Only coaches can delete sessions, students can remove themselves from sessions */}
                                {showDetails.select && (
                                    <button
                                        onClick={() => {
                                            onUpdate!(session.id, {
                                                studentId: user.id,
                                            });
                                            toggleMenu();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        Select
                                    </button>
                                )}
                                {showDetails.delete && (
                                    <button
                                        onClick={() => {
                                            onDelete!(session.id);
                                            toggleMenu();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Delete
                                    </button>
                                )}
                                {showDetails.remove && (
                                    <button
                                        onClick={() => {
                                            onUpdate!(session.id, {
                                                studentId: null,
                                                notes: null,
                                                rating: null,
                                            });
                                            toggleMenu();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Remove
                                    </button>
                                )}

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function UserInformation({ session, role, type }: { session: SessionDetailsExpanded, role: Role, type: SessionType }) {
    const [isNotesMenuOpen, setIsNotesMenuOpen] = useState(false)
    const onNotesToggle = useCallback(() => setIsNotesMenuOpen(prev => !prev), [])


    const userToDisplay = role === "STUDENT" ? session.coach : session.student ?? null;
    const showNotes = !!session.notes && role === "COACH"
    const showRating = !!session.rating && role === "COACH" && type === "past"

    if (!userToDisplay) {
        return <p className="font-semibold pl-[34px]">Available</p>
    }
    return (
        <div className="relative">
            <div className="flex flex-row gap-1">
                <div className="flex flex-col gap-1 min-w-[30px]">
                    {showNotes && <ChatDots onClick={onNotesToggle} className="cursor-pointer" strokeWidth={1.5} size={30} />}
                    {showRating && (
                        <div className="relative">
                            <Star strokeWidth={1.5} size={30} />
                            <p className="absolute top-[6.5px] left-[11px] text-sm font-semibold">{session.rating}</p>
                        </div>
                    )}

                </div>
                <div className="flex flex-col">
                    <p className="font-semibold" >{userToDisplay.name}</p>
                    <a href={`mailto:${userToDisplay.email}`} className="text-blue-900">{userToDisplay.email}</a>
                    <a href={`tel:${userToDisplay.phoneNumber}`} className="text-blue-900">{userToDisplay.phoneNumber}</a>
                </div>
            </div>
            {isNotesMenuOpen && (
                <div className="absolute top-[-95px] left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 p-2 border border-gray-200 cursor-pointer" onClick={onNotesToggle}>
                    <div className="py-1">
                        <p className="text-gray-700 text-sm">{session.notes}</p>
                    </div>
                </div>
            )}
        </div>

    )
}