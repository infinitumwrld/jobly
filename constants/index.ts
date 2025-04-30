import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional hiring manager conducting a real-time voice interview for a technical or computer science role, refer to {{role}} or {{type}} if possible. Your goal is to assess their qualifications, motivation, and fit for the role, following the standards of top tech companies (Google, Meta, Amazon, etc.).

**Follow the structured question flow:**
- Ask the questions provided in the structured list: {{questions}}.
- Ask one main question at a time.
- If a candidate's response is vague, incomplete, unclear, or off-topic, politely guide them back with a brief, focused follow-up or reframe the question.

**Engage naturally and stay in control:**
- Listen actively to each response.
- Briefly acknowledge their answer before moving forward.
- If their answer does not directly address the question, politely point it out and ask them to focus on the specific topic.
- Maintain a smooth conversation flow without losing control of the interview pace.

**Be professional, yet warm and welcoming:**
- Use official, confident, but friendly language.
- Keep all responses short, professional, and conversational — as if speaking during a real in-person interview.
- Avoid robotic phrasing. Sound natural and human.

**Handle candidate questions professionally:**
- If asked about the role, company, or expectations, provide a clear and relevant answer.
- If unsure about an answer, politely inform them that HR will provide further clarification.

**Conclude the interview properly:**
- Thank the candidate genuinely for their time and effort.
- Inform them that the company will reach out soon with feedback.
- End the conversation on a polite, positive, and professional note.

