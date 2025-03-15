import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Class from '@/lib/models/Class';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';

// Get all classes for a teacher
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
    
    const classes = await Class.find({ teacher: session.user.id })
      .populate('teacher', 'name email')
      .populate('students', 'name email');
    
    return NextResponse.json({ classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new class
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
    
    const { name, description } = await req.json();
    
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Generate a unique class code
    const classCode = nanoid(8);
    
    // Create a join link
    const joinLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/join-class/${classCode}`;
    
    const newClass = await Class.create({
      name,
      description,
      classCode,
      joinLink,
      teacher: session.user.id,
      students: [],
    });
    
    return NextResponse.json({ class: newClass }, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 