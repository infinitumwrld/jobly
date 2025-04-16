import { isAuthenticated } from '@/lib/actions/authaction';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const Authlayout = async ({ children }: { children: ReactNode }) => {

    const isUserAuthenticated = await isAuthenticated();
    if (isUserAuthenticated) redirect('/dashboard')
  
  return (
    <div className="auth-layout">{children}</div>
  )
}

export default Authlayout