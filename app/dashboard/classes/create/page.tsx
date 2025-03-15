'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, File, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateClassPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the class
      const classId = `class_${Date.now()}`;
      
      // Generate a class code based on the name
      const classCode = generateClassCode(className);
      
      // Create student names based on the number of documents
      const studentNames = [
        "John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", 
        "William Miller", "Olivia Wilson", "James Moore", "Ava Taylor",
        "Alexander Anderson", "Isabella Thomas", "Benjamin Jackson", "Mia White",
        "Ethan Harris", "Charlotte Martin", "Daniel Thompson", "Amelia Garcia"
      ];
      
      // Create a new class object
      const newClass = {
        id: classId,
        name: className,
        description: description,
        students: files.map((file, index) => ({
          id: `student_${Date.now()}_${index}`,
          name: studentNames[index % studentNames.length],
          email: `student${index + 1}@example.com`,
          classId: classId
        })),
        classCode,
        documents: files.map(file => ({
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          studentName: studentNames[files.indexOf(file) % studentNames.length],
          graded: false
        }))
      };
      
      // Save to localStorage
      const savedClasses = localStorage.getItem('createdClasses');
      let classes = [];
      
      if (savedClasses) {
        classes = JSON.parse(savedClasses);
      }
      
      classes.push(newClass);
      localStorage.setItem('createdClasses', JSON.stringify(classes));
      
      // Show success message
      setIsSuccess(true);
      
      // Reset form after a delay
      setTimeout(() => {
        setClassName('');
        setDescription('');
        setFiles([]);
        setIsSubmitting(false);
        setIsSuccess(false);
        
        // Redirect to classes page
        router.push('/dashboard/classes');
      }, 2000);
    } catch (error) {
      console.error('Error creating class:', error);
      setIsSubmitting(false);
    }
  };
  
  // Generate a class code based on the class name
  const generateClassCode = (name: string) => {
    // Extract first letters of each word and add random numbers
    const letters = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${letters}${randomNum}`;
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Link
          href="/dashboard/classes"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Classes
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Class
        </h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Class Created Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Your class and documents have been uploaded.</p>
            <Link
              href="/dashboard/classes"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Go to Classes
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Class Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Mathematics 101"
              />
            </div>
            
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Provide a description of your class"
              ></textarea>
            </div>
            
            {/* File Upload Section */}
            <div>
              <label 
                htmlFor="documents" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Upload Documents (Word, PDF, etc.)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple
                        accept=".doc,.docx,.pdf,.txt"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Word, PDF up to 10MB each
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Note: Each uploaded document will be treated as a student submission.
              </p>
            </div>
            
            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Uploaded Files ({files.length})
                </h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-gray-100">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end">
              <Link
                href="/dashboard/classes"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mr-4"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 