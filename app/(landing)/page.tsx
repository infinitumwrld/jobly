import React from 'react'
import Hero from '../components/Hero'
import { FloatingNav } from '../components/ui/FloatingNav'
import { FaHome } from 'react-icons/fa'
import Grid from '../components/Grid'
import RecentProjects from '../components/RecentProjects'
import { navItems } from '@/constants'
import Clients from '../components/Clients'
import Prices from '../components/Prices'
import Footer from '../components/Footer'
import Faq from '../components/Faq'


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