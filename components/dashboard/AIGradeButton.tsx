'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { getSubmission, updateSubmission } from '@/lib/mockData';

interface AIGradeButtonProps {
  submissionId: string;
  onGradeGenerated: (aiGrade: number, aiFeedback: string) => void;
}

const AIGradeButton: React.FC<AIGradeButtonProps> = ({ submissionId, onGradeGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIGrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For the prototype, we'll simulate AI grading
      // In a real app, this would call the OpenAI API
      
      // Get the submission content
      const submission = getSubmission(submissionId);
      
      if (!submission) {
        throw new Error('Submission not found');
      }
      
      // Simulate a delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random score between 70 and 100
      const score = Math.floor(Math.random() * 31) + 70;
      
      // Generate some feedback based on the score
      let feedback = '';
      if (score >= 90) {
        feedback = "Excellent work! Your submission demonstrates a thorough understanding of the concepts. The answers are well-structured and accurate.";
      } else if (score >= 80) {
        feedback = "Good job! Your submission shows a solid grasp of the material. There are a few minor areas that could be improved.";
      } else {
        feedback = "Satisfactory work. Your submission meets the basic requirements, but there are several areas that need improvement to demonstrate a deeper understanding.";
      }
      
      // Update the submission with AI grading
      updateSubmission(submissionId, {
        aiGrade: score,
        aiFeedback: feedback
      });
      
      // Call the callback with the AI grade and feedback
      onGradeGenerated(score, feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className={`inline-flex items-center text-sm font-medium ${
          isLoading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300'
        }`}
        onClick={generateAIGrade}
        disabled={isLoading}
      >
        <Zap className={`h-4 w-4 mr-1 ${isLoading ? 'animate-pulse' : ''}`} />
        {isLoading ? 'Generating...' : 'Generate AI Grade'}
      </button>
      
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          Error: {error}
        </p>
      )}
    </div>
  );
};

export default AIGradeButton; 