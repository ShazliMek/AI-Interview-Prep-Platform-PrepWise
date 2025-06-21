import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import Link from 'next/link'
import React from 'react'

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">AI Interview Preparation</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose your interview type to get started with personalized questions and voice recording.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/interview/software-engineer" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Software Engineer</h3>
            <p className="text-gray-600">Technical interviews with coding and system design questions</p>
          </Link>
          
          <Link href="/interview/product-manager" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Product Manager</h3>
            <p className="text-gray-600">Product strategy, analytics, and leadership scenarios</p>
          </Link>
          
          <Link href="/interview/data-scientist" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Data Scientist</h3>
            <p className="text-gray-600">Statistics, machine learning, and data analysis</p>
          </Link>
          
          <Link href="/interview/marketing-manager" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">Marketing Manager</h3>
            <p className="text-gray-600">Campaign strategy, analytics, and brand management</p>
          </Link>
          
          <Link href="/interview/ux-designer" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">UX Designer</h3>
            <p className="text-gray-600">Design thinking, user research, and portfolio review</p>
          </Link>
          
          <Link href="/interview/general" className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3">General Interview</h3>
            <p className="text-gray-600">Behavioral questions and general interview skills</p>
          </Link>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🎤 Voice Recording & Analysis</h3>
          <p className="text-gray-700 mb-4">
            All interviews include voice recording with end-to-end encryption for personalized feedback.
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ AES-256 encryption for maximum privacy</p>
            <p>✅ Automatic deletion after 30 days</p>
            <p>✅ Full user control and data ownership</p>
            <p>✅ AI-powered speech analysis and feedback</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Or practice with question generation:</h3>
          <div className="p-6 border border-gray-200 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Interview Question Generator</h3>
            <p className="text-gray-600 mb-4">Get personalized interview questions without recording</p>
            <Agent userName={user?.name || 'Guest'} userId={user?.id} type='generate'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page