import React from 'react'
import { Spotlight } from './ui/spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton'
import {FaLocationArrow} from 'react-icons/fa6'
import { companies, testimonials } from '@/constants'
import Image from 'next/image'

const Hero = () => {
  return (
    <div className='pb-5 pt-15'>
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

                <TextGenerateEffect className='text-center text-[36px] md:text-5xl lg:text-6xl mb-3' words='Interview like a top 1% candidate. AI coaching built for landing elite tech roles.' />

                <p className='text-center md:tracking-wider text-sm md:text-lg lg:text-2xl lg:mb-5 mb-5'>
                    SkillSet simulates realistic interviews from FAANG-level companies.
                </p> 
                 
                    <MagicButton 
                        title="Get started"
                        icon={<FaLocationArrow />}
                        position='right'
                    />
                
                <div className='w-full max-w-2xl mt-16 rounded-xl overflow-hidden bg-gray-800 shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-shadow duration-300 ease-out'>
                    <div className="relative w-full aspect-video">
                        <iframe 
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube-nocookie.com/embed/uL0s2SN_0ME?rel=0" 
                        title="How SkillSet Works:"
                        allow="clipboard-write; encrypted-media; picture-in-picture"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen>
                        </iframe>
                    </div>
                </div>

                 <p className='text-center md:tracking-wider text-sm md:text-lg lg:text-2xl mt-15 lg:mb-10'>
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
    </div>
  )
}

export default Hero