'use client'

import React from 'react'
import { InfiniteMovingCards } from './ui/infiniteMovingCards'
import { testimonials } from '@/constants'


const Clients = () => {
  return (
 <div className='py-20' id='testimonials'>
    <h1 className='heading'>
    Tired of Freezing in Interviews?  <br/>
        <span className='text-purple-300'>You’re Not Alone.</span>
    </h1>
        <p className='text-center md:tracking-wider mb-2 text-sm md:text-lg lg:text-2xl mt-5'>
        Others are already leveling up with us — and landing real offers
         </p> 
    <div className='flex flex-col items-center max-lg:mt-10'>
        <InfiniteMovingCards 
            items={testimonials}
            direction='right'
            speed='normal'
            />
 
        </div>
    </div>
  )
}

export default Clients