'use client';

import React, { useState, useEffect } from 'react';
import { getClassesForTeacher } from '@/lib/mockData';
import Link from 'next/link';
import { Plus, Users, Link as LinkIcon, Copy, Trash2, X, AlertTriangle } from 'lucide-react';

export default function ClassesPage() {
  // Mock user ID for demonstration
  const userId = "teacher1";
  
  // State to store all classes (mock + created)
  const [allClasses, setAllClasses] = useState<any[]>([]);
  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    classId: string;
    className: string;
  } | null>(null);
  
  // Function to load classes
  const loadClasses = () => {
    // Get mock classes
    const mockClasses = getClassesForTeacher(userId);
    
    // Get classes from localStorage
    let createdClasses: any[] = [];
    try {
      const savedClasses = localStorage.getItem('createdClasses');
      if (savedClasses) {
        createdClasses = JSON.parse(savedClasses);
        
        // Convert string dates back to Date objects if they exist
        createdClasses = createdClasses.map(cls => ({
          ...cls,
          createdAt: cls.createdAt ? new Date(cls.createdAt) : new Date(),
          joinLink: `http://localhost:3001/join-class/${cls.classCode}`
        }));
      }
    } catch (error) {
      console.error('Error loading classes from localStorage:', error);
    }
    
    // Combine both sources
    setAllClasses([...mockClasses, ...createdClasses]);
  };
  
  useEffect(() => {
    loadClasses();
  }, [userId]);
  
  // Function to handle class deletion
  const handleDeleteClass = (classId: string) => {
    try {
      // Get classes from localStorage
      const savedClasses = localStorage.getItem('createdClasses');
      if (savedClasses) {
        let classes = JSON.parse(savedClasses);
        
        // Filter out the class to delete
        classes = classes.filter((cls: any) => cls.id !== classId);
        
        // Save updated classes back to localStorage
        localStorage.setItem('createdClasses', JSON.stringify(classes));
        
        // Update state
        loadClasses();
      }
      
      // Close the modal
      setDeleteModal(null);
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };
  
  // Function to open delete confirmation modal
  const openDeleteModal = (classId: string, className: string) => {
    setDeleteModal({
      isOpen: true,
      classId,
      className
    });
  };
  
  // Function to close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal(null);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Classes
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your classes and student enrollments
          </p>
        </div>
        
        <Link
          href="/dashboard/classes/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Class
        </Link>
      </div>
      
      {allClasses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
            No classes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first class to start managing your students and assignments.
          </p>
          <Link
            href="/dashboard/classes/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Class
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allClasses.map((cls) => (
            <div 
              key={cls.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {cls.name}
                  </h3>
                  <button
                    onClick={() => openDeleteModal(cls.id, cls.name)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete class"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {cls.description}
                </p>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{cls.students ? cls.students.length : 0} students</span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm truncate">{cls.joinLink || `http://localhost:3001/join-class/${cls.classCode}`}</span>
                  <button 
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => {
                      navigator.clipboard.writeText(cls.joinLink || `http://localhost:3001/join-class/${cls.classCode}`);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="text-sm font-medium mr-2">Class Code:</span>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {cls.classCode}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-between">
                <Link
                  href={`/dashboard/classes/${cls.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  href={`/dashboard/classes/${cls.id}/assignments`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Assignments
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteModal && deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Delete Class
              </h2>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to delete the class <span className="font-semibold">{deleteModal.className}</span>? This action cannot be undone and all associated data will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClass(deleteModal.classId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 