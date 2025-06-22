import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.actions';
import { getPresetInterviewById } from '@/constants/presets';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

const Page = async ({ searchParams }: { searchParams?: { presetId?: string } }) => {
  const user = await getCurrentUser();
  // Enforce authentication for all interview pages
  if (!user) {
    return redirect('/sign-in');
  }
  const { presetId } = searchParams || {};

  // If this is a custom interview (no presetId), show the custom agent
  if (!presetId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl font-bold mb-2">Custom Interview</h1>
          <p className="text-lg text-gray-600 mb-3">Practice for any role, company, or tech stack!</p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="text-lg font-semibold mb-2">How it works</h3>
            <p className="text-sm text-gray-700 mb-2">
              The AI interviewer will first ask you for the company, role, tech stack, and experience level. Then it will conduct a realistic interview based on your answers.
            </p>
            <p className="text-sm text-gray-700">
              Click the &quot;Call&quot; button below to start your custom interview.
            </p>
          </div>
          {user && (
            <Agent 
              userId={user.id} 
              userName={user.name || 'User'}
              type='custom' // Custom type triggers the new agent logic
            />
          )}
        </div>
      </div>
    );
  }

  console.log("Interview page - presetId:", presetId);

  if (presetId) {
    console.log("Looking up preset interview with ID:", presetId);
    const presetInterview = getPresetInterviewById(presetId);
    console.log("Found preset interview:", presetInterview ? "Yes" : "No");

    if (presetInterview) {
      console.log("Rendering preset interview page for:", presetInterview.role);
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold mb-2">{presetInterview.role} Interview</h1>
            <p className="text-lg text-gray-600 mb-3">Company: {presetInterview.company}</p>
            
            <div className="bg-black p-4 rounded-lg mb-6 text-left shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-white">About This Interview</h3>
              <p className="text-sm text-white mb-2">
                This is a preset interview for a {presetInterview.role} position at {presetInterview.company}. 
                The AI interviewer will guide you through a structured interview experience.
              </p>
              <p className="text-sm text-white">
                Click the &quot;Call&quot; button below to start your interview. The system uses a conversation 
                workflow that follows a natural interview format and will include the preset questions.
              </p>
            </div>
            
            <Agent 
              userId={user.id} 
              userName={user.name || 'User'}
              interviewId={presetInterview.id} 
              type='interview' 
              questions={presetInterview.questions}
              interviewRole={presetInterview.role}
              interviewLevel={presetInterview.level}
              company={presetInterview.company}
            />
          </div>
        </div>
      );
    } else {
      // Handle case where preset ID was provided but not found
      console.log("Preset interview not found for ID:", presetId);
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-3xl font-bold mb-4">Interview Not Found</h1>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
              <p className="text-gray-700 mb-4">
                We couldn&apos;t find the preset interview you were looking for. The ID &quot;{presetId}&quot; may be invalid 
                or no longer available.
              </p>
              <Link href="/preset-interviews" className="text-blue-600 hover:underline">
                Browse all preset interviews
              </Link>
            </div>
            <Link href="/" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">AI Interview Preparation</h1>
        <p className="text-lg text-gray-600 mb-4">
          Choose your interview type to get started with personalized questions and voice recording.
        </p>
        <div className="mb-6">
          <Link href="/preset-interviews" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
            Browse Company-Specific Interviews
          </Link>
        </div>
        
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
            <Agent userName={user.name || 'Guest'} userId={user.id} type='generate'/>
          </div>
        </div>
        
        <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">About Our AI Interviews</h3>
          <p className="text-sm text-gray-700 mb-3">
            Our AI interview system uses advanced conversation workflows to create a realistic and structured interview experience.
            The system adapts to your responses while following a professional interview format.
          </p>
          <p className="text-sm text-gray-700">
            For the most realistic experience, try our preset company-specific interviews that include
            carefully crafted questions based on real interview patterns.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page