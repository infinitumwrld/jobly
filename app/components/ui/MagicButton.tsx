'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { getCurrentUser } from '@/lib/actions/authaction';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/firebase/client';
import { collection, addDoc, onSnapshot, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';
import { debounce } from '@/lib/utils';

const TRIAL_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const MagicButton = ({
    title, 
    icon, 
    position, 
    handleClick, 
    otherClasses
}: {
    title: string; 
    icon: React.ReactNode, 
    position: string, 
    handleClick?: () => void; 
    otherClasses?: string;
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if trial is already active
  const checkExistingTrial = async (userId: string) => {
    try {
      const since = Date.now() - TRIAL_DURATION;
      const paymentsRef = collection(db, 'users', userId, 'payments');
      const q = query(
        paymentsRef,
        where('price', '==', 'price_1RHDefEbkgNqj4nWs6pfrx9X'),
        where('status', '==', 'succeeded'),
        where('created', '>=', Timestamp.fromMillis(since)),
        orderBy('created', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.error("You already have an active trial. Please upgrade to continue.");
        window.location.href = "/#pricing";
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  };

  // Check auth state when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        // Verify server-side session
        const serverUser = await getCurrentUser();
        setIsAuthenticated(!!serverUser);
      } catch (error) {
        console.error('Error verifying session:', error);
        setIsAuthenticated(false);
        toast.error('Error verifying session. Please try again.');
      }
    });

    return () => unsubscribe();
  }, []);

  const createCheckoutSession = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check if trial already exists
    const hasActiveTrial = await checkExistingTrial(user.id);
    if (hasActiveTrial) return null;

    const checkoutRef = collection(db, 'users', user.id, 'checkout_sessions');
    return await addDoc(checkoutRef, {
      price: 'price_1RHDefEbkgNqj4nWs6pfrx9X',
      mode: 'payment',     
      success_url: window.location.origin + '/dashboard',
      cancel_url: window.location.origin + '/',
      metadata: { dayPass: true },
    });
  }, []);

  // Debounce the click handlers
  const debouncedTrialCheckout = useCallback(() => {
    const handler = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        // Check auth state
        if (!isAuthenticated) {
          router.push('/sing-in');
          return;
        }

        // Create checkout session
        const docRef = await createCheckoutSession();
        if (!docRef) {
          setIsLoading(false);
          return; // Trial already exists, user already redirected
        }

        // Set timeout for long-running operations
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
          toast.error('Checkout is taking longer than expected. Please try again.');
        }, 8000);

        // Listen for checkout session updates
        const unsubscribe = onSnapshot(docRef, (snap) => {
          const data = snap.data();
          if (!data) return;

          clearTimeout(timeoutId);
          
          if (data.error) {
            toast.error(`Checkout error: ${data.error.message}`);
            setIsLoading(false);
            unsubscribe();
            return;
          }

          if (data.url) {
            window.location.assign(data.url);
            unsubscribe();
          }
        }, (error) => {
          console.error('Checkout error:', error);
          clearTimeout(timeoutId);
          setIsLoading(false);
          toast.error('Failed to process checkout. Please try again.');
          unsubscribe();
        });

      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("An error occurred during checkout. Please try again.");
        setIsLoading(false);
      }
    };
    debounce(handler, 500)();
  }, [isLoading, isAuthenticated, router, createCheckoutSession]);

  const debouncedHandleClick = useCallback(() => {
    if (handleClick) {
      debounce(handleClick, 500)();
    }
  }, [handleClick]);

  const LoadingSpinner = () => (
    <div className="w-full gap-x-2 flex justify-center items-center">
      <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"></div>
      <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"></div>
      <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <LoadingSpinner />
        </div>
      )}
      <button 
        className="relative inline-flex h-12 overflow-hidden rounded-lg p-[2px] premium-shake focus:outline-none md:w-60 md:mt-10 shadow-[0_0_13px_#7C3AED]" 
        onClick={handleClick ? debouncedHandleClick : debouncedTrialCheckout}  
        disabled={isLoading || isAuthenticated === null} 
      >
        <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] " />
        <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClasses}`}>
          {position === 'left' && !isLoading && icon}
          {isLoading ? 'Hold tight...' : title}
          {position === 'right' && !isLoading && icon}
        </span>
      </button> 
    </div> 
  );
};
 
export default MagicButton