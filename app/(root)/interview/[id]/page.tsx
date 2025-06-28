import Agent from '@/app/components/Agent';
import DisplayTechIcons from '@/app/components/DisplayTechicons';
import { getCurrentUser } from '@/lib/actions/authaction';
import { getInterviewById } from '@/lib/actions/generalaction';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

const page = async ({ params }: PageProps) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) redirect('/dashboard')

  return (
    <>
        <div className='flex flex-row gap-4 justify-between mb-8'>
            <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
                <div className='flex flex-row gap-4 items-center'>
                    <Image src={getRandomInterviewCover()} alt='cover-image' width={40} height={40} className='rounded-full object-cover size-[40px]' />
                    <h3 className='capitalize'> {interview.role} Interview </h3>
                </div>
                <DisplayTechIcons techStack={interview.techstack} />
            </div>   

            <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>
        </div>

        <Agent 
            userName={user?.name || ''}
            userId={user?.id}
            interviewId={id}
            type='interview'
            questions={interview.questions}
        />    
    </>
  )
}

export default page
