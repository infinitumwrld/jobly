'use client' // Only needed if using this in app directory with server components

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { faq } from '@/constants'; 
import React from 'react'
import clsx from 'clsx';



function Accordion() {

    const [activeIndex, setIndex] = useState(faq.map((item) => ({ ...item, isActive: false })));
    const toggleAccordion = (index: number) => {
        console.log('Accordion clicked', index);
        setIndex((prevActiveIndex) => {
            return prevActiveIndex.map((item, idx) => {
                return idx === index ? { ...item, isActive: !item.isActive } : item;
            });
        });
    };


    return (
        <>
        <div className='pb-30'>
        <h1 className='heading p-10 pb-15'>
        What Most Students Ask Us {' '} <br/>
            <span className='text-purple-300 '>(Before They Stop F*cking Up Interviews)</span>
        </h1>
            <div className='accordion '>
                <section className='accordion-heading'>
                    <Image src='/faq.png' height={100} width={100} alt="questions" />
                    <h1>FAQs</h1> 
                </section>

                <ul >
                    {faq.map((item, index) => (
                        <li className='accordion-list ' key={index}>
                            <div className='accordion-question' onClick={() => { toggleAccordion(index) }}>
                                <h2>{item.question}</h2>
                                <img height={35} width={35} src={activeIndex[index].isActive === true ? '/minus.png' : '/plus.png'} alt="" />
                            </div>
                            <div className={`accordion-answer ${activeIndex[index].isActive === true ? 'visible' : ''}`}>
                                <div >
                                    {item.answer}
                                </div> 
                            </div>
                        </li>
                    ))} 
                </ul>

            </div >
            </div>   
        </>
    )
}

export default Accordion