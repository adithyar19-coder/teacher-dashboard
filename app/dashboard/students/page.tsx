'use client';

import React from 'react';
import { getStudentsForTeacher, getClassesForTeacher } from '@/lib/mockData';
import StudentsList from '@/components/dashboard/StudentsList';

export default function StudentsPage() {
  // Mock user ID for demonstration
  const userId = "teacher1";
  
  // Get students from mock data
  const students = getStudentsForTeacher(userId);
  const classes = getClassesForTeacher(userId);
  
  // Format students with their classes
  const formattedStudents = students.map(student => {
    // Find classes this student is in
    const studentClasses = classes.filter(cls => 
      cls.students.includes(student.id)
    ).map(cls => ({
      _id: cls.id,
      name: cls.name
    }));
    
    return {
      _id: student.id,
      name: student.name,
      email: student.email,
      classes: studentClasses
    };
  });
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Students
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and track your students' progress across all classes
        </p>
      </div>
      
      <StudentsList students={formattedStudents} />
    </div>
  );
} 