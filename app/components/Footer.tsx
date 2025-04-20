import Image from 'next/image'
import React from 'react'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa6'
import { socialMedia } from '@/constants'

const Footer = () => {
  return (
    <footer className='w-full pt-10 pb-10' id='contact'>
        <div className='w-full absolute left-0 -bottom-72 mind-h-96'>
            <Image src='/footer-grid.svg' alt='grid' className='w-full h-full opacity-50'  
            width={1200}
            height={400}
            style={{ width: '100%', height: 'auto' }}
            priority/>
        </div>

        <div className='flex flex-col items-center'>
            <h1 className='heading lg:max-w-[40vw] px-3 '>
            Skill Set is built for <span className='text-purple-300'>one thing — </span> getting you hired. 
            </h1>
            <p className='text-white-200 md:mt-10 my-5 text-center pb-7'>
            We give you the real feedback you need to win. No excuses, no time wasted. The job you want is waiting. Are you ready to take it?
            </p>

            <a href=''>
                <MagicButton title='Try SkillSet Now' icon={<FaLocationArrow/>} position='right'  />
            </a>
        </div>

        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
            <p className='md:text-base text-sm md:font-normal font-light'>
                © Copyright 2025 Skill-Set
            </p>
            <div className='flex items-center md:gap-3 gap-6 p-5'>
                {socialMedia.map((profile) => (
                    <div key={profile.id} className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300'> 
                        <a href={profile.url} target="_blank" rel="noopener noreferrer">
                        <Image src={profile.img} alt={`{profile.id}`} width={20} height={20} />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    </footer>
  )
}

export default Footer