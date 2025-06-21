import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import { redirect } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

const InterviewPage = async ({ params }: PageProps) => {
  const user = await getCurrentUser();
  const { id: interviewId } = await params;

  if (!user) {
    redirect('/sign-in');
  }

  // In a real app, you'd fetch interview details from database
  // For now, we'll use the ID to conduct the interview
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Mock Interview</h1>
          <p className="text-gray-600">
            Ready to begin your interview? Click the call button below to start.
            Your session will be recorded and encrypted for analysis.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 Privacy Notice: This interview will be recorded and encrypted for analysis purposes. 
              Recordings are automatically deleted after 30 days.
            </p>
          </div>
        </div>

        <Agent 
          userName={user.name} 
          userId={user.id} 
          interviewId={interviewId}
          type="interview"
          questions={[
            "Tell me about yourself and your background",
            "What interests you most about this role?",
            "Describe a challenging project you've worked on",
            "How do you handle working under pressure?",
            "Where do you see yourself in 5 years?"
          ]}
        />
      </div>
    </div>
  )
}

export default InterviewPage
