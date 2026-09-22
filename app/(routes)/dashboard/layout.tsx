import React from 'react'
import AppHeader from './_components/AppHeader';

function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-[#070708]">
            <AppHeader />
            <main className='w-full flex-1 flex flex-col min-h-0'>
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
