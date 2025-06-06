import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";



export async function POST(request: Request) {

    const { type, role, level, techstack, amount, userid } = await request.json();
    
  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.

        Important guidelines: 
        - Each question must focus on ONE clear topic or skill only.
        - Do not combine multiple questions into one (no multi-part or overloaded questions).
        - Phrase questions in a professional, clear, and natural style — as a real top company interviewer would.
        - Avoid overly casual or robotic phrasing.
        - Behavioral questions should follow real-world formats (e.g., STAR method prompts).
        - Technical questions should challenge core understanding without being confusing or overwhelming.
        - If a topic is complex, split it into separate focused questions instead of stacking.
        - Please return only the questions, without any additional text.
        - The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        - Return the questions formatted like this:
          ["Question 1", "Question 2", "Question 3"] for as many questions needed.
        
        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}