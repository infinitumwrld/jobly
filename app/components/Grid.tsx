'use client'
import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/BentoGrid'
import { gridItems } from '@/constants'

const Grid = () => {
  return (
    <section id='about'>

<h1 className='heading'>
            5 Reasons Skill Set  {' '}
            <span className='text-purple-300'>Will Get You Hired  </span>
        </h1>
        <BentoGrid className='w-full py-15'>
            {gridItems.map(({ id, title, description, className, img, imgClassName, titleClassName, spareImg }) => (
                <BentoGridItem 
                    id={id}
                    key={id}
                    title={title}
                    description={description}
                    className={className}
                    img={img}
                    imgClassName={imgClassName}
                    titleClassName={titleClassName}
                    spareImg={spareImg}
                />
            ))}
        </BentoGrid>
    </section>
  )
}

export default Grid