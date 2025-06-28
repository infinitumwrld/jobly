'use server'

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { Interview, Feedback, CategoryScore } from '@/types';

interface GetLatestInterviewsParams {
    userId: string;
    limit?: number;
}

interface CreateFeedbackParams {
    interviewId: string;
    userId: string;
    transcript: { role: string; content: string }[];
}

interface GetFeedbackByInterviewIdParams {
    interviewId: string;
    userId: string;
}


export async function getInterviewsByUserId(
    userId: string
  ): Promise<Interview[] | null> {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  }

  export async function getLatestInterviews(
    { userId, limit = 20 }: GetLatestInterviewsParams
  ): Promise<Interview[] | null> {
    const snapshot = await db
      .collection("interviews")
      .where("finalized", "==", true)   // equality first
      .where("userId", "!=", userId)    // inequality
      .orderBy("userId")                // MUST match inequality field
      .orderBy("createdAt", "desc")     // secondary sort
      .limit(limit)
      .get();
  
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  }

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db
      .collection("interviews")
      .doc(id)
      .get();

    return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams){
    const { interviewId, userId, transcript } = params;

    try {
        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string }) => 
                `- ${sentence.role}: ${sentence.content}\n`
            )
            .join('');

            const { object : { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment }} = await generateObject({ 
                model: google('gemini-2.0-flash-001', {
                    structuredOutputs: false, 
                }),
                schema: feedbackSchema, 
                prompt: `
                 You are an AI interviewer analyzing a computer science realistic interview. Your task is to evaluate the candidate's performance based on structured categories. Speak directly to them using second-person language ("you"). Be thorough, detailed, and provide actionable feedback. If there are mistakes or areas for improvement, make sure to point them out, but always provide actionable advice. Don't be lenient. Remember, your feedback should be clear and easy to understand so they can improve their performance.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following categories.  
        For each category, first give a brief explanation for the score (2-3 sentences), then the numeric score (out of 100).  
        Provide actionable suggestions for improvement wherever weaknesses are observed.  
        Do not add any new categories or commentary outside of the categories listed.

        Categories:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Did they demonstrate a good fit for the company culture and the role? Were their values aligned with the role they are interviewing for? Provide suggestions on how they can better align their responses with company culture.
        - **Confidence & Clarity**: How confident were they in their answers? Did they engage effectively and speak with clarity? Highlight areas where they showed confidence and areas they can improve.

        Important Instructions: 
        - Keep feedback professional, direct, and concise — no vague or overly generic comments.
        - Be constructive: even if a candidate scores low in a category, provide advice on how they can improve.
        - Return the feedback clearly grouped by category.
        `,
      system:
        `You are a professional interviewer analyzing a realistic mock interview. Your task is to evaluate the candidate based on structured categories. Always speak directly to the candidate using second-person language ("you"). Provide clear, actionable, and empathetic feedback. Your responses should always explain why a candidate received a certain score in each category and provide guidance on how to improve.`, 
             });

             const feedback = await db.collection('feedback').add({
                interviewId,
                userId,
                totalScore,
                categoryScores,
                strengths,
                areasForImprovement,
                finalAssessment,
                createdAt: new Date().toISOString()
             })

             return {
                success: true,
                feedbackId: feedback.id
             }

    } catch (e) {
        console.error('Error saving feedback:', e)

        return { success: false };
    }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId} = params;
    
    const feedback = await db
        .collection('feedback')
        .where('interviewId', '==', interviewId)
        .where('userId', '==', userId)
        .get();

    if(feedback.empty) return null;

    // Convert all feedback to properly structured objects
    const feedbacks = feedback.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            interviewId: data.interviewId,
            userId: data.userId,
            totalScore: data.totalScore,
            categoryScores: data.categoryScores,
            strengths: data.strengths,
            areasForImprovement: data.areasForImprovement,
            finalAssessment: data.finalAssessment,
            createdAt: data.createdAt || new Date().toISOString()
        } as Feedback;
    });

    // Sort by createdAt in descending order and take the most recent
    feedbacks.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return feedbacks[0];
}

export async function getFeedbackByInterviewIds(params: { interviewIds: string[], userId: string }): Promise<Record<string, Feedback>> {
    const { interviewIds, userId } = params;
    
    // Get all feedback without ordering in the query
    const feedback = await db
        .collection('feedback')
        .where('userId', '==', userId)
        .where('interviewId', 'in', interviewIds)
        .get();

    const feedbackMap: Record<string, Feedback> = {};
    
    // Group feedback by interviewId and sort in memory
    const feedbackGroups: Record<string, Feedback[]> = {};
    
    feedback.docs.forEach(doc => {
        const data = doc.data();
        const feedbackItem = {
            id: doc.id,
            interviewId: data.interviewId,
            userId: data.userId,
            totalScore: data.totalScore,
            categoryScores: data.categoryScores,
            strengths: data.strengths,
            areasForImprovement: data.areasForImprovement,
            finalAssessment: data.finalAssessment,
            createdAt: data.createdAt || new Date().toISOString()
        } as Feedback;

        if (!feedbackGroups[data.interviewId]) {
            feedbackGroups[data.interviewId] = [];
        }
        feedbackGroups[data.interviewId].push(feedbackItem);
    });

    // For each interview, sort its feedback by date and take the latest
    Object.entries(feedbackGroups).forEach(([interviewId, feedbacks]) => {
        // Sort by createdAt in descending order
        feedbacks.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Take the latest feedback
        feedbackMap[interviewId] = feedbacks[0];
    });

    return feedbackMap;
}

export async function deleteInterview({ interviewId }: { interviewId: string }): Promise<{ success: boolean }> {
    try {
        await db.collection('interviews').doc(interviewId).delete();
        return { success: true };
    } catch (error) {
        console.error('Error deleting interview:', error);
        return { success: false };
    }
}

export async function duplicateInterview(params: { role: string; type: string; techstack: string[]; userId: string }): Promise<{ success: boolean; interviewId?: string }> {
    try {
        const { role, type, techstack, userId } = params;
        const interview = await db.collection('interviews').add({
            role,
            type,
            techstack,
            userId,
            createdAt: new Date().toISOString()
        });

        return {
            success: true,
            interviewId: interview.id
        };
    } catch (error) {
        console.error('Error duplicating interview:', error);
        return { success: false };
    }
}

export async function generatePDF({ interview, feedback }: { 
    interview: { id: string; role: string; type: string; techstack: string[]; createdAt: string }; 
    feedback: any 
}): Promise<{ success: boolean; data?: any }> {
    try {
        // Return the data needed for PDF generation
        return { 
            success: true, 
            data: {
                interview,
                feedback
            }
        };
    } catch (error) {
        console.error('Error preparing PDF data:', error);
        return { success: false };
    }
}
