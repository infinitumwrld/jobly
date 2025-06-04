import React, { Suspense } from 'react'
import { Button } from '../../components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '../../components/InterviewCard'
import { getInterviewsByUserId, getLatestInterviews, getFeedbackByInterviewIds } from '@/lib/actions/generalaction'
import { getCurrentUser } from '@/lib/actions/authaction'

// Loading component for interviews section
const InterviewsLoading = () => (
  <div className="interviews-section animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="card-border w-[360px] max-sm:w-full min-h-96 bg-gray-200" />
    ))}
  </div>
);

// Separate component for interview lists to enable suspense
const InterviewsList = async ({ 
  interviews, 
  feedbackMap 
}: { 
  interviews: Interview[], 
  feedbackMap: Record<string, Feedback> 
}) => {
  if (!interviews?.length) {
    return <p>No interviews available</p>;
  }

  return (
    <div className='interviews-section'>
      {interviews.map((interview) => (
        <InterviewCard 
          {...interview}  
          key={interview.id} 
          feedback={feedbackMap[interview.id]}
        />
      ))}
    </div>
  );
};

const Page = async () => {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2>Please sign in to view your dashboard</h2>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  try {
    // Parallel data fetching
    const [userInterviews, latestInterviews] = await Promise.all([
      getInterviewsByUserId(user.id),
      getLatestInterviews({ userId: user.id })
    ]);

    // Get all interview IDs - safely handle null/undefined arrays
    const allInterviewIds = [
      ...(userInterviews?.map(i => i.id) || []),
      ...(latestInterviews?.map(i => i.id) || [])
    ];

    // Fetch all feedback in one query
    const feedbackMap = allInterviewIds.length > 0 
      ? await getFeedbackByInterviewIds({
          interviewIds: allInterviewIds,
          userId: user.id
        })
      : {};

    // Safely check array lengths without non-null assertions
    const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
    const hasUpcomingInterviews = (latestInterviews?.length ?? 0) > 0;

    return (
      <>
        <section className='card-cta'>
          <div className='flex flex-col gap-6 max-w-lg'>
            <h2>Finally — Interview Practice That Actually Works.</h2>
                        <p className='text-og'>
              Interviews are so good, it feels like talking to a real hiring manager.
            </p>

            <Button asChild className='btn-primary max-sm:w-full premium-shake'>
              <Link href='/interview' prefetch={true}> 
                Start an Interview
              </Link>
            </Button>
          </div>
          <Image 
            src='/robo.png' 
            alt='robo-dude' 
            width={400} 
            height={400} 
            className='max-sm:hidden'
            priority={true}
          />
        </section>

        <section className='flex flex-col gap-6 mt-8'>
          <h2>Your interviews</h2>
          {!hasPastInterviews ? (
            <p className="text-muted-foreground">Ready to improve your interview skills? Start your first interview!</p>
          ) : (
            <Suspense fallback={<InterviewsLoading />}>
              <InterviewsList 
                interviews={userInterviews || []} 
                feedbackMap={feedbackMap} 
              />
            </Suspense>
          )}
        </section>

        <section className='flex flex-col gap-6 mt-8'>
          <h2>Take an interview</h2>
          {!hasUpcomingInterviews ? (
            <p className="text-muted-foreground">We're preparing more interviews for you. Check back soon!</p>
          ) : (
            <Suspense fallback={<InterviewsLoading />}>
              <InterviewsList 
                interviews={latestInterviews || []} 
                feedbackMap={feedbackMap} 
              />
            </Suspense>
          )}
        </section>
      </>
    );
  } catch (error) {
    console.error('Error loading dashboard:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2>Something went wrong</h2>
        <p className="text-muted-foreground">We encountered an error while loading your dashboard. Please try again later.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }
}

export default Page