import React from 'react'
import { Spotlight } from './ui/spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton'
import {FaLocationArrow} from 'react-icons/fa6'

const Hero = () => {
  return (
    <div className='pb-20 pt-15'>
        <div>
            <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'/>
            <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'/>
            <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue'/>
        </div>

        <div className='flex justify-center relative my-20  pb-15'>
            <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center'>
                <h2 className='badge uppercase tracking-widest text-xs  '>
                 Skill Set Gets You There, Faster.
                 <span></span>
                </h2>
                <TextGenerateEffect className='text-center text-[36px] md:text-5xl lg:text-6xl' words='Real conversations. Real-time coaching.
                    The kind of prep that actually gets you hired.' />

                <p className='text-center md:tracking-wider mb-10 text-m  md:text-lg lg:text-2xl'>
                  Trusted by 10,000+ job seekers preparing for roles at Google, Meta, and more.
                </p> 
                <a href='#about'>
                    <MagicButton 
                        title="Start now"
                        icon={<FaLocationArrow />}
                        position='right'
                    />
                </a>
            </div>
        </div>
    </div>
  )
}

export default Hero