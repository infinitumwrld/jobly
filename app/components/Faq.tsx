'use client' // Only needed if using this in app directory with server components

import { useState } from 'react';
import Image from 'next/image';
import { faq } from '@/constants'; 
import React from 'react'

function Accordion() {
    const [activeIndex, setIndex] = useState<number | null>(null);
    
    const toggleAccordion = (index: number) => {
        setIndex(currentIndex => currentIndex === index ? null : index);
    };

    return (
        <div className='pb-30'>
            <h1 className='heading p-10 pb-15 max-w-4xl mx-auto text-center'>
                What Most Students Ask Us {' '} <br/>
                <span className='text-purple-300'>(Before They Stop F*cking Up Interviews)</span>
            </h1>
            <div className='accordion max-w-4xl mx-auto'>
                <section className='accordion-heading'>
                    <Image 
                        src='/faq.png' 
                        height={100} 
                        width={100} 
                        alt="questions"
                        priority={false}
                        loading="lazy"
                        quality={75}
                    />
                    <h1>FAQs</h1> 
                </section>

                <ul>
                    {faq.map((item, index) => (
                        <li className='accordion-list' key={index}>
                            <button 
                                className='accordion-question w-full text-left flex justify-between items-center'
                                onClick={() => toggleAccordion(index)}
                                aria-expanded={activeIndex === index}
                            >
                                <h2>{item.question}</h2>
                                <Image 
                                    src={activeIndex === index ? '/minus.png' : '/plus.png'}
                                    height={35} 
                                    width={35} 
                                    alt={activeIndex === index ? "collapse" : "expand"}
                                    loading="lazy"
                                    quality={75}
                                />
                            </button>
                            <div 
                                className={`accordion-answer transition-all duration-200 ease-in-out ${activeIndex === index ? 'visible max-h-96' : 'invisible max-h-0'}`}
                                aria-hidden={activeIndex !== index}
                            >
                                <div>{item.answer}</div> 
                            </div>
                        </li>
                    ))} 
                </ul>
            </div>
        </div>
    )
}

export default Accordion