'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/generalaction';
import { auth } from '@/firebase/client';
import { db } from '@/firebase/client';
import { toast } from 'sonner';
import {
  collection, query, where, orderBy, limit, getDocs, Timestamp,
} from 'firebase/firestore';
import { isAuthenticated } from '@/lib/actions/authaction';

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  type: 'interview' | 'generate';
  questions?: string[];
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

// Memoize static components
const Avatar = memo(function Avatar({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className='avatar-container'>
      <div className='avatar'>
        <Image src="/aivoice.png" alt="vapi" width={65} height={54} className='object-cover' />
      </div>
      <div className={cn('audio-visualizer', isSpeaking && 'active')}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='bar' />
        ))}
      </div>
    </div>
  );
});

const UserAvatar = memo(function UserAvatar({
  userName,
  isSpeaking,
  photoURL,
  callStatus
}: {
  userName: string,
  isSpeaking: boolean,
  photoURL?: string,
  callStatus: CallStatus
}) {
  return (
    <div className='card-content'>
      <div className='avatar-container'>
        <div className='avatar'>
          <Image
            src={photoURL || '/user-avatar.png'}
            alt={`${userName}'s avatar`}
            width={120}
            height={120}
            className='rounded-full object-cover size-[120px]'
            priority={true}
            loading="eager"
          />
        </div>
        <div className={cn('audio-visualizer', isSpeaking && 'active')}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='bar' />
          ))}
        </div>
      </div>
      <h3>{userName}</h3>
      {callStatus === CallStatus.ACTIVE && (
        <div className='speaking-indicator'>
          {isSpeaking ? 'Speaking...' : 'Listening...'}
        </div>
      )}
    </div>
  );
});

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  GENERATING_FEEDBACK = 'GENERATING_FEEDBACK',
}

const MIN_MESSAGES_FOR_FEEDBACK = 4;
const MAX_FEEDBACK_RETRIES = 3;
const RETRY_DELAY = 2000;
const TRIAL_DURATION = 24 * 60 * 60 * 1000;

