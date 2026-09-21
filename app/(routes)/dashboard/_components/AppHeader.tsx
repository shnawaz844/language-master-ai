import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const menuOptions = [
    {
        id: 1,
        name: 'Home',
        path: '/dashboard'
    },
    {
        id: 2,
        name: 'History',
        path: '/dashboard/history'
    },
    {
        id: 4,
        name: 'Profile',
        path: '/dashboard/profile'
    }
]
function AppHeader() {
    return (
        <div className='flex items-center justify-between p-3 px-4 md:px-20 lg:px-10 sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50'>
            <Link href={'/'} className='flex items-center gap-2'>
                <div className='w-8 h-8 rounded-xl bg-[#FF6600] text-white flex items-center justify-center font-black text-sm'>
                    LM
                </div>
                <span className='font-extrabold text-lg tracking-tight text-gray-900'>
                    Language<span className='text-[#FF6600]'>Master</span>.AI
                </span>
            </Link>
            <div className='hidden md:flex gap-12 items-center'>
                {menuOptions.map((option, index) => (
                    <Link key={index} href={option.path}>
                        <h2 className='hover:font-bold hover:text-[#FF6600] cursor-pointer text-sm font-medium text-gray-700'>{option.name}</h2>
                    </Link>
                ))}
            </div>
            <div className='flex items-center gap-4'>
                <UserButton />
            </div>
        </div>
    )
}

export default AppHeader
