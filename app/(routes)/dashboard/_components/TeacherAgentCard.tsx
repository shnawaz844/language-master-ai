"use client"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { IconArrowRight } from '@tabler/icons-react'
import axios from 'axios'
import { Loader2Icon, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LanguageAgent } from '@/shared/list'

export type TeacherAgent = LanguageAgent;

type props = {
    TeacherAgent: TeacherAgent;
    onSelect?: (agent: TeacherAgent) => void;
}

function TeacherAgentCard({ TeacherAgent, onSelect }: props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { has } = useAuth();

    // Direct start with default English/Hindi
    const onStartLesson = async () => {
        if (onSelect) {
            onSelect(TeacherAgent);
            return;
        }

        setLoading(true);
        const result = await axios.post('/api/session-chat', {
            notes: `Learning ${TeacherAgent.language} with ${TeacherAgent.specialist}`,
            selectedTeacher: {
                ...TeacherAgent,
                primaryLanguage: "English",
                targetLanguage: TeacherAgent.language,
                level: "Beginner"
            }
        });

        if (result.data?.sessionId) {
            router.push('/dashboard/teacher-agent/' + result.data.sessionId);
        }
        setLoading(false);
    }

    return (
        <div className='relative bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between h-full'>
            <div>
                {/* Flag & Language Badge */}
                <div className='flex items-center justify-between mb-3'>
                    <span className='text-3xl'>{TeacherAgent.flag}</span>
                    <Badge variant="outline" className='bg-orange-50 text-[#FF6600] border-orange-200 font-medium'>
                        {TeacherAgent.language}
                    </Badge>
                </div>

                {/* Teacher image */}
                <div className='relative w-full h-[180px] rounded-xl overflow-hidden mb-3'>
                    <Image
                        src={TeacherAgent.image}
                        alt={TeacherAgent.specialist}
                        fill
                        className='object-cover'
                    />
                </div>

                {/* Specialist title */}
                <h2 className='font-bold text-lg text-gray-900'>{TeacherAgent.specialist}</h2>

                {/* Description */}
                <p className='text-sm text-gray-500 mt-1 line-clamp-3'>
                    {TeacherAgent.description}
                </p>
            </div>

            {/* Start lesson button */}
            <Button
                className='w-full mt-4 bg-[#FF6600] hover:bg-[#E65C00] text-white flex items-center justify-center gap-2 rounded-xl py-5'
                onClick={onStartLesson}
                disabled={loading}
            >
                {loading ? (
                    <Loader2Icon className='animate-spin h-5 w-5' />
                ) : (
                    <>
                        <span>Start Lesson</span>
                        <IconArrowRight className='h-4 w-4' />
                    </>
                )}
            </Button>
        </div>
    )
}

export default TeacherAgentCard;
