import React from 'react'


export const Input = ({ label, ...props }: React.ComponentProps<'input'> & { label?: string }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label htmlFor={props.id} className="text-sm font-medium text-gray-700">{label}</label>}
            <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-pink" />
        </div>
    )
}