const Agent = memo(function Agent({ userName, userId, type, interviewId, questions }: AgentProps) {


  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [photoURL, setPhotoURL] = useState<string>();
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.photoURL) {
        setPhotoURL(user.photoURL);
      }
    });

    return () => unsubscribe();
  }, []);

  const validateInterviewData = useCallback(() => {
    if (!userId || !interviewId) return false;
    if (!messages || messages.length < MIN_MESSAGES_FOR_FEEDBACK) return false;
    return true;
  }, [userId, interviewId, messages]);

  const handleGenerateFeedback = useCallback(async (messages: SavedMessage[], retry = 0): Promise<boolean> => {
    if (retry >= MAX_FEEDBACK_RETRIES) {
      toast.error('Failed to generate feedback after multiple attempts. Please try again.');
      setIsGeneratingFeedback(false);
      return false;
    }

    const isValid = validateInterviewData();
    if (!isValid) {
      if (!userId || !interviewId) {
        toast.error('Missing required interview data. Please try again.');
      } else {
        toast.error('Interview was too short. Please try again.');
      }
      setIsGeneratingFeedback(false);
      return false;
    }

    try {
      setCallStatus(CallStatus.GENERATING_FEEDBACK);
      setIsGeneratingFeedback(true);

      const { success } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages
      });

      if (success) {
        toast.success('Feedback generated successfully!');
        setIsGeneratingFeedback(false);
        router.push(`/interview/${interviewId}/feedback`);
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return handleGenerateFeedback(messages, retry + 1);

    } catch {
      if (retry < MAX_FEEDBACK_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return handleGenerateFeedback(messages, retry + 1);
      }

      toast.error('Failed to generate feedback. Please try again.');
      setIsGeneratingFeedback(false);
      return false;
    }
  }, [interviewId, userId, router, validateInterviewData]);

  const checkAccessStatus = useCallback(async () => {
    try {
      const isAuth = await isAuthenticated();
      if (!isAuth || !auth.currentUser) {
        toast.error("Please sign in to continue.");
        router.push("/login");
        return false;
      }

      const { claims } = await auth.currentUser.getIdTokenResult(true);
      const role = claims.stripeRole as string | undefined;

      if (role === 'Pro' || role === 'Premium') {
        return true;
      }

      const since = Date.now() - TRIAL_DURATION;
      const uid = auth.currentUser.uid;
      const paymentsRef = collection(db, 'users', uid, 'payments');
      const q = query(
        paymentsRef,
        where('price', '==', 'price_1RHDefEbkgNqj4nWs6pfrx9X'),
        where('status', '==', 'succeeded'),
        where('created', '>=', Timestamp.fromMillis(since)),
        orderBy('created', 'desc'),
        limit(1),
      );

      const querySnapshot = await getDocs(q);
      const trialActive = !querySnapshot.empty;

      if (!trialActive) {
        toast.error("Please purchase a trial to start interviewing.");
        window.location.href = "/#pricing";
        return false;
      }

      return true;
    } catch (error) {
      toast.error("Error verifying access. Please try again.");
      return false;
    }
  }, [router]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setIsGeneratingFeedback(false);

      // Verify access before starting
      const hasAccess = await checkAccessStatus();
      if (!hasAccess) return;

      if (type === 'generate') {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          }
        });
      } else {
        let formattedQuestions = '';
        if (questions) {
          formattedQuestions = questions
            .map((question) => `= ${question}`)
            .join('\n');
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions
          }
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start the interview. Please try again.');
      setCallStatus(CallStatus.INACTIVE);
      setIsGeneratingFeedback(false);
    }
  }

  const handleDisconnect = useCallback(() => {
    try {
      if (vapi) {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Still set status to finished even if there's an error
      setCallStatus(CallStatus.FINISHED);
    }
  }, []);

  const isCallInactiveOrFinished = useMemo(() =>
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED,
    [callStatus]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [duration]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (callStatus !== CallStatus.ACTIVE) return;

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted(prev => !prev);
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPushToTalkActive(true);
        setIsMuted(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPushToTalkActive(false);
        setIsMuted(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [callStatus]);

  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE) {
      vapi.setMuted(isMuted && !isPushToTalkActive);
    }
  }, [isMuted, isPushToTalkActive, callStatus]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setIsGeneratingFeedback(false);
      setCurrentTranscript('');
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setCurrentTranscript('');
      if (type === 'generate') {
        toast.success('Interview has been generated successfully! Redirecting to dashboard...');
      }
    };

    const onMessage = (message: Message) => {
      if (message.type === 'transcript') {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages(prev => [...prev, newMessage]);
        setCurrentTranscript(message.transcript);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      // Handle normal meeting end
      if (error.message?.includes('ejection') || 
          (error as any)?.errorMsg?.includes('Meeting has ended')) {
        setCallStatus(CallStatus.FINISHED);
        if (type === 'generate') {
          toast.success('Interview has been generated successfully! Redirecting to dashboard...');
        }
        return;
      }

      // Handle actual errors
      console.error('Call error:', error);
      if (callStatus !== CallStatus.FINISHED) {
        toast.error('There was an error with the interview. Please try again.');
        setIsGeneratingFeedback(false);
        setCallStatus(CallStatus.INACTIVE);
        setCurrentTranscript('');
        setMessages([]);
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    // Cleanup function
    return () => {
      if (vapi) {
        try {
          vapi.off('call-start', onCallStart);
          vapi.off('call-end', onCallEnd);
          vapi.off('message', onMessage);
          vapi.off('speech-start', onSpeechStart);
          vapi.off('speech-end', onSpeechEnd);
          vapi.off('error', onError);
        } catch (error) {
          console.error('Error cleaning up event listeners:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const generateFeedbackIfNeeded = async () => {
      if (callStatus === CallStatus.FINISHED && type !== 'generate' && messages.length > 0) {
        const success = await handleGenerateFeedback(messages);
        if (!success) {
          setIsGeneratingFeedback(false);
          router.push('/dashboard');
        }
      } else if (callStatus === CallStatus.FINISHED && type === 'generate') {
        router.push('/dashboard');
      }
    };

    generateFeedbackIfNeeded();
  }, [callStatus, type, messages, handleGenerateFeedback, router]);

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='status-container'>
            <div className={cn('status-badge', callStatus === CallStatus.ACTIVE && 'connected')}>
              {callStatus === CallStatus.ACTIVE ? 'Connected' : 'Ready'}
            </div>
            <div className='quick-controls'>
              <button
                onClick={() => setIsMuted(prev => !prev)}
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                className='hover:scale-105 transition-transform'
              >
                {(isMuted && !isPushToTalkActive) ? '🔇' : '🔊'}
              </button>
            </div>
          </div>
          <div className='interview-timer'>{formattedDuration}</div>
          <Avatar isSpeaking={isSpeaking} />
          <h3>AI Interviewer</h3>
          <div className='sm:hidden text-sm text-primary-200/80 mt-1'>{formattedDuration}</div>
          {callStatus === CallStatus.ACTIVE && (
            <div className='speaking-indicator'>
              {isSpeaking ? 'Speaking...' : 'Listening...'}
            </div>
          )}
        </div>
        <div className='card-border'>
          <UserAvatar
            userName={userName}
            isSpeaking={!isSpeaking && callStatus === CallStatus.ACTIVE && !isMuted}
            photoURL={photoURL}
            callStatus={callStatus}
          />
        </div>
        <div className='shortcuts-overlay'>
          <span>Shortcuts: <kbd>M</kbd> Mute <kbd>Space</kbd> Push-to-talk</span>
        </div>
      </div>

      {currentTranscript && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p className='text-primary-100'>{currentTranscript}</p>
          </div>
        </div>
      )}

      <div className='w-full flex justify-center mt-8'>
        {callStatus === CallStatus.ACTIVE ? (
          <button className='btn-disconnect' onClick={handleDisconnect}>
            End Call
          </button>
        ) : isGeneratingFeedback ? (
          <button className='btn-call' disabled>
            Generating Feedback... Please wait
          </button>
        ) : (
          <button
            className='relative btn-call'
            onClick={handleCall}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')} />
            <span>
              {isCallInactiveOrFinished ? 'Start Call' : 'Connecting...'}
            </span>
          </button>
        )}
      </div>
    </>
  );
});

export default memo(Agent);