import React from 'react'
import Image from 'next/image'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'
import { Sparkles, Globe } from 'lucide-react'

function Dashboard() {
    return (
        <div className='relative min-h-screen'>
            {/* Header Banner */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#475569] text-white p-6 md:p-8 rounded-3xl shadow-lg mb-8 gap-4'>
                <div>
                    <div className='flex items-center gap-2 mb-1'>
                        <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30 flex items-center gap-1'>
                            <Sparkles className='w-3 h-3' /> Phase 1: European Languages
                        </span>
                    </div>
                    <h2 className='font-bold text-2xl md:text-3xl text-white'>Language Master AI</h2>
                    <p className='text-gray-300 text-sm mt-1 max-w-xl'>
                        Practice speaking German, French, Spanish, and European languages with live voice AI tutors. Learn with explanations in Hindi or English.
                    </p>
                    <div className='mt-4'>
                        <AddNewSessionDialog />
                    </div>
                </div>
                <div className='hidden md:flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]'>
                    <Globe className='w-10 h-10 text-orange-400 mb-1' />
                    <span className='text-xs font-medium text-white/90'>Supported Languages</span>
                    <span className='text-lg font-bold text-white mt-0.5'>🇩🇪 🇫🇷 🇪🇸 🇮🇹 🇵🇹 🇳🇱</span>
                </div>
            </div>

            {/* List of Language Tutors */}
            <DoctorsAgentList />
        </div>
    )
}

export default Dashboard;
