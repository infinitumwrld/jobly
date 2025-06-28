'use client';

import { jsPDF } from 'jspdf';
import type { CategoryScore } from '@/types';

interface PDFGeneratorProps {
  interview: {
    role: string;
    type: string;
    techstack: string[];
    createdAt: string;
  };
  feedback: {
    totalScore: number;
    categoryScores: CategoryScore[];
    scores: Record<string, number>;
    comments: Record<string, string>;
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
  };
}

export function generatePDF({ interview, feedback }: PDFGeneratorProps) {
  // Create PDF document
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 10;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const maxWidth = pageWidth - 2 * margin;

  // Helper function to add text with word wrap
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${interview.role} Interview Feedback`, margin, yPos);
  yPos += lineHeight * 2;

  // Interview Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Type: ${interview.type}`, margin, yPos);
  yPos += lineHeight;
  doc.text(`Tech Stack: ${interview.techstack.join(', ')}`, margin, yPos);
  yPos += lineHeight;
  doc.text(`Date: ${new Date(interview.createdAt).toLocaleDateString()}`, margin, yPos);
  yPos += lineHeight * 2;

  // Overall Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`Overall Score: ${feedback.totalScore}%`, margin, yPos);
  yPos += lineHeight * 2;

  // Category Scores
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Category Breakdown:', margin, yPos);
  yPos += lineHeight * 1.5;

  // Add each category with score and comment
  feedback.categoryScores.forEach((category, index) => {
    checkNewPage(lineHeight * 4); // Check if we need a new page

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${category.name}: ${category.score}%`, margin, yPos);
    yPos += lineHeight;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    yPos = addWrappedText(category.comment, margin + 10, yPos, maxWidth - 10);
    yPos += lineHeight;
  });

  // Strengths
  checkNewPage(lineHeight * (feedback.strengths.length + 2));
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Strengths:', margin, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  feedback.strengths.forEach(strength => {
    yPos = addWrappedText(`• ${strength}`, margin + 5, yPos, maxWidth - 5);
    yPos += lineHeight / 2;
  });

  // Areas for Improvement
  checkNewPage(lineHeight * (feedback.areasForImprovement.length + 2));
  yPos += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Areas for Improvement:', margin, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  feedback.areasForImprovement.forEach(area => {
    yPos = addWrappedText(`• ${area}`, margin + 5, yPos, maxWidth - 5);
    yPos += lineHeight / 2;
  });

  // Final Assessment
  checkNewPage(lineHeight * 6); // Estimate space needed for final assessment
  yPos += lineHeight * 1.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Final Assessment:', margin, yPos);
  yPos += lineHeight;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  yPos = addWrappedText(feedback.finalAssessment, margin, yPos, maxWidth);

  // Save the PDF
  doc.save(`${interview.role.toLowerCase()}_interview_feedback.pdf`);
} 