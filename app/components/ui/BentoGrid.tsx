"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "./GradientBg";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { GlobeDemo } from "./GridGlobe";
import Image from 'next/image';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ["CS Roles", "FullStack", "Developer"];
  const rightLists = ["Backend", "Senior-level", "GraphQL"];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = document.getElementById(`bento-item-${id}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [id]);

  const handleClick = () => {
    // Redirect to the pricing section by using the hash in the URL
    window.location.hash = 'pricing';
  };

  return (
    <div
      id={`bento-item-${id}`}
      className={cn(
        "row-span-1 relative overflow-hidden rounded-3xl border group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
        className
      )}
      style={{
        backgroundColor: 'rgb(0,0,0)',
        backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(25,25,25,1) 49%, rgba(0,0,0,1) 91%)'
      }}
    >
      <div className={`${id === 6 && "flex justify-center"} h-full`}>
        {isVisible && (
          <>
            <div className="w-full h-full absolute">
              {img && (
                <Image 
                  src={img} 
                  alt={img} 
                  width={300}
                  height={200}
                  className={cn(imgClassName, "object-cover object-center")}
                />
              )}
            </div>
            <div className={`absolute right-0 -bottom-5 ${id === 5 && "w-full opacity-80"}`}>
              {spareImg && (
                <Image 
                  src={spareImg} 
                  alt={spareImg} 
                  width={300}
                  height={200}
                  className="object-cover object-center w-full h-full"
                />
              )}
            </div>
          </>
        )}
        
        {id === 6 && isVisible && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>
          <div className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10`}>
            {title}
          </div>

          {id === 2 && isVisible && <GlobeDemo />}

          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#161616]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#161616]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#161616]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#161616]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className="mt-5 relative">
              <MagicButton
                title={"I am ready"}
                icon={<FaLocationArrow/>}
                position="right"
                handleClick={handleClick}
                otherClasses=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
