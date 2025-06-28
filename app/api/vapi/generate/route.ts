import { NextRequest, NextResponse } from "next/server";
import { db, auth } from "@/firebase/admin";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(req: NextRequest) {
   
  try {
 /* 1. parse the body */
    const { type, role, level, techstack, amount, userid } = await req.json();
      /* 2. Verify the Firebase ID token from Authorization header */
      const authHeader = req.headers.get("authorization") || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : "";
      if (!token) throw new Error("Missing Authorization token");
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;
    /* 2. Generate interview questions with Gemini */
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
      `,
    });

    /* 3. Build and save the interview doc */
    const interview = await db.collection("interviews").add({
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: uid,  // Use the userid from the request
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    });

    console.log(`Created interview ${interview.id} for user ${userid}`);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Error creating interview:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, data: "Thank you!" }, { status: 200 });
}
