'use client'

import React from 'react'
import { plans } from '@/constants/index'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/authaction';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/client';
import { collection, addDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

const CheckoutButton = ({ plan }: { plan: string }) => {
    const router = useRouter();

    const createCheckoutSession = async () => {
      const user = await getCurrentUser();
      if (!user) {
        //If not authenticated, redirect to login or sign up
        router.push('/sing-in')
        return;
      }
        
      // Find the selected plan's by priceId
      const selectedPlan = plans.find((p) => p.title.toLowerCase() === plan.toLowerCase());

      if (!selectedPlan || !selectedPlan.priceId) {
        console.error('Invalid plan or missing priceId')
      }


        // Proceed with creating the checkout session (communicate with the backend)
      const docRef = await addDoc(collection(db, 'users', user.id, 'checkout_sessions'),
        {
          price: selectedPlan?.priceId,
          success_url: window.location.origin + '/dashboard',
          cancel_url: window.location.origin + '/',
        })

        const unsubscribe = onSnapshot(docRef, (snap) => {
          const { error, url } = snap.data() ?? {};
          if (error) {
            // Show an error to your customer and
            // inspect your Cloud Function logs in the Firebase console.
            alert(`An error occurred: ${error.message}`);
          }
          if (url) {
            // We have a Stripe Checkout URL, let's redirect.
            window.location.assign(url);
          }
        })

      }

  return (
    <div className='flex flex-col space-y-2'>



        <button onClick={() => createCheckoutSession()} className='buttonlg'>
           Try {plan} 
        </button>
    </div> 
  )
}

export default CheckoutButton