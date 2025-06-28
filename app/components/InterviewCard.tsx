'use client'
import { useMemo, useCallback, memo, useState } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { interviewCovers } from '@/constants';
import Link from 'next/link';
import DisplayTechicons from './DisplayTechicons';
import ProgressRing from './ProgressRing'
import CardMenu from './CardMenu'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  deleteInterview, 
  duplicateInterview 
} from '@/lib/actions/generalaction';
import { auth } from '@/firebase/client';
import { generatePDF } from './PDFGenerator';
import type { Interview, Feedback } from '@/types';

interface InterviewCardProps extends Interview {
  feedback?: Feedback | null;
}
 
const InterviewCard = ({ id, role, type, techstack, createdAt, feedback }: InterviewCardProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
  const formattedDate = useMemo(() => 
    dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY'),
    [feedback?.createdAt, createdAt]
  );
  const interviewPath = feedback ? `/interview/${id}/feedback` : `/interview/${id}`;
  const router = useRouter();
  
  const getStatusClasses = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'bg-blue-400';
    if (score >= 70) return 'bg-emerald-400';
    if (score >= 40) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const statusClass = getStatusClasses(feedback?.totalScore);

  const coverSrc = useMemo(() => {
    if (!id) return `/covers${interviewCovers[0]}`
    const sum = Array.from(id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    const index = sum % interviewCovers.length
    return `/covers${interviewCovers[index]}`
  }, [id])

  const handleDelete = useCallback(async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this interview? This action cannot be undone.');
      if (!confirmed) return;

      const { success } = await deleteInterview({ interviewId: id });
      if (success) {
        toast.success('Interview deleted successfully');
        router.refresh();
      } else {
        toast.error('Failed to delete interview');
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('An error occurred while deleting the interview');
    }
  }, [id, router]);

  const handleDuplicate = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to duplicate an interview');
        return;
      }

      const { success, interviewId } = await duplicateInterview({
        role,
        type,
        techstack,
        userId: user.uid
      });

      if (success && interviewId) {
        toast.success('Interview duplicated successfully');
        router.push(`/interview/${interviewId}`);
      } else {
        toast.error('Failed to duplicate interview');
      }
    } catch (error) {
      console.error('Error duplicating interview:', error);
      toast.error('An error occurred while duplicating the interview');
    }
  }, [role, type, techstack, router]);

  const handleShare = useCallback(() => {
    try {
      const shareUrl = `${window.location.origin}/interview/${id}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Interview link copied to clipboard');
    } catch (error) {
      console.error('Error sharing interview:', error);
      toast.error('Failed to copy interview link');
    }
  }, [id]);

  const handleExport = useCallback(async () => {
    try {
      if (!feedback) {
        toast.error('Cannot export interview without feedback');
        return;
      }

      setIsExporting(true);
      
      generatePDF({
        interview: { role, type, techstack, createdAt },
        feedback: {
          totalScore: feedback.totalScore,
          categoryScores: feedback.categoryScores,
          scores: feedback.scores || {},
          comments: feedback.comments || {},
          strengths: feedback.strengths || [],
          areasForImprovement: feedback.areasForImprovement || [],
          finalAssessment: feedback.finalAssessment
        },
      });
      
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error exporting interview:', error);
      toast.error('An error occurred while generating the PDF');
    } finally {
      setIsExporting(false);
    }
  }, [role, type, techstack, createdAt, feedback]);

  return (
    <div className="group relative w-full sm:max-w-sm min-h-[420px] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-2xl" />

      <div className="absolute top-4 right-4 flex items-center justify-center">
        <span className="relative flex h-3 w-3">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", statusClass)}></span>
          <span className={cn("relative inline-flex rounded-full h-3 w-3", statusClass)}></span>
        </span>
      </div>

      <Link
        href={interviewPath}
        className="absolute inset-0 z-[1]"
        aria-label="Open interview"
      >
        <span className="sr-only">Open interview</span>
      </Link>

      <div className="absolute top-4 right-4 z-[100]">
        <CardMenu 
          interview={{ id, role, type, techstack, createdAt }}
          feedback={feedback}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onShare={handleShare}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>

      <div className="flex flex-col justify-between h-full p-6">
        <div>
          <div className="relative">
            <Image
              src={coverSrc}
              alt={`${role} interview cover`}
              width={90}
              height={90}
              className="rounded-2xl object-cover size-[90] border border-white/10 shadow-lg transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            />
            <div className="absolute -top-3 left-0 px-1 py-0.5 rounded-lg shadow-lg z-[2] max-w-[70%]">
              <span className="badge text-[9px] font-semibold tracking-widest uppercase truncate">{normalizedType}</span>
            </div>
          </div>

          <h3 className="mt-6 capitalize text-xl font-semibold text-white">{role} Interview</h3>

          <div className="flex flex-row gap-6 mt-4 items-center text-sm text-gray-500">
            <div className="flex flex-row gap-2 items-center">
              <Image src="/calendy.png" alt="calendar" width={24} height={24} className="opacity-70 align-middle" />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <ProgressRing value={feedback?.totalScore ?? 0} size={44} />
            </div>
          </div>

          <p className="line-clamp-2 mt-6 text-sm text-gray-500 leading-relaxed">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center mt-8">
          <div className="flex gap-2 z-[2]">
            {techstack.map((tech, index) => (
              <div 
                key={tech} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <DisplayTechicons techStack={[tech]} />
              </div>
            ))}
          </div>

          <Link 
            href={interviewPath}
            className="relative z-[2] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
            <span className="relative z-10">{feedback ? 'Check Feedback' : 'Take Interview'}</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-6 6l6-6-6-6"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default memo(InterviewCard);