import React from 'react'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div className=' pt-30 flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto overflow-clip relative'>
        <h1 className='heading lg:max-w-[40vw] px-3'>
        Terms Of Service
        </h1>
        <div className='text-white-200 md:mt-10 my-5 text-center '>
            <p className='font-bold pb-5'> Effective Date: April 20, 2025</p>  
             Welcome to Skill Set, These Terms of Service (“Terms”) govern your access to and use of Skill Set’s services (the “Service”), provided by Skill Set, LLC ("we," "us," or "our"). Please read these Terms carefully before using the Service. By using or accessing the Service, you agree to comply with and be bound by these Terms. <span className='font-bold'>If you do not agree to these Terms, you are not authorized to use the Service. </span>
        </div>
        <div className="pt-10 max-w-3xl mx-auto flex flex-col ">
            <h2 className='text-2xl font-semibold text-white'> 1. Acceptance of Terms </h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
                By accessing or using Skill Set, you agree to be bound by these Terms and any additional policies or terms incorporated by reference. If you disagree with any part of the Terms, you must not access or use the Service.
            </p>
            <h2 className='text-2xl font-semibold text-white'> 2. Eligibility </h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            You must be at least 13 years old to use the Service. If you are under the age of 18, you must have the permission of a parent or legal guardian to use the Service.
            </p>
            <h2 className='text-2xl font-semibold text-white'> 3. Account Registration and Security </h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
              To use certain features of the Service, you may need to create an account. You agree to: 
              </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> Provide accurate, current, and complete information during the registration process.</li>

               <li className='text-lg font-semibold'> Maintain the security of your account and password.</li>

              <li className='text-lg font-semibold mb-5'>  Notify us immediately if you suspect any unauthorized access to your account.</li>
            </ul>
            <p className="mt-4 text-lg text-white-200 pb-10">
            You are responsible for all activities under your account, and we are not responsible for any loss or damage resulting from unauthorized use of your account.
           </p>
            </div>

            <h2 className='text-2xl font-semibold text-white'> 4. Subscription Plans and Payment </h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
                Skill Set offers various subscription plans for different services, including free trials and paid subscriptions. By subscribing to a paid plan, you agree to the following: 
            </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> You authorize us to charge your provided payment method on a recurring basis, depending on the selected subscription.</li>

               <li className='text-lg font-semibold'> Subscription payments are non-refundable, and you will continue to be charged until you cancel your subscription.</li>

              <li className='text-lg font-semibold mb-5'>  You can cancel your subscription at any time through your account settings, but cancellations will take effect at the end of the current billing cycle.</li>
            </ul>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We reserve the right to change subscription prices at any time, with notice provided in accordance with these Terms.
            </p>
            </div>

            <h2 className='text-2xl font-semibold text-white'> 5. Free Trials </h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may offer a free trial period for certain subscription plans. Free trials are subject to the following conditions:
            </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> After the free trial ends, you will automatically be charged unless you cancel the trial before the trial period expires.</li>

               <li className='text-lg font-semibold'> We may, at our discretion, limit the availability of free trials to one per user.</li>
            </ul>
            </div>

            <h2 className='text-2xl font-semibold text-white'>6. Use of the Service</h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
            Skill Set is an AI-powered interview preparation platform designed to assist users in practicing job interviews. You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited from:
           </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> Using the Service to engage in illegal activities, including fraud, hacking, or harassment.</li>

               <li className='text-lg font-semibold'> Attempting to reverse-engineer, decompile, or otherwise exploit the Service.</li>

              <li className='text-lg font-semibold'>  Interfering with or disrupting the operation of the Service.</li>

              <li className='text-lg font-semibold mb-5'>  Violating any applicable laws or regulations while using the Service.</li>
            </ul>
            </div>

            <h2 className='text-2xl font-semibold text-white'> 7. AI-Generated Feedback </h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            The feedback provided by the Service is AI-generated and for educational and informational purposes only. We do not guarantee that this feedback will lead to job placement or interview success. You should not rely on the feedback solely but use it in combination with your own judgment and other resources.
            </p>

            <h2 className='text-2xl font-semibold text-white'>8. Content Ownership and License</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            You retain all rights to any content you submit to the Service, including your interview responses and other materials ("Your Content"). By submitting Your Content, you grant Skill Set a worldwide, royalty-free license to use, display, and analyze Your Content for the purpose of providing the Service.
            You acknowledge that we may collect, store, and analyze Your Content in accordance with our Privacy Policy.
            </p>

            <h2 className='text-2xl font-semibold text-white'>9. Privacy Policy</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you agree to the terms outlined in our Privacy Policy.
            </p>

            <h2 className='text-2xl font-semibold text-white'>10. Limitation of Liability</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            To the fullest extent permitted by law, Skill Set, its affiliates, and its employees are not liable for any indirect, incidental, special, or consequential damages, including loss of data, loss of profit, or loss of goodwill, arising from your use of or inability to use the Service.
            </p>

            <h2 className='text-2xl font-semibold text-white'>11. Termination</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may suspend or terminate your access to the Service at any time, without notice, for violations of these Terms or for any other reason at our sole discretion. Upon termination, all rights and licenses granted to you under these Terms will cease immediately.
You can also terminate your account by contacting us directly, and you will lose access to the Service after the termination date.
            </p>

            <h2 className='text-2xl font-semibold text-white'>12. Modification of Terms</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may update or modify these Terms at any time, with or without notice. Any changes will be posted on this page, and the revised Terms will be effective when posted. By continuing to use the Service after changes are posted, you agree to be bound by the updated Terms.
            </p>

            <h2 className='text-2xl font-semibold text-white'>13. Indemnification</h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
            You agree to indemnify, defend, and hold harmless Skill Set, its officers, employees, agents, and affiliates from any claim, demand, loss, liability, damages, or costs, including reasonable attorney’s fees, arising out of or related to:
            </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'>Your use of the Service</li>

               <li className='text-lg font-semibold'> Your violation of these Terms</li>

              <li className='text-lg font-semibold pb-10'> Your infringement of any intellectual property or other rights of any third party </li>

            </ul>
            </div>

            <h2 className='text-2xl font-semibold text-white'>14. Governing Law</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            These Terms are governed by and construed in accordance with the laws of the state of South Carolina, USA, without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Greenville County, South Carolina.
            </p>
            
            <h2 className='text-2xl font-semibold text-white'>15. Dispute Resolution</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            In the event of a dispute, you agree to first attempt to resolve the matter informally by contacting Skill Set. If the dispute cannot be resolved through informal discussions, it will be submitted to binding arbitration in accordance with the rules of the American Arbitration Association (AAA).
            </p>

        </div>
        <div className=' w-full  left-0 pt-20 mind-h-96 ' >
            <Footer />
         </div>
    </div>
  
  )
}

export default page