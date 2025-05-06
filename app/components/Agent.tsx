'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { vapi } from '@/lib/vapi.sdk';
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/generalaction';
import { auth } from '@/firebase/client';
import { db } from '@/firebase/client';
import {
  collection, query, where, orderBy, limit, getDocs, Timestamp,
} from 'firebase/firestore';
import { getCurrentUser, isAuthenticated } from '@/lib/actions/authaction';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant'
  content: string;

}

const Agent = ( { userName, userId, type, interviewId, questions } : AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [callStatus, setcallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const[messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect (() => {
      const onCallStart = () => setcallStatus(CallStatus.ACTIVE);
      const onCallEnd = () => setcallStatus(CallStatus.FINISHED);
      const onMessage = (message: Message) => {
        if(message.type === 'transcript' && message.transcriptType === 'final') {
          const newMessage = { role: message.role, content: message.transcript } 
 
          setMessages((prev) => [...prev, newMessage]);
        }
      }

      const onSpeechStart = () => setIsSpeaking(true);
      const onSpeechEnd = () => setIsSpeaking(false);

      const onError = (error: Error) => console.log('Error', error); 

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
  }, [])

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    console.log('Generate feedback here')

    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages
    })

    if(success && id) {
      router.push(`/interview/${interviewId}/feedback`)
    } else {
      console.log('Error saving feedback');
      router.push('/dashboard');
    }
  }

  useEffect(() => {
    if(callStatus === CallStatus.FINISHED) {
      if(type === 'generate') {
        router.push('/dashboard')
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId])

  const handleCall = async () => {
    setcallStatus(CallStatus.CONNECTING);

    
  // Grab a fresh token & its claims
  const { claims } = await auth.currentUser!.getIdTokenResult(true);

  // 🔍 Log to verify
  console.log("🔥 stripeRole:", claims.stripeRole)

  // Read the correct key
  const role = claims.stripeRole as string | undefined; 
 
  let trialActive = false;

if (role !== 'Pro' && role !== 'Premium') {
  const since = Date.now() - 24 * 60 * 60 * 1000;    
  const uid   = auth.currentUser!.uid;  
  const paymentsRef = collection(db, 'users', uid, 'payments');
  const q = query(
    paymentsRef,
    where('price', '==', 'price_1RHDefEbkgNqj4nWs6pfrx9X'),
    where('status', '==', 'succeeded'),
    where('created', '>=', Timestamp.fromMillis(since)),
    orderBy('created', 'desc'),
    limit(1),
  );
  trialActive = !(await getDocs(q)).empty;
}

  // Match exactly the values in your logs
  if (role !== "Pro" && role !== "Premium" && !trialActive ) {
    alert("You need to be subscribed (Pro or Premium) to continue with your interview.");
    window.location.href = "/#pricing";
    return;
  }

        if (type === 'generate') {
          await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          }
        })
      } else {
        let formattedQuestions = '';

        if (questions) {
          formattedQuestions = questions
            .map((question) => `= ${question}`)
            .join('\n')
        }

        await vapi.start(interviewer, {
          variableValues: {
              questions: formattedQuestions
          }
        })
      }
    }

    

  const handleDisconnect = async () => {
    setcallStatus(CallStatus.FINISHED);

    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrFinished = callStatus == CallStatus.INACTIVE || callStatus == CallStatus.FINISHED;

  return (
    <>
        <div className='call-view'>
          <div className='card-interviewer'>
            <div className='avatar'>
              <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className='object-cover' />
              {isSpeaking && <span className='animate-speak' />}              
            </div>
            <h3>
              AI Interviewer
            </h3>
          </div>
          <div className='card-border'>
            <div className='card-content'>
              <Image src='/user-avatar.png' alt='user avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' /> 

              <h3>
                {userName}
              </h3>
            </div>
          </div>
        </div>

        { messages.length > 0 && (
          <div className='transcript-border'>
            <div className='transcript'>
              <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}> 
                {latestMessage}
              </p>
            </div>

          </div>
        )}

        <div className='w-full flex justify-center'>
          {callStatus !== 'ACTIVE' ? (
            <button className='relative btn-call' onClick={handleCall}>
              <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden' )} />
                <span>
                {isCallInactiveOrFinished ? 'Start Call' : '...' } 
                </span>
            </button>
          ) : (
            <button className='btn-disconnect' onClick={handleDisconnect}>
              End Call
            </button>
          ) }
        </div>
    </>
  )
}

export default Agent