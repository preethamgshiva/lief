'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CareWorkerSignup from '../../components/CareWorkerSignup';

export default function CareWorkerSignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Care Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're looking for compassionate and dedicated care workers to join our team. 
            Submit your application below and we'll get back to you soon!
          </p>
        </div>

        {/* Signup Form */}
        <div className="flex justify-center">
          <CareWorkerSignup />
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Have questions about the application process?</p>
          <p>Contact us at <span className="text-blue-600">hr@liefcare.com</span> or call <span className="text-blue-600">+1 (555) 123-4567</span></p>
        </div>
      </div>
    </div>
  );
}
