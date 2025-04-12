import React from 'react'

export const Card = ({ children, className }: { children: JSX.Element, className?: string }) => {
    return (
        <div className={`flex p-10 bg-white rounded-lg shadow-md max-w-4xl justify-center w-full mx-auto p-8 ${className}`}>
            {children}
        </div>
    )
}

