import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import React from 'react'

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4 w-full">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center gap-2 text-primary-200 hover:text-primary-100 transition-all duration-200 rounded-lg w-full sm:w-auto px-4 py-2 sm:px-0 sm:py-0 bg-dark-200 sm:bg-transparent"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-base sm:text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>
      {children}
    </>
  )
} 