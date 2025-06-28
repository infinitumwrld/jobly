import { isAuthenticated } from '@/lib/actions/authaction'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children } : { children : ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect('/dashboard')

  return (
    <div className='root-layout'>
      <nav>
        <Link href="/dashboard" className="flex items-center gap-2" >
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout