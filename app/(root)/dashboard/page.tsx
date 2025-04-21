import React from 'react'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '../../components/InterviewCard'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/generalaction'
import { getCurrentUser } from '@/lib/actions/authaction' 

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all ([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ])

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;


  return (
    <>
      <section className='card-cta'>
          <div className='flex flex-col gap-6 max-w-lg'>
            <h2>
            Finally — Interview Practice That Actually Works.
            </h2>
            <p className='text-og'>
            Get confident, get better, and walk into interviews like you’ve already got the offer.
            </p>

            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href='/interview'> 
                Start an Interview
              </Link>
            </Button>
          </div>
        <Image src='/robo.png' alt='robo-dude' width={400} height={400} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>
          Your interviews
        </h2>

        <div className='interviews-section'>

        { hasPastInterviews ? (
                userInterviews?.map((interview) => (
                  <InterviewCard {...interview}  key={interview.id} />
                ))) :( 
                  <p>You haven't taken any interviews yet </p>
                )
              } 

        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>
          Take an interview
        </h2>

        <div className='interviews-section'>
             { hasUpcomingInterviews ? (
                latestInterviews?.map((interview) => (
                  <InterviewCard {...interview}  key={interview.id} />
                ))) :( 
                  <p>There are no recent interviews... </p>
                )
              } 
    
        </div>
      </section>
    </>
  )
}

export default page