'use client'

import { useState } from "react";
import clsx from 'clsx';
import CountUp from "react-countup";
import { plans } from '@/constants/index'
import React from 'react'
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa6";
import CheckoutButton from "./ui/checkoutButton";


const Prices = () => {

    const [monthly, setMonthly] = useState(false);

  return (
    <section className="pb-15">
    <div id="pricing">
      <div className="container -pb-10">
        <div className="max-w-[960px] pricing-head_before relative mx-auto border-l border-r border-[#0A0A0A] bg-[#0A0A0A]/50 pb-40 pt-28 max-xl:max-w-4xl max-lg:border-none max-md:pb-32 max-md:pt-16">
          <p className="heading mb-15">
           Your Path to Success Starts Here
          </p>

          <div className="relative z-4 mx-auto flex w-[375px] rounded-3xl border-[3px] border-[#F4F5F4]/25 bg-[#120B2A]/50 p-2 -mb-10 backdrop-blur-[6px] max-md:w-[310px]">
            <button
              className={clsx("pricing-head_btn", monthly && "text-[#7d7e81]")}
              onClick={() => setMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={clsx("pricing-head_btn", !monthly && "text-[#7d7e81]")}
              onClick={() => setMonthly(false)}
            >
              Annual
            </button>

            <div
              className={clsx(
                "g4 rounded-[14px] before:h-[100px] pricing-head_btn_before absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(50%-8px)] overflow-hidden shadow-[0px_16px_24px_rgba(0,0,0,0.25),inset_0px_3px_6px_#] transition-transform duration-500",
                !monthly && "translate-x-full",
              )}
            />  
          </div>

         { /*<div className="pricing-bg">
            <img
              src="/bg-outlines.svg"
              width={960}
              height={380}
              alt="outline"
              className="relative z-2"
            />
            <img
              src="/images/bg-outlines-fill.png"
              width={960}
              height={380}
              alt="outline"
              className="absolute inset-0 opacity-5 mix-blend-soft-light"
            />
          </div> */}
        </div> 

        {/*  pricing section*/}
        <div className="scroll-hide relative z-2 -mt-12 flex items-start max-xl:gap-5 max-xl:overflow-auto max-xl:pt-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="pricing-plan_first pricing-plan_last pricing-plan_odd pricing-plan_even relative border-2 p-7 max-xl:min-w-80 max-lg:rounded-3xl xl:w-[calc(33.33%+2px)]"
            >
              {index === 1 && (
                <div className="g4 absolute h-[330px]    left-0 right-0 top-0 z-1 rounded-tl-3xl rounded-tr-3xl" /> ///
              )}

              <div
                className={clsx(
                  " absolute left-0 right-0 z-2 flex items-center justify-center",
                  index === 1 ? "-top-6  " : "-top-6 xl:-top-11",
                )}
              >
                <img
                  src={plan.logo}
                  alt={plan.title}
                  className={clsx(
                    "object-contain drop-shadow-2xl",
                    index === 1 ? "size-[120px]  " : "size-[88px]",
                  )}
                />
              </div>
              <div
                className={clsx(
                  "relative flex flex-col items-center",
                  index === 1 ? "pt-24 " : "pt-12",
                )}
              >
               
                <div
                  className={clsx(
                    "small-2 rounded-[20px] relative z-2 mx-auto mb-6 border-2 px-4 py-1.5 uppercase",
                    index === 1 ?  "border-[#4820FF]   text-[#4820FF]" : "border-[#B49CE5] text-[#B49CE5]",
                  )}
                >
                  {plan.title}
                </div>
              

                <div className="relative z-2 flex items-center justify-center" >
                  <div
                    className={clsx(
                      "h-num flex items-start text-lg",
                      index === 1 ? "text-[#EAEDFF] " : "text-[#bebebe]",
                    )}
                  >
                    ${" "}
                    <CountUp
                      start={plan.priceMonthly}
                      end={monthly ? plan.priceMonthly : plan.priceYearly}
                      duration={0.4}
                      useEasing={false}
                      preserveValue
                    />
                  </div>
                  <div className="small-1 relative top-3 ml-1 uppercase">
                    / mo
                  </div>
                </div>
              </div>

              <div
                className={clsx(
                  "body-1 relative z-2 mb-10 w-full border-b-[#353535] pb-9 text-center text-[#EAEDFF]",
                  index === 1 && "border-b ",
                )}
              >
                {plan.caption}
              </div>

              <ul className="mx-auto space-y-4 xl:px-7">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="relative flex items-center gap-5"
                  >
                    <img
                      src={"/check.png"}
                      alt="check"
                      className="size-10 object-contain"
                    />
                    <p className="flex-1">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex w-full justify-center" >
              
              <CheckoutButton plan={plan.title}/>
              
              </div>

              {index === 1 && (
                <p className="small-compact mt-9 text-center text-p3 before:mx-2.5 before:content-['-'] after:mx-2.5 after:content-['-']">
                  Limited time offer
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
};


export default Prices