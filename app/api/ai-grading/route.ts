import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/lib/models/Submission';
import Assignment from '@/lib/models/Assignment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { submissionId } = await req.json();
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    // Get the submission with assignment details
    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignment',
        select: 'title description totalPoints createdBy'
      });
    
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    // Verify the teacher owns this assignment
    if (submission.assignment.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to grade this submission' },
        { status: 403 }
      );
    }
    
    // Prepare the prompt for OpenAI
    const prompt = `
      You are an expert teacher grading a student's assignment.
      
      Assignment: ${submission.assignment.title}
      Description: ${submission.assignment.description}
      Total Points: ${submission.assignment.totalPoints}
      
      Student Submission:
      ${submission.content}
      
      Please grade this submission and provide:
      1. A numerical score out of ${submission.assignment.totalPoints} points
      2. Detailed feedback explaining the grade, including strengths and areas for improvement
      3. Specific suggestions for how the student can improve
      
      Format your response as a JSON object with the following structure:
      {
        "score": number,
        "feedback": "detailed feedback here"
      }
    `;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an expert teacher assistant that grades assignments fairly and provides constructive feedback." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // Parse the response
    const aiResponseText = response.choices[0].message.content;
    let aiGrading;
    
    try {
      // Extract JSON from the response
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiGrading = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not extract JSON from AI response");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json(
        { error: "Failed to parse AI grading response" },
        { status: 500 }
      );
    }
    
    // Update the submission with AI grading
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      {
        aiGrade: aiGrading.score,
        aiFeedback: aiGrading.feedback,
      },
      { new: true }
    );
    
    return NextResponse.json({
      submission: updatedSubmission,
      aiGrading
    });
  } catch (error) {
    console.error('Error with AI grading:', error);
    return NextResponse.json(
      { error: 'Internal server error with AI grading' },
      { status: 500 }
    );
  }
} 