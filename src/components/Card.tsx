import React from 'react'

export const Card = ({ children }: { children: JSX.Element }) => {
    return (
        <div className='flex p-10 bg-white rounded'>
            {children}
        </div>
    )
}

