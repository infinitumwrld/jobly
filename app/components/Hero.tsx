import React from 'react'
import { Spotlight } from './ui/spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton'
import {FaLocationArrow} from 'react-icons/fa6'

const Hero = () => {
  return (
    <div className='pb-15 pt-20'>
        <div>
            <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='white'/>
            <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple'/>
            <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='white'/>
        </div>
 
        <div className='flex justify-center relative my-20 z-10 pb-15'>


            <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center'>
                <p className='badge font-bold uppercase  tracking-widest text-xs  '>
                F*ck cheat tools. Get hired for real.
                 <span></span>
                </p>

                <TextGenerateEffect className='text-center text-[36px] md:text-5xl lg:text-6xl mb-5' words='Interview like a top 1% candidate. AI coaching built for landing elite tech roles.' />

                <p className='text-center md:tracking-wider text-sm md:text-lg lg:text-2xl lg:mb-5 sm:mb-10'>
                    SkillSet simulates realistic interviews from FAANG-level companies.
                </p> 
                 
                    <MagicButton 
                        title="Get started"
                        icon={<FaLocationArrow />}
                        position='right'
                    />
                
            </div>
        </div>
    </div>
  )
}

export default Hero