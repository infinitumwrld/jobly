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
            Everyone’s selling shortcuts. We give you the edge that actually works.
                        </p>

            <a href='#pricing'>
                <MagicButton title='Try SkillSet Now' icon={<FaLocationArrow/>} position='right'  />
            </a>
        </div>

           

        <div className='flex mt-16 md:flex-row flex-col justify-between items-center'>
           
            <div className='flex items-center md:gap-3 gap-6 p-5'>
                {socialMedia.map((profile) => (
                    <div key={profile.id} className='w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300'> 
                        <a href={profile.url} target="_blank" rel="noopener noreferrer">
                        <Image src={profile.img} alt={`{profile.id}`} width={20} height={20} />
                        </a>
                    </div>
                ))}
            </div>
            <p className='md:text-base text-sm md:font-normal font-light'>
                © 2025 Skill-Set. All rights reserved.
            </p>

        </div>

          {/* Footer links */}
          <div className='flex justify-center mt-12 mb-8 z-10 relative'>
            <div className='flex space-x-6'>
                <a href='/terms' className='text-gray-400 hover:text-purple-400 cursor-pointer'>
                    Terms of Service
                </a>
                <a href='/privacy' className='text-gray-400 hover:text-purple-400 cursor-pointer'>
                    Privacy Policy
                </a>
                <a href='/sing-in' className='text-gray-400 hover:text-purple-400 cursor-pointer'>
                    Log In
                </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer