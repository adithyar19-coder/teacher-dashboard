'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';
import SearchBar from './SearchBar';

interface StudentClass {
  _id: string;
  name: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  classes: StudentClass[];
}

interface StudentsListProps {
  students: Student[];
}

const StudentsList: React.FC<StudentsListProps> = ({ students }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) {
      return students;
    }
    
    const query = searchQuery.toLowerCase();
    return students.filter(
      student => 
        student.name.toLowerCase().includes(query) || 
        student.email.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);
  
  return (
    <div className="space-y-6">
      <SearchBar 
        placeholder="Search for students by name or email..."
        onSearch={setSearchQuery}
      />
      
      {filteredStudents.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
            {students.length === 0 ? 'No students yet' : 'No matching students'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {students.length === 0 
              ? 'You don\'t have any students enrolled in your classes yet.'
              : 'Try adjusting your search query to find students.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Classes
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {student.classes.map((cls) => (
                          <span 
                            key={cls._id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {cls.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/students/${student._id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Progress
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList; 