// Mock data store for prototype
import { nanoid } from 'nanoid';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface Class {
  id: string;
  name: string;
  description: string;
  classCode: string;
  joinLink: string;
  teacher: string; // teacher ID
  students: string[]; // student IDs
  createdAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  classId: string;
  createdBy: string; // teacher ID
  totalPoints: number;
  createdAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
  grade?: number;
  aiGrade?: number;
  feedback?: string;
  aiFeedback?: string;
  status: 'submitted' | 'graded' | 'returned';
  createdAt: Date;
}

// Mock data
export const users: User[] = [
  {
    id: '1',
    name: 'Teacher Demo',
    email: 'teacher@example.com',
    role: 'teacher',
  },
  {
    id: '2',
    name: 'Student One',
    email: 'student1@example.com',
    role: 'student',
  },
  {
    id: '3',
    name: 'Student Two',
    email: 'student2@example.com',
    role: 'student',
  },
  {
    id: '4',
    name: 'Student Three',
    email: 'student3@example.com',
    role: 'student',
  },
];

export const classes: Class[] = [
  {
    id: '1',
    name: 'Mathematics 101',
    description: 'Introduction to basic mathematics concepts',
    classCode: 'MATH101',
    joinLink: 'http://localhost:3000/join-class/MATH101',
    teacher: '1',
    students: ['2', '3', '4'],
    createdAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Computer Science Fundamentals',
    description: 'Learn the basics of computer science and programming',
    classCode: 'CS101',
    joinLink: 'http://localhost:3000/join-class/CS101',
    teacher: '1',
    students: ['2', '3'],
    createdAt: new Date('2023-02-10'),
  },
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Basic Algebra Quiz',
    description: 'Solve the following algebra problems. Show your work.',
    dueDate: new Date('2023-06-15'),
    classId: '1',
    createdBy: '1',
    totalPoints: 100,
    createdAt: new Date('2023-05-15'),
  },
  {
    id: '2',
    title: 'Programming Fundamentals',
    description: 'Write a program that calculates the Fibonacci sequence.',
    dueDate: new Date('2023-06-20'),
    classId: '2',
    createdBy: '1',
    totalPoints: 100,
    createdAt: new Date('2023-05-20'),
  },
];

export const submissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentId: '2',
    content: 'Here are my solutions to the algebra problems:\n1. x + 5 = 10, x = 5\n2. 2x - 3 = 7, x = 5\n3. 3x + 2 = 14, x = 4',
    submittedAt: new Date('2023-06-10'),
    grade: 90,
    feedback: 'Good work! You solved all problems correctly.',
    status: 'graded',
    createdAt: new Date('2023-06-10'),
  },
  {
    id: '2',
    assignmentId: '1',
    studentId: '3',
    content: 'My algebra solutions:\n1. x + 5 = 10, x = 5\n2. 2x - 3 = 7, x = 5\n3. 3x + 2 = 14, x = 3 (incorrect)',
    submittedAt: new Date('2023-06-12'),
    status: 'submitted',
    createdAt: new Date('2023-06-12'),
  },
  {
    id: '3',
    assignmentId: '2',
    studentId: '2',
    content: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\n\nfor (let i = 0; i < 10; i++) {\n  console.log(fibonacci(i));\n}',
    submittedAt: new Date('2023-06-18'),
    status: 'submitted',
    createdAt: new Date('2023-06-18'),
  },
];

// Mock data functions
export function getCurrentUser(): User {
  // Return the teacher for the prototype
  return users.find(user => user.role === 'teacher')!;
}

export function getClassesForTeacher(teacherId: string): Class[] {
  return classes.filter(cls => cls.teacher === teacherId);
}

export function getStudentsForTeacher(teacherId: string): User[] {
  // Get all classes for this teacher
  const teacherClasses = getClassesForTeacher(teacherId);
  
  // Get unique student IDs from all classes
  const studentIds = new Set<string>();
  teacherClasses.forEach(cls => {
    cls.students.forEach(studentId => {
      studentIds.add(studentId);
    });
  });
  
  // Get student details
  return users.filter(user => studentIds.has(user.id));
}

export function getAssignmentsForTeacher(teacherId: string, classId?: string): Assignment[] {
  if (classId) {
    return assignments.filter(assignment => 
      assignment.createdBy === teacherId && assignment.classId === classId
    );
  }
  return assignments.filter(assignment => assignment.createdBy === teacherId);
}

export function getSubmissionsForAssignment(assignmentId: string): Submission[] {
  return submissions.filter(submission => submission.assignmentId === assignmentId);
}

export function getSubmission(submissionId: string): Submission | undefined {
  return submissions.find(submission => submission.id === submissionId);
}

export function updateSubmission(submissionId: string, updates: Partial<Submission>): Submission {
  const index = submissions.findIndex(submission => submission.id === submissionId);
  if (index === -1) throw new Error('Submission not found');
  
  submissions[index] = { ...submissions[index], ...updates };
  return submissions[index];
}

export function getStudentById(studentId: string): User | undefined {
  return users.find(user => user.id === studentId);
}

export function getClassById(classId: string): Class | undefined {
  return classes.find(cls => cls.id === classId);
}

export function getAssignmentById(assignmentId: string): Assignment | undefined {
  return assignments.find(assignment => assignment.id === assignmentId);
}

// Function to create a new class
export function createClass(data: { name: string; description: string; teacherId: string }): Class {
  const newClass: Class = {
    id: nanoid(),
    name: data.name,
    description: data.description,
    classCode: nanoid(8).toUpperCase(),
    joinLink: `http://localhost:3000/join-class/${nanoid(8)}`,
    teacher: data.teacherId,
    students: [],
    createdAt: new Date(),
  };
  
  classes.push(newClass);
  return newClass;
}

// Function to create a new assignment
export function createAssignment(data: {
  title: string;
  description: string;
  dueDate: Date;
  classId: string;
  teacherId: string;
  totalPoints: number;
}): Assignment {
  const newAssignment: Assignment = {
    id: nanoid(),
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    classId: data.classId,
    createdBy: data.teacherId,
    totalPoints: data.totalPoints,
    createdAt: new Date(),
  };
  
  assignments.push(newAssignment);
  return newAssignment;
} 