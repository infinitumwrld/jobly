'use client'

import React, { useState } from 'react'
import { plans } from '@/constants/index'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/authaction';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/client';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
 
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
    handleClick?: () => void; otherClasses?: string;
}) => {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const handleTrialCheckout = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/sing-in') 
        return
      }
    
      // Create a checkout session with both the one-time payment and subscription

        const docRef = await addDoc(
          collection(db, 'users', user.id, 'checkout_sessions'),
          {
            price: 'price_1RD8nBEbkgNqj4nWZFTU8syW',     
            success_url: window.location.origin + '/dashboard',
            cancel_url: window.location.origin + '/',
          }
        )
      
      onSnapshot(docRef, (snap) => {
        const { error, url } = snap.data() ?? {}
        if (error) {
          alert(`An error occurred: ${error.message}`)
          setIsLoading(false)
        }
        if (url) {
          window.location.assign(url)
        }
      })
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout.")
      setIsLoading(false)
    }
  }
  
  const LoadingSpinner = () => (
    <div className="w-full gap-x-2 flex justify-center items-center">
      <div
        className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
      ></div>
      <div
        className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
      ></div>
      <div
        className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
      ></div>
    </div>
  )

  return (
    <button className="relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[2px] premium-shake focus:outline-none md:w-60 md:mt-10 shadow-[0_0_13px_#7C3AED]" onClick={handleClick || handleTrialCheckout}  disabled={isLoading} >
        <span className="absolute inset-[-1000%] animate-[spin_1.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] " />
        <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${otherClasses}`}>
            {isLoading && <LoadingSpinner />}
            {position === 'left' && !isLoading && icon}
            {isLoading ? 'Processing...' : title}
            {position === 'right' && !isLoading && icon}

        </span>
    </button> 
  )
}
 
export default MagicButton