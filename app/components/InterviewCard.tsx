import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { getRandomInterviewCover } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';
import DisplayTechicons from './DisplayTechicons';

interface InterviewCardProps extends Interview {
  feedback?: Feedback | null;
}
 
const InterviewCard = ({ id, role, type, techstack, createdAt, feedback }: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D,YYYY'); 
  
  const interviewPath = feedback ? `/interview/${id}/feedback` : `/interview/${id}`;

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
        <div className='card-interview'>
            <div>
                <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600'>
                    <p className='badge-text'> {normalizedType} </p>
                </div>

                <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className='rounded-full object-fit size-[90]'/>

                <h3 className='mt-5 capitalize'>
                    {role} Interview
                </h3> 

                <div className='flex flex-row gap-5 mt-3'>
                    <div className='flex flex-row gap-2'>
                        <Image src="/calendy.png" alt='calendar' width={22} height={22} />
                        <p>
                            {formattedDate}
                        </p>
                    </div>
                        <div className='flex flex-row gap-2 items-center'>
                            <Image src='/stariski.png' alt='star' width={22} height={22} />
                            <p>{feedback?.totalScore || '---'}/100 </p>
                        </div>
                    </div> 

                    <p className='line-clamp-2 mt-5'>
                        {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
                    </p>
                </div>
                <div className='flex flex-row justify-between '>
                    <DisplayTechicons techStack={techstack} />

                    <Button className='btn-primary'>
                        <Link 
                          href={interviewPath}
                          prefetch={true}
                        >
                            {feedback ? 'Check Feedback' : 'View interview'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
  )
}

export default InterviewCard