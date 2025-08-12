'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  preferredDepartment: string;
  message: string;
}

interface GoogleUserInfo {
  name: string;
  email: string;
  picture?: string;
}

export default function CareWorkerSignup() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    experience: '',
    preferredDepartment: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // Decode the JWT token to get user info
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentialResponse.credential}`);
      const userInfo = await response.json();
      
      // Auto-fill the form with Google data
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: prev.phone // Keep existing phone if user already entered it
      }));
      
      setIsGoogleSignup(true);
      setMessage({ 
        type: 'success', 
        text: 'Google signup successful! Please complete the remaining fields and submit your application.' 
      });
      
    } catch (error) {
      console.error('Error processing Google signup:', error);
      setMessage({ 
        type: 'error', 
        text: 'Google signup failed. Please use the manual form instead.' 
      });
    }
  };

  const handleGoogleError = () => {
    setMessage({ 
      type: 'error', 
      text: 'Google signup failed. Please use the manual form instead.' 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/signup-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          signupMethod: isGoogleSignup ? 'google' : 'manual'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Signup request submitted successfully! A manager will review your application and contact you soon.' 
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: '',
          preferredDepartment: '',
          message: ''
        });
        setIsGoogleSignup(false);
      } else {
        throw new Error(data.error || 'Failed to submit signup request');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred while submitting your request' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Team</h2>
        <p className="text-gray-600">Interested in becoming a care worker? Submit your application below!</p>
      </div>

      {/* Google Signup Button */}
      <div className="mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="signup_with"
          shape="rectangular"
          width="100%"
        />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience *
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredDepartment" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Department
          </label>
          <select
            id="preferredDepartment"
            name="preferredDepartment"
            value={formData.preferredDepartment}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          >
            <option value="">Select department</option>
            <option value="Nursing">Nursing</option>
            <option value="Care">Care</option>
            <option value="Support">Support</option>
            <option value="Administration">Administration</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Why would you like to join our team?
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="Tell us about your motivation and why you'd be a great fit..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Your application will be reviewed by our management team.</p>
        <p>We'll contact you within 2-3 business days.</p>
      </div>
    </div>
  );
}
