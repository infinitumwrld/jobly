import React from 'react'
import dynamic from 'next/dynamic'
import Hero from '../components/Hero'
import { FloatingNav } from '../components/ui/FloatingNav'
import { navItems } from '@/constants'

const LoadingFallback = () => <div className="w-full h-32 animate-pulse bg-gray-900/50 rounded-lg" />

// Dynamically import non-critical components with SSR enabled but optimized loading
const Grid = dynamic(() => import('../components/Grid'), {
  loading: LoadingFallback,
  ssr: true
})

const Clients = dynamic(() => import('../components/Clients'), {
  loading: LoadingFallback,
  ssr: true
})

const RecentProjects = dynamic(() => import('../components/RecentProjects'), {
  loading: LoadingFallback,
  ssr: true
})

const Prices = dynamic(() => import('../components/Prices'), {
  loading: LoadingFallback,
  ssr: true
})

const Faq = dynamic(() => import('../components/Faq'), {
  loading: LoadingFallback,
  ssr: true
})

const Footer = dynamic(() => import('../components/Footer'), {
  loading: LoadingFallback,
  ssr: true
})

const page = () => {
  return (
    <main className='relative flex justify-center items-center flex-col  mx-auto sm:px-10 px-5 overflow-clip'>
      <div className='max-w-7xl w-full'>
        <FloatingNav navItems={navItems}/>
        <Hero />
        <Grid />
        <Clients />
        <RecentProjects />
        <Prices />
        <Faq />
        <Footer />
      </div>
    </main>
  )
}

export default page