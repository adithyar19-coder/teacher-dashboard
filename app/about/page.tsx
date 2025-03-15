import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Automated Assignment Grading System</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead">
            The Automated Assignment Grading System is a powerful tool designed to help teachers save time and provide consistent, high-quality feedback to students.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to transform the grading process by leveraging AI technology to automate routine grading tasks, allowing teachers to focus more on personalized instruction and student engagement.
          </p>
          
          <h2>Key Features</h2>
          <ul>
            <li><strong>AI-Powered Grading:</strong> Automatically grade assignments with advanced AI algorithms</li>
            <li><strong>Detailed Feedback:</strong> Provide comprehensive feedback to help students improve</li>
            <li><strong>Time-Saving:</strong> Reduce grading time by up to 70%</li>
            <li><strong>Consistency:</strong> Ensure fair and consistent grading across all submissions</li>
            <li><strong>Analytics:</strong> Track student progress and identify areas for improvement</li>
          </ul>
          
          <h2>How It Works</h2>
          <p>
            Our system uses state-of-the-art AI models to analyze student submissions, comparing them against rubrics and expected answers. The AI provides an initial grade and detailed feedback, which teachers can review and adjust before returning to students.
          </p>
          
          <div className="mt-8">
            <Link 
              href="/login" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 