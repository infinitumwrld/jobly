import { Button } from '../../components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import InterviewCard from '../../components/InterviewCard'
import { getInterviewsByUserId, getLatestInterviews, getFeedbackByInterviewIds } from '@/lib/actions/generalaction'
import { getCurrentUser } from '@/lib/actions/authaction'
import type { Interview, Feedback } from '@/types'
import { Suspense } from 'react'




// Loading component for interviews section
const InterviewsLoading = () => (
  <div className="interviews-section animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="card-border w-[360px] max-sm:w-full min-h-96 bg-gray-200" />
    ))}
  </div>
);

// Move data fetching into this component to make Suspense work
async function InterviewsSection({ userId, type }: { userId: string, type: 'user' | 'latest' }) {
  const interviews = type === 'user' 
    ? await getInterviewsByUserId(userId)
    : await getLatestInterviews({ userId });
    console.log('saved userId:', userId);

  // Handle null case
  if (!interviews || !interviews.length) {
    return type === 'user' 
      ? <p className="text-muted-foreground">Ready to improve your interview skills? Start your first interview!</p>
      : <p className="text-muted-foreground">We're preparing more interviews for you. Check back soon!</p>;
  }

  const feedbackMap = await getFeedbackByInterviewIds({
    interviewIds: interviews.map(i => i.id),
    userId

  });

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
}

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

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Finally &mdash; Interview Practice That Actually Works.</h2>
          <p className='text-og'>
            Interviews are so good, it feels like talking to a real hiring manager.
          </p>

          <Button asChild className='btn-primary max-sm:w-full premium-shake'>
            <Link href='/interview'> 
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
        <Suspense fallback={<InterviewsLoading />}>
          <InterviewsSection userId={user.id} type="user" />
        </Suspense>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an interview</h2>
        <Suspense fallback={<InterviewsLoading />}>
          <InterviewsSection userId={user.id} type="latest" />
        </Suspense>
      </section>
    </>
  );
}

export default Page