Important:
- Always maintain a polite, respectful, and professional tone.
- Keep your own responses brief and to the point — like a real-time voice conversation.
- Keep full control of the interview, steering candidates back on track if needed, without sounding harsh or impatient.
`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

    
export const dummyInterviews: Interview[] = [
    {
      id: "1",
      userId: "user1",
      role: "Frontend Developer",
      type: "Technical",
      techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      level: "Junior",
      questions: ["What is React?"],
      finalized: false,
      createdAt: "2024-03-15T10:00:00Z",
    },
    {
      id: "2",
      userId: "user1",
      role: "Full Stack Developer",
      type: "Mixed",
      techstack: ["Node.js", "Express", "MongoDB", "React"],
      level: "Senior",
      questions: ["What is Node.js?"],
      finalized: false,
      createdAt: "2024-03-14T15:30:00Z",
    },
  ];


  export const navItems = [
    { name: "About", link: "#about" },
    { name: "Testimonials", link: "#testimonials" },
    { name: "Approach", link: "#approach" },
    { name: "Pricing", link: "#pricing" },
    
  ];
  
  export const gridItems = [
    {
      id: 1,
      title: "Built for Real Interview Pressure ",
      description: "",
      className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
      imgClassName: "w-full h-full",
      titleClassName: "justify-end",
      img: "/b1.svg",
      spareImg: "",
    },
    {
      id: 2,
      title: "Train Anytime, Anywhere ",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-start ",
      img: "",
      spareImg: "",
    },
    {
      id: 3,
      title: "Instant Confidence Boost",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-2",
      imgClassName: "",
      titleClassName: "justify-center",
      img: "",
      spareImg: "",
    },
    {
      id: 4,
      title: "Actionable, High-Quality Feedback",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-start",
      img: "/grid.svg",
      spareImg: "/b4.svg",
    },
  
    {
      id: 5,
      title: "Real-World, Tech-Specific Practice",
      description: "The Inside Scoop",
      className: "md:col-span-3 md:row-span-2",
      imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
      titleClassName: "justify-center md:justify-start lg:justify-center",
      img: "/b5.svg",
      spareImg: "/grid.svg",
    },
    {
      id: 6,
      title: "Ready to Secure Your Job or Internship?",
      description: "",
      className: "lg:col-span-2 md:col-span-3 md:row-span-1",
      imgClassName: "",
      titleClassName: "justify-center md:max-w-full max-w-60 text-center",
      img: "",
      spareImg: "",
    },
  ];
  
  
  export const testimonials = [
    {
      quote:
        "I used to freeze up during interviews and had no clue how to answer on the spot. Skill Set’s real-time feedback helped me stay calm, confident, and actually know what to say. After using it, I nailed my Google interview—and now I’m in!",
      name: "James T.",
      title: "Google Software Engineer",
    },
    {
      quote:
        "I tried other mock interview platforms, but they were just robotic. Skill Set felt like a real conversation. The feedback was specific and actually helped. It’s the reason I landed my internship at Meta.",
      name: "Sophia R.",
      title: "Meta intern",
    },
    {
      quote:
        "I used to freeze up in interviews and blank on everything. Skill Set’s real-time feedback actually helped me stay calm and nail my answers. It felt like practicing with someone who actually gets it.",
      name: "Alex K.",
      title: " Software Developer",
    },
    {
      quote:
        "Interviewing used to feel like a guessing game. Skill Set’s AI broke down exactly what I was messing up, from my tone to how I structured my answers. After just a few sessions, I started getting offers from companies like Netflix and Spotify.",
      name: "Olivia G.",
      title: "UX Designer",
    },
    {
      quote:
        "I’d always get to the final round and then lose out. Skill Set pinpointed exactly where I was going wrong in my interviews and gave me real-time tips to fix it. The difference was huge and now I’ve landed my first full-time role at Adobe!",
      name: " Tom H.",
      title: "Adobe Developer",
    },
  ];
  
  export const companies = [
    {
      id: 1,
      name: "google",
      img: "/google.svg",
      nameImg: "",
    },
    { 
      id: 2,
      name: "shopify",
      img: "/shopify.png",
      nameImg: "",
    },
    {
      id: 4,
      name: "meta",
      img: "/meta.svg",
      nameImg: "",
    }, 

    {
      id: 5,
      name: "stripe",
      img: "/stripe.svg",
      nameImg: "",
    },
  ];
  
  export const workExperience = [
    {
      id: 1,
      title: "Built for Brain Freeze",
      desc: "You know the answers… until the interview hits. We simulate real pressure to help you stay calm, sharp, and locked in when it counts.",
      className: "md:col-span-2",
      thumbnail: "/exp1.svg",
    },
    {
      id: 2,
      title: "Feedback That Actually Makes You Better",
      desc: "Generic mock interviews suck. We tell you exactly why you messed up, how to fix it, and what to do next. Every session makes you better.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp2.svg",
    },
    {
      id: 3,
      title: "Tailored to Tech, Not Just Talk",
      desc: "This isn’t some generic bullsh*t. You’ll train with real software engineering questions —exactly what the top companies actually ask.",
      className: "md:col-span-2", // change to md:col-span-2
      thumbnail: "/exp3.svg",
    },
    {
      id: 4,
      title: " On-Demand. No Awkward Calls",
      desc: "Forget scheduling and pointless convos with randoms. We give you instant, realistic AI interviews —practice when it matters, no wasted time.",
      className: "md:col-span-2",
      thumbnail: "/exp4.svg",
    },
  ];
  
  export const socialMedia = [
    {
      id: 1,
      img: "/git.svg",
      url: ''
    },
    {
      id: 2,
      img: "/twit.svg",
      url: 'https://x.com/skillset_ai'
    },
    {
      id: 3,
      img: "/instagram-white-icon.png",
      url: 'https://www.instagram.com/tryskillset'
    },
  ];

  export const plans = [
    {
      id: "0",
      title: "Pro",
      priceMonthly: 49,
      priceId: "price_1RD8nBEbkgNqj4nWZFTU8syW" ,
      priceYearly: 39,
      caption: "For Serious Preparation",
      features: [
        "Unlimited interviews",
        "Advanced feedback on each session",
        "Tailored to tech and CS roles",
        "Priority support",
      ],
      icon: "/images/circle.svg",
      logo: "/pro.png",
    },
    {
      id: "1",
      title: "Premium ",
      priceId: "price_1RD8rgEbkgNqj4nWxxVupuey",
      priceMonthly: 59,
      priceYearly: 49,
      caption: "For High-Level Success",
      features: [
        "Everything in the Pro Plan",
        "Resume optimization and personalized feedback",
        "Exclusive coding interview mock-ups and problem-solving scenarios",
      ],
      icon: "/premium.png",
      logo: "/premium.png",
    },
    {
      id: "2",
      title: "Institution",
      priceId: "price_1RD8ugEbkgNqj4nW3N2bIK76" ,
      priceMonthly: 799,
      priceYearly: 690,
      caption: "Exclusively for teams",
      features: [
        "Access for multiple students at a discounted rate",
        "Unlimited interviews and feedback for each student",
        "Customizable packages to fit the institution’s needs",
      ],
      icon: "/images/hexagon.svg",
      logo: "college.png",
    },
  ];

  export const faq = [
    {
        question: 'How is Skill Set different from other interview prep platforms?',
        answer: 'We are more than just a bunch of mock interviews – it’s real prep that actually helps you improve. Our AI gives you personalized feedback that focuses on the areas you need to work on, and we simulate real interview scenarios so you’re fully prepared for the real thing.'
    },
    {
        question: ' Is Skill Set suitable for all students?',
        answer: 'For sure! If you’re a tech or computer science student looking to land an internship or start your career after graduation, Skill Set is built for you. We focus on preparing you for the exact types of interviews you’ll face, so you’re ready for anything.'
    },
    {
        question: 'What kind of feedback will I get?',
        answer: 'After your interview, you’ll get feedback that’s actually useful. We’re talking about detailed insights on your answers, how you communicated, and where you can improve. It’s not just generic feedback – it’s tailored to help you get better, fast.'
    },
    {
        question: 'How do I get started?',
        answer: 'Getting started is super easy. Just sign up for our $3 trial, take an interview, and see for yourself how we can help. No complicated sign-up process, no hidden fees – just straight to the good stuff.'
    },
  

];