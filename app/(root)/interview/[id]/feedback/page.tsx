import { getCurrentUser } from '@/lib/actions/authaction';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/generalaction';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

const page = async ({ params }: PageProps) => {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user?.id) redirect('/sign-in');

    const interview = await getInterviewById(id);
    if (!interview) redirect('/dashboard');

    const feedback = await getFeedbackByInterviewId({
      interviewId: id,
      userId: user.id,
    });

    if (!feedback) {
      redirect(`/interview/${id}`);
    }

    return (
      <section className="section-feedback">
        <div className="flex flex-row justify-center">
          <h1 className="text-4xl font-semibold">
            Feedback on the Interview -{" "}
            <span className="capitalize">{interview.role}</span> Interview
          </h1>
        </div>

        <div className="flex flex-row justify-center">
          <div className="flex flex-row gap-5">
            {/* Overall Impression */}
            <div className="flex flex-row gap-2 items-center">
              <Image 
                src="/stariski.png" 
                width={30} 
                height={30} 
                alt="star" 
                priority 
                sizes="30px"
                className="w-[30px] h-[30px]"
              />
              <p>
                Overall Impression:{" "}
                <span className="text-primary-200 font-bold">
                  {feedback.totalScore}
                </span>
                /100
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-2">
              <Image 
                src="/calendy.png" 
                width={30} 
                height={30} 
                alt="calendar" 
                priority 
                sizes="30px"
                className="w-[30px] h-[30px]"
              />
              <p>
                {feedback.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <h2 className="text-2xl font-semibold">Breakdown of the Interview:</h2>
        
        <div className="space-y-6">
          {feedback.categoryScores.map((category, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary-200 font-bold">{index + 1}.</span>
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <span className="ml-auto text-lg font-bold text-primary-200">
                  {category.score}%
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {category.comment}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Strengths:</h3>
          <ul className="list-disc list-inside space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="text-gray-300">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
          <h3 className="text-xl font-semibold mb-4">Areas for Improvement:</h3>
          <ul className="list-disc list-inside space-y-2">
            {feedback.areasForImprovement.map((area, index) => (
              <li key={index} className="text-gray-300">{area}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 mt-6 mb-12">
          <h3 className="text-xl font-semibold mb-4">Final Assessment:</h3>
          <p className="text-gray-300 leading-relaxed">
            {feedback.finalAssessment}
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <Link
            href={`/interview/${id}`}
            className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-semibold bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 text-white hover:shadow-[0_0_40px_-4px] hover:shadow-primary-500/50 transition-all duration-300 ease-out overflow-hidden"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
            <span className="relative z-10 flex items-center gap-2 font-medium tracking-wide">
              Retake Interview
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-6 6l6-6-6-6"/>
              </svg>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 ease-out border border-white/10 overflow-hidden"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
            <span className="relative z-10 flex items-center gap-2">
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-1" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5m7 7l-7-7 7-7"/>
              </svg>
              Back to Dashboard
            </span>
          </Link>
        </div>
      </section>
    );
  } catch (error: any) {
    console.error('Error in feedback page:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-gray-300">
          {error.message === 'Database index not found. Please contact support.'
            ? 'We are experiencing technical difficulties. Our team has been notified and is working on a fix.'
            : 'We encountered an error while loading your feedback. Please try again later.'}
        </p>
        <Link
          href="/dashboard"
          className="group/btn relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 ease-out border border-white/10 overflow-hidden"
        >
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
          <span className="relative z-10 flex items-center gap-2">Go Back to Dashboard</span>
        </Link>
      </div>
    );
  }
};

export default page;