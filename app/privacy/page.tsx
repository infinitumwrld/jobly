import React from 'react'
import Footer from '../components/Footer'

const page = () => {
  return (
    <div className=' pt-30 flex flex-col items-center justify-center px-4 py-6 max-w-4xl mx-auto overflow-clip relative '>
        <h1 className='heading lg:max-w-[40vw] px-3'>
        Privacy Policy 
        </h1>
        <div className='text-white-200 md:mt-10 my-5 text-center '>
            <p className='font-bold pb-5'> Effective Date: April 20, 2025</p>  
            Skill Set, LLC (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is committed to protecting your privacy and ensuring a secure user experience. This Privacy Policy outlines how we collect, use, and protect your information when you use Skill Set, an AI-powered mock interview platform.  <span className='font-bold'> By accessing or using the Service, you agree to the collection and use of your information in accordance with this policy. </span>
        </div>
        <div className="pt-10 max-w-3xl mx-auto flex flex-col ">
            <h2 className='text-2xl font-semibold text-white'> 1. Information We Collect </h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
            We collect both personal and non-personal information when you use the Skill Set platform. This includes:
            </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> Personal Information: We may collect personal information such as your name, email address, and payment details during registration or subscription processes. </li>

               <li className='text-lg font-semibold'> Interview Data: As part of the mock interview process, we collect the transcripts and other data generated during your interviews. This data may include responses, feedback, and assessment results.</li>

              <li className='text-lg font-semibold mb-5'> Device and Usage Information: We may collect information about the devices you use to access the platform, including browser type, IP address, and usage data (e.g., how often you use the platform and which features you interact with).</li>
            </ul>
            </div>

            <h2 className='text-2xl font-semibold text-white'> 2. How We Use Your Information </h2>
            <div className="mt-4 text-lg text-white-200 pb-10">
            <p className="mt-4 text-lg text-white-200 pb-10">
            The information we collect is used for the following purposes:
            </p>
            <ul className="list-disc pl-6 list-inside pt-5">
               <li className=' text-lg font-semibold pr-5'> Account Management: To create and manage your account, verify your identity, and provide personalized services.</li>

               <li className='text-lg font-semibold'>AI Interview and Feedback: To power the AI-driven mock interview process, providing personalized interview feedback, scoring, and areas for improvement. </li>

               <li className='text-lg font-semibold'>Improvement of Services: To improve the functionality of Skill Set, including the AI model and user experience. We may also analyze aggregated data for research purposes.</li>

            <li className='text-lg font-semibold mb-5'>  Subscription and Payment Processing: To process your payments, including billing and subscription management. </li>
         </ul>
      </div>

            <h2 className='text-2xl font-semibold text-white'> 3. Data Security </h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. This includes encryption of data in transit and at rest, secure authentication, and access controls. However, no method of transmission over the internet is 100% secure, and we cannot guarantee the absolute security of your data.
            </p>

            <h2 className='text-2xl font-semibold text-white'>4. AI Data Usage</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            As part of using our AI-powered mock interview platform, the data provided during your interviews (e.g., transcripts, responses) may be used by the AI model to generate feedback and assess your performance. We do not share personal information from your mock interviews with third parties for marketing purposes. All data is used strictly to improve the AI model's accuracy and provide feedback to you.
            </p>

            <h2 className='text-2xl font-semibold text-white'>5. Third-Party Services</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may use third-party services, such as payment processors (e.g., Stripe), hosting services, and data storage providers, to facilitate the operation of Skill Set. These third parties may have access to your information, but only for the purpose of providing their respective services. We ensure that they adhere to privacy practices that align with our standards.
            </p>

            <h2 className='text-2xl font-semibold text-white'>6. Cookies and Tracking Technologies</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may use cookies and similar technologies to enhance your user experience on Skill Set. Cookies allow us to remember your preferences and improve the functionality of the platform. You can control cookie preferences through your browser settings, but please note that disabling cookies may affect certain features of the platform.
            </p>

            <h2 className='text-2xl font-semibold text-white'>7. Data Retention</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. If you decide to deactivate or delete your account, we will retain your data only as necessary for legal, regulatory, or business purposes.
            </p>

            <h2 className='text-2xl font-semibold text-white'>8. Your Rights</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
              You have the right to access, update, or delete your personal information at any time. If you wish to request access to your data, correct inaccuracies, or delete your account, please contact us.
              You also have the right to object to the processing of your personal data or to withdraw your consent where applicable.
            </p>

            <h2 className='text-2xl font-semibold text-white'>9. Children's Privacy</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            Skill Set is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If you believe we have collected data from a child under 13, please contact us immediately, and we will take steps to delete that information.
            </p>

            <h2 className='text-2xl font-semibold text-white'>10. Changes to This Privacy Policy</h2>
            <p className="mt-4 text-lg text-white-200 pb-10">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Effective Date" at the top of the page will be updated accordingly. We encourage you to review this policy periodically to stay informed about how we protect your data.
            </p>

        </div>
        <div className=' w-full h-full left-0 pt-20 mind-h-96 ' >
            <Footer />
         </div>
    </div>
  
  )
}

export default page