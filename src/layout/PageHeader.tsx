import React from 'react'

interface MyProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

const PageHeader = ({ description, title, children}: MyProps) => {
  return (
    <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                </div>
                <div className="flex items-center space-x-3">
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default PageHeader