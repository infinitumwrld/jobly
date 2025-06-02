'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { plans } from '@/constants/index'
import { getCurrentUser } from '@/lib/actions/authaction';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/client';
import { collection, addDoc, onSnapshot, DocumentData, DocumentReference } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from "./button"

interface CheckoutButtonProps {
  plan: string;
  className?: string;
}

interface User {
  id: string;
  // Add other user properties if needed
}

const CheckoutButton = ({ plan: planTitle, className }: CheckoutButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    
    // Memoize plan lookup with proper type from constants
    const selectedPlan = useMemo(() => 
      plans.find((p) => p.title.toLowerCase() === planTitle.toLowerCase()),
      [planTitle]
    );

    // Pre-fetch user session
    useEffect(() => {
      const initializeCheckout = async () => {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Error initializing checkout:', error);
        }
      };

      initializeCheckout();
    }, []); // Only run once on mount

    const createCheckoutSession = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        if (!user) {
          toast.error('Please sign in to continue');
          router.push('/sing-in');
          return;
        }
          
        if (!selectedPlan?.priceId) {
          toast.error('Invalid plan selected. Please try again.');
          return;
        }

        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Checkout timeout')), 5000)
        );

        const checkoutPromise = addDoc(
          collection(db, 'users', user.id, 'checkout_sessions'),
          {
            price: selectedPlan.priceId,
            success_url: window.location.origin + '/dashboard',
            cancel_url: window.location.origin + '/',
          }
        );

        const docRef = await Promise.race([checkoutPromise, timeoutPromise]) as DocumentReference<DocumentData>;

        // Create an AbortController for cleanup
        const abortController = new AbortController();
        const signal = abortController.signal;

        const unsubscribe = onSnapshot(docRef, (snap) => {
          // Check if the listener was aborted
          if (signal.aborted) return;
          
          const data = snap.data();
          if (!data) return;
          
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
        }, (error: Error) => {
          if (signal.aborted) return;
          
          console.error('Checkout error:', error);
          setIsLoading(false);
          toast.error('Failed to process checkout. Please try again.');
          unsubscribe();
        });

        // Set timeout using AbortController
        setTimeout(() => {
          if (!signal.aborted) {
            abortController.abort();
            setIsLoading(false);
            unsubscribe();
            toast.error('Checkout is taking longer than expected. Please try again.');
          }
        }, 5000);

        // Cleanup on component unmount
        return () => {
          abortController.abort();
          unsubscribe();
        };

      } catch (error) {
        console.error("Checkout error:", error);
        if (error instanceof Error && error.message === 'Checkout timeout') {
          toast.error("Checkout timed out. Please try again.");
        } else {
          toast.error("An error occurred during checkout. Please try again.");
        }
        setIsLoading(false);
      }
    }

    return (
      <Button 
        onClick={createCheckoutSession}
        className={className}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          planTitle === "Free" ? "Get Started" : "Subscribe"
        )}
      </Button>
    )
}

export default CheckoutButton