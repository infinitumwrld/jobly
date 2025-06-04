'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/generalaction';
import { auth } from '@/firebase/client';
import { db } from '@/firebase/client';
import { toast } from 'sonner';
import {
  collection, query, where, orderBy, limit, getDocs, Timestamp, doc, getDoc,
} from 'firebase/firestore';
import { isAuthenticated } from '@/lib/actions/authaction';
import { memo } from 'react';


// Memoize static components
const Avatar = memo(function Avatar({ isSpeaking }: { isSpeaking: boolean }) {
  return (
    <div className='avatar'>
      <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover' />
      {isSpeaking && <span className='animate-speak' />}              
    </div>
  );
});

const UserAvatar = memo(function UserAvatar({ userName }: { userName: string }) {
  return (
    <div className='card-content'>
      <Image 
        src='/user-avatar.png' 
        alt='user avatar' 
        width={540} 
        height={540} 
        className='rounded-full object-cover size-[120px]'
        priority={false}
        loading="lazy"
      /> 
      <h3>{userName}</h3>
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

interface SavedMessage {
  role: 'user' | 'system' | 'assistant'
  content: string;
}

const MIN_MESSAGES_FOR_FEEDBACK = 4; // Minimum number of messages to consider it a valid interview
const MAX_FEEDBACK_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const Agent = memo(function Agent({ userName, userId, type, interviewId, questions }: AgentProps) {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setcallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const validateInterviewData = useCallback(() => {
    try {
      if (!userId || !interviewId) {
        toast.error('Missing required interview data. Please try again.');
        return false;
      }
      if (!messages || messages.length < MIN_MESSAGES_FOR_FEEDBACK) {
        toast.error('Interview was too short. Please try again.');
        return false;
      }
      return true;
    } catch (error) {
      toast.error('An error occurred while validating interview data');
      return false;
    }
  }, [userId, interviewId, messages]);

  const handleGenerateFeedback = useCallback(async (messages: SavedMessage[], retry = 0): Promise<boolean> => {
    if (retry >= MAX_FEEDBACK_RETRIES) {
      toast.error('Failed to generate feedback after multiple attempts. Please try again.');
      setIsGeneratingFeedback(false);
      return false;
    }

    if (!validateInterviewData()) {
      setIsGeneratingFeedback(false);
      return false;
    }

    try {
      console.log('Generating feedback, attempt:', retry + 1);
      setcallStatus(CallStatus.GENERATING_FEEDBACK);
      setIsGeneratingFeedback(true);

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages
      });

      if (success && id) {
        toast.success('Feedback generated successfully!');
        setIsGeneratingFeedback(false);
        router.push(`/interview/${interviewId}/feedback`);
        return true;
      } 

      // If not successful, retry after delay
      console.log('Feedback generation not successful, retrying...');
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return handleGenerateFeedback(messages, retry + 1);

    } catch (error) {
      if (retry < MAX_FEEDBACK_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return handleGenerateFeedback(messages, retry + 1);
      }

      toast.error('Failed to generate feedback. Please try again.');
      setIsGeneratingFeedback(false);
      return false;
    }
  }, [interviewId, userId, router, validateInterviewData]);

  useEffect(() => {
    const onCallStart = () => {
      setcallStatus(CallStatus.ACTIVE);
      setIsGeneratingFeedback(false); // Reset feedback state on new call
    };
    
    const onCallEnd = () => {
      setcallStatus(CallStatus.FINISHED);
      console.log('Call ended with messages:', messages.length);
    };

    const onMessage = (message: Message) => {
      if(message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = { role: message.role, content: message.transcript } 
        console.log('New message:', newMessage);
        setMessages((prev) => [...prev, newMessage]);
      }
    }

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error('Call error:', error);
      toast.error('There was an error with the interview. Please try again.');
      setIsGeneratingFeedback(false);
    }

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => { 
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    }
  }, [messages.length])

  useEffect(() => {
    const generateFeedbackIfNeeded = async () => {
      // Only generate feedback for actual interviews (not generation)
      if (callStatus === CallStatus.FINISHED && type !== 'generate' && messages.length > 0) {
        console.log('Attempting to generate feedback for interview:', interviewId);
        const success = await handleGenerateFeedback(messages);
        if (!success) {
          console.log('Feedback generation failed, redirecting to dashboard');
          setIsGeneratingFeedback(false);
          router.push('/dashboard');
        }
      } else if (callStatus === CallStatus.FINISHED && type === 'generate') {
        router.push('/dashboard');
      }
    };

    generateFeedbackIfNeeded();
  }, [callStatus, type, messages, handleGenerateFeedback, router, interviewId]);

  const checkAccessStatus = useCallback(async () => {
    try {
      const isAuth = await isAuthenticated();
      if (!isAuth || !auth.currentUser) {
        toast.error("Please sign in to continue.");
        router.push("/login");
        return false;
      }

      // Get fresh token & claims
      const { claims } = await auth.currentUser.getIdTokenResult(true);
      const role = claims.stripeRole as string | undefined;

      // If user has Pro or Premium subscription, they have access
      if (role === 'Pro' || role === 'Premium') {
        return true;
      }

      // Check for active trial payment
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

      // Trial is active
      return true;
    } catch (error) {
      toast.error("Error verifying access. Please try again.");
      return false;
    }
  }, [router]);

  const handleCall = async () => {
    try {
      setcallStatus(CallStatus.CONNECTING);
      setMessages([]); // Clear any previous messages
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
      setcallStatus(CallStatus.INACTIVE);
      setIsGeneratingFeedback(false);
    }
  }

  const handleDisconnect = useCallback(() => {
    try {
      console.log('Disconnecting call with messages:', messages.length);
      setcallStatus(CallStatus.FINISHED);
      vapi.stop();
    } catch (error) {
      console.error('Error stopping call:', error);
      // Still set status to finished even if stop fails
      setcallStatus(CallStatus.FINISHED);
    }
  }, [messages.length]);

  const latestMessage = useMemo(() => 
    messages[messages.length - 1]?.content,
    [messages]
  );
  
  const isCallInactiveOrFinished = useMemo(() => 
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED,
    [callStatus]
  );

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <Avatar isSpeaking={isSpeaking} />
          <h3>AI Interviewer</h3>
        </div>
        <div className='card-border'>
          <UserAvatar userName={userName} />
        </div>
      </div>

      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}> 
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className='w-full flex justify-center'>
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