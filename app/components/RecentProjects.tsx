"use client";

import { workExperience } from '@/constants'
import React from 'react'
import { Button } from './ui/movingBorders';
import MagicButton from './ui/MagicButton';
import { FaLocationArrow } from 'react-icons/fa6';
import Image from 'next/image';

const RecentProjects = () => {
  return (
    <div className='pt-15 ' id='approach'>
        <h1 className='heading'>
        💡 Why Skill Set Works {' '} <br/>
            <span className='text-purple-300 '>When Everything Else Doesn&apos;t</span>
        </h1>
        <div className='w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10 pb-5'>
           {workExperience.map((card) => (
            <Button
              key={card.id}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius= '1.75rem'
              className='flex-1 text-white border-neutral-200 dark:border-slate-700'
              
            >
              <div className='flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2 mt-5'>
                <Image 
                  src={card.thumbnail} 
                  alt={card.title} 
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className='lg:ms-5'>
                <h1 className='text-start text-xl md:text-2xl font-bold'>
                  {card.title}
                </h1>
                <p className='text-start text-white-100 mt-3 font-semibold '>
                  {card.desc}
                </p>
              </div>
            </Button>
           ))} 
        </div>
          <h1 className='heading pt-20'>
            Ready to Stop F*cking Up Interviews? <span className='text-purple-300'> Give us a try for only $3 </span> 
          </h1>
        <div className='max-w-[50vw] md:max-w-2xl lg:max-w-[60vw] flex flex-center justify-center items-center m-10'>
                    <MagicButton 
                        title="Start Trial Now"
                        icon={<FaLocationArrow />}
                        position='right'
                    />
           </div> 
    </div>

  )
}

export default RecentProjects