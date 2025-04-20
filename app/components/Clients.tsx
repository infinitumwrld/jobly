'use client'

import React from 'react'
import { InfiniteMovingCards } from './ui/infiniteMovingCards'
import { companies, testimonials } from '@/constants'

const Clients = () => {
  return (
 <div className='py-20' id='testimonials'>
    <h1 className='heading'>
    Tired of Freezing in Interviews?  <br/>
        <span className='text-purple-300'>You’re Not Alone.</span>
    </h1>
        <p className='text-center md:tracking-wider mb-2 text-sm md:text-lg lg:text-2xl mt-5'>
        Students who train with Skill Set land more offers and gain the confidence they need to perform.
         </p> 
    <div className='flex flex-col items-center max-lg:mt-10'>
        <InfiniteMovingCards 
            items={testimonials}
            direction='right'
            speed='normal'
            />

            <div className='flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10'>
               {companies.map(({ id, img, name, nameImg}) => (
                <div key={id} className='flex md:max-60 max-w-30 gap-2 '>
                    <img 
                        src={img}
                        alt={name}
                        className='md:w-10 w-5'
                    />
                    <img 
                        src={nameImg}
                        alt={name}
                        className='md:w-24 w-20 mt-5'
                    />
                </div>
               ))} 
            </div>
        </div>
    </div>
  )
}

export default Clients