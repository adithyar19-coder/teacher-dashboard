import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Submission from '@/lib/models/Submission';
import Assignment from '@/lib/models/Assignment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Get all submissions for an assignment
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const assignmentId = url.searchParams.get('assignmentId');
    const studentId = url.searchParams.get('studentId');
    
    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the teacher owns this assignment
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment || assignment.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to access this assignment' },
        { status: 403 }
      );
    }
    
    const query = studentId 
      ? { assignment: assignmentId, student: studentId }
      : { assignment: assignmentId };
    
    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .sort({ submittedAt: -1 });
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update a submission with grades and feedback
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { submissionId, grade, feedback, status } = await req.json();
    
    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }
    
    const submission = await Submission.findById(submissionId)
      .populate({
        path: 'assignment',
        select: 'createdBy'
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
    
    // Update the submission
    const updateData: any = {};
    
    if (grade !== undefined) updateData.grade = grade;
    if (feedback !== undefined) updateData.feedback = feedback;
    if (status !== undefined) updateData.status = status;
    
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    ).populate('student', 'name email');
    
    return NextResponse.json({ submission: updatedSubmission });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 