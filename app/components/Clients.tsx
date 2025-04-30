'use client'

import React from 'react'
import { InfiniteMovingCards } from './ui/infiniteMovingCards'
import { companies, testimonials } from '@/constants'
import Image from 'next/image'

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
         <p className='text-center md:tracking-wider text-sm md:text-lg lg:text-2xl mt-2 lg:mb-10'>
         We've gained credibility from the most competitive companies like:
         </p> 
            <div className='flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10'>
           
               {companies.map(({ id, img, name, nameImg}) => (
                <div key={id} className='flex md:max-60 max-w-30 gap-2 '>
                     <Image
                        src={img}
                        alt={name}
                        height={100}
                        width={100}
                        className="object-contain"
                        priority
                    />
                    
                </div>
               ))} 
            </div>
        </div>
    </div>
  )
}

export default Clients