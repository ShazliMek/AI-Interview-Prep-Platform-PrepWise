import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import { redirect } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

const InterviewPage = async ({ params }: PageProps) => {
  const user = await getCurrentUser();
  if (!user) {
    // Redirect to sign-in page if user is not authenticated
    redirect('/sign-in');
  }
  const { id } = await params;

  // Treat the [id] param as the job title for custom interviews
  const jobTitle = id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // e.g. 'software-engineer' -> 'Software Engineer'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">AI Mock Interview</h1>
          <p className="text-gray-600">
            Ready to begin your interview for <b>{jobTitle}</b>? Click the call button below to start.
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
          type="custom"
          jobTitle={jobTitle}
        />
      </div>
    </div>
  )
}

export default InterviewPage
