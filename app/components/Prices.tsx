'use client'

import { useState } from "react";
import clsx from 'clsx';
import CountUp from "react-countup";
import { plans } from '@/constants/index'
import React from 'react'
import CheckoutButton from "./ui/checkoutButton";
import Image from 'next/image';

const Prices = () => {
  const [monthly, setMonthly] = useState(true);

  return (
    <section className="relative py-24 overflow-hidden" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="heading mb-4 text-white">
            Find your perfect match for<span className='text-purple-300'> SkillSet </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Simple and transparent pricing for everyone.
          </p>
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex justify-center mb-15">
          <div className="relative inline-flex items-center p-1 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-xl">
            <button
              className={clsx(
                "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer",
                monthly ? "text-white bg-[#8b5cf6] shadow-lg" : "text-white/60 hover:text-white/80"
              )}
              onClick={() => setMonthly(true)}
            >
              Monthly
            </button>
            <button
              className={clsx(
                "relative px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer",
                !monthly ? "text-white bg-[#8b5cf6] shadow-lg" : "text-white/60 hover:text-white/80"
              )}
              onClick={() => setMonthly(false)}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={clsx(
                "relative rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-8 transition-all duration-500 cursor-pointer group",
                "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent",
                "hover:scale-[1.02] hover:bg-[#0A0A0A]/90",
                index === 1 ? [
                  "shadow-[0_0_20px_5px_rgba(139,92,246,0.15)]",
                  "after:absolute after:inset-0 after:-z-20 after:rounded-2xl after:shadow-[0_4px_24px_-4px_rgba(139,92,246,0.3)]",
                  "translate-y-[-4px]",
                  "scale-[1.02]",
                  "hover:translate-y-[-6px]",
                  "hover:scale-[1.04]",
                  "hover:shadow-[0_0_25px_8px_rgba(139,92,246,0.2)]"
                ] : ""
              )}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8b5cf6] text-white px-4 py-1 rounded-full text-sm font-medium shadow-[0_4px_12px_-2px_rgba(139,92,246,0.4)]">
                  Most popular
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <Image 
                  src={plan.logo}
                  alt={plan.title}
                  width={64}
                  height={64}
                  className="mx-auto mb-4 h-16 w-16 object-contain drop-shadow-2xl"
                />
                <h3 className="heading-3 mb-2 text-white">{plan.title}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-white">$</span>
                  <CountUp
                    className="text-3xl md:text-4xl font-bold text-white"
                    start={plan.priceMonthly}
                    end={monthly ? plan.priceMonthly : plan.priceYearly}
                    duration={0.4}
                    useEasing={false}
                    preserveValue
                  />
                  <span className="text-lg font-light text-white/60 self-end mb-1">/month</span>
                </div>
                {!monthly && (
                  <p className="text-sm text-white/60 mt-2 font-light">
                    ${plan.priceYearly * 12} billed annually
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white/80">
                    <Image 
                      src="/check.svg" 
                      alt="check" 
                      width={20} 
                      height={20}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto">
                <CheckoutButton 
                  plan={plan.title}
                  className={clsx(
                    "w-full cursor-pointer transition-all duration-300 font-medium",
                    index === 1 
                      ? "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white shadow-xl hover:shadow-[#8b5cf6]/25" 
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Prices;