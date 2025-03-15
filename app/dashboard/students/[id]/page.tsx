import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Class from '@/lib/models/Class';
import Assignment from '@/lib/models/Assignment';
import Submission from '@/lib/models/Submission';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

async function getStudentProgress(studentId: string, teacherId: string) {
  await dbConnect();
  
  // Get the student
  const student = await User.findOne({
    _id: studentId,
    role: 'student',
  });
  
  if (!student) {
    return null;
  }
  
  // Get classes where the student is enrolled and the teacher is the current user
  const classes = await Class.find({
    teacher: teacherId,
    students: studentId,
  });
  
  const classIds = classes.map(cls => cls._id);
  
  // Get assignments for these classes
  const assignments = await Assignment.find({
    class: { $in: classIds },
    createdBy: teacherId,
  }).populate('class', 'name');
  
  const assignmentIds = assignments.map(assignment => assignment._id);
  
  // Get submissions for these assignments
  const submissions = await Submission.find({
    assignment: { $in: assignmentIds },
    student: studentId,
  }).populate({
    path: 'assignment',
    select: 'title totalPoints class dueDate',
    populate: {
      path: 'class',
      select: 'name',
    },
  });
  
  // Calculate statistics
  const totalAssignments = assignments.length;
  const completedAssignments = submissions.length;
  const gradedSubmissions = submissions.filter(sub => sub.grade !== undefined).length;
  
  // Calculate average grade
  let totalGrade = 0;
  let totalPossiblePoints = 0;
  
  submissions.forEach(sub => {
    if (sub.grade !== undefined) {
      totalGrade += sub.grade;
      totalPossiblePoints += sub.assignment.totalPoints;
    }
  });
  
  const averageGrade = totalPossiblePoints > 0 
    ? Math.round((totalGrade / totalPossiblePoints) * 100) 
    : 0;
  
  return {
    student: JSON.parse(JSON.stringify(student)),
    classes: JSON.parse(JSON.stringify(classes)),
    assignments: JSON.parse(JSON.stringify(assignments)),
    submissions: JSON.parse(JSON.stringify(submissions)),
    stats: {
      totalAssignments,
      completedAssignments,
      gradedSubmissions,
      averageGrade,
    },
  };
}

export default async function StudentProgressPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  if (session.user.role !== 'teacher') {
    redirect('/student-dashboard');
  }
  
  const data = await getStudentProgress(params.id, session.user.id);
  
  if (!data) {
    redirect('/dashboard/students');
  }
  
  const { student, classes, submissions, stats } = data;
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Group submissions by class
  const submissionsByClass = submissions.reduce((acc, submission) => {
    const classId = submission.assignment.class._id;
    if (!acc[classId]) {
      acc[classId] = [];
    }
    acc[classId].push(submission);
    return acc;
  }, {});
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Students
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Progress
        </h1>
      </div>
      
      {/* Student Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {student.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {student.email}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Classes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{classes.length}</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalAssignments > 0 
                  ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100) 
                  : 0}%
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Grade</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.averageGrade}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress by Class */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Progress by Class
        </h2>
        
        {classes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              This student is not enrolled in any of your classes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {classes.map((cls) => (
              <div key={cls._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {cls.name}
                    </h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {submissionsByClass[cls._id] && submissionsByClass[cls._id].length > 0 ? (
                    submissionsByClass[cls._id].map((submission) => (
                      <div key={submission._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="flex items-start">
                            <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                            <div>
                              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                {submission.assignment.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Due: {formatDate(submission.assignment.dueDate)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0 flex items-center space-x-4">
                            <div>
                              {submission.status === 'submitted' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Submitted
                                </span>
                              ) : submission.status === 'graded' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Graded
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Returned
                                </span>
                              )}
                            </div>
                            
                            <div className="text-sm font-medium">
                              {submission.grade !== undefined ? (
                                <span className="text-gray-900 dark:text-white">
                                  {submission.grade} / {submission.assignment.totalPoints}
                                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                                    ({Math.round((submission.grade / submission.assignment.totalPoints) * 100)}%)
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">
                                  Not graded
                                </span>
                              )}
                            </div>
                            
                            <Link
                              href={`/dashboard/assignments/${submission.assignment._id}/submissions/${submission._id}`}
                              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No submissions for this class yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 