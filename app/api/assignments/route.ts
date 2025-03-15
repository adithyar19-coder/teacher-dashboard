import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Assignment from '@/lib/models/Assignment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Get all assignments for a teacher
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
    const classId = url.searchParams.get('classId');
    
    const query = classId 
      ? { class: classId, createdBy: session.user.id }
      : { createdBy: session.user.id };
    
    const assignments = await Assignment.find(query)
      .populate('class', 'name classCode')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new assignment
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
    
    const { title, description, dueDate, classId, totalPoints } = await req.json();
    
    if (!title || !description || !dueDate || !classId) {
      return NextResponse.json(
        { error: 'Title, description, due date, and class ID are required' },
        { status: 400 }
      );
    }
    
    const newAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      class: classId,
      createdBy: session.user.id,
      totalPoints: totalPoints || 100,
    });
    
    return NextResponse.json({ assignment: newAssignment }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 