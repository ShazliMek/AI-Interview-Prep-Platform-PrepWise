"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi, VapiAssistantOverrides } from "@/lib/vapi.sdk";

import { logVapiDebug, checkVariableUsage } from "@/lib/utils/vapi-debug";
import { v4 as uuidv4 } from 'uuid';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

interface Message {
    type: string;
    transcriptType?: string;
    role?: 'user' | 'system' | 'assistant';
    transcript?: string;
}

interface AgentProps {
    userName?: string;
    userId?: string;
    interviewId?: string;
    type: "generate" | "interview" | "custom";
    questions?: string[];
    interviewRole?: string;
    interviewLevel?: string;
    company?: string;
    jobTitle?: string;
}

const Agent = ({
    userId,
    interviewId: propInterviewId,
    type,
    questions,
    interviewRole,
    interviewLevel,
    company,
    jobTitle
}: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [userIsSpeaking, setUserIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<string>('');
    const [interviewId] = useState<string>(
        propInterviewId || (type === 'custom' ? `custom-${uuidv4()}` : '')
    );

    // --- Merged State from both branches ---

    const [recordingDuration, setRecordingDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Merged Helper Functions from both branches ---

    // Timer utilities
    const formatTimer = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            if (startTimeRef.current) {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setRecordingDuration(elapsed);
            }
        }, 1000);
    };

    // Data saving utilities
    const saveCompletedInterview = useCallback(async (duration: number): Promise<boolean> => {
        if (type !== 'custom' && type !== 'interview') return true;

        console.log(`[Save Util] Saving interview with duration: ${duration}s`);

        try {
            const response = await fetch('/api/save-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId, // Pass userId directly in the body
                    interviewId,
                    duration: duration,
                    role: jobTitle || interviewRole || 'Interview',
                    type: type === 'custom' ? 'Custom' : 'Preset',
                    company: company || 'Not specified',
                    level: interviewLevel || 'Not specified',
                }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                console.log('[DB] Interview metadata saved.');
                return true;
            } else {
                console.error('[DB] Failed to save interview metadata:', data.message || data.error);
                return false;
            }
        } catch (error) {
            console.error('[DB] Error saving interview metadata:', error);
            return false;
        }
    }, [userId, interviewId, jobTitle, interviewRole, type, company, interviewLevel]);

    // --- Main useEffect hook with merged logic ---
    useEffect(() => {
        const handleCallStart = () => {
            console.log("🟢 Call started!");
            setCallStatus(CallStatus.ACTIVE);
            startTimer();
        };

        const handleCallEnd = async () => {
            console.log('[FORCE UPDATE] This is the new, correct handleCallEnd function.'); // Cache-busting log
            console.log(`[Call Flow] ❌ Call ended. Starting post-call process.`);
            setCallStatus(CallStatus.FINISHED);
            setIsProcessing(true);
            setErrorMessage('');

            console.log('[Call End] Stopping timer...');
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            let finalDuration = recordingDuration;
            if (startTimeRef.current) {
                finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setRecordingDuration(finalDuration); // Update state for UI consistency
                startTimeRef.current = null;
            }
            console.log(`[Call End] Final duration calculated: ${finalDuration}s`);

            try {
                console.log('[Call End] Saving completed interview metadata...');
                const savedSuccessfully = await saveCompletedInterview(finalDuration);

                if (savedSuccessfully) {
                    console.log(`[Call End] Metadata saved. Preparing to redirect to /interview-analysis?interviewId=${interviewId}`);
                    window.location.href = `/interview-analysis?interviewId=${interviewId}`; // Bypassing Next.js router
                } else {
                    console.error('[Call End] Failed to save metadata. Redirecting to my-interviews.');
                    setErrorMessage('Failed to save interview data. Redirecting to home.');
                    router.push('/my-interviews');
                }
            } catch (error) {
                console.error(`[Call End] ❌ Error during post-call processing:`, error);
                setErrorMessage('An error occurred. You will be redirected shortly.');
                setTimeout(() => {
                    console.log('[Call End] Fallback redirection to /my-interviews.');
                    router.push('/my-interviews');
                }, 4000);
            } finally {
                console.log('[Call End] Post-call processing finished.');
                setIsProcessing(false);
            }
        };

        const handleMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final' && message.role && message.transcript) {
                setMessages((prev) => [...prev, { role: message.role!, content: message.transcript! }]);
                setLastMessage(message.transcript);
            }
        };

        const handleSpeechStart = () => setIsSpeaking(true);
        const handleSpeechEnd = () => setIsSpeaking(false);
        const handleError = (error: unknown) => console.error("Vapi error:", error);

        vapi.on('call-start', handleCallStart);
        vapi.on('call-end', handleCallEnd);
        vapi.on('message', handleMessage);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('error', handleError);

        return () => {
            vapi.off('call-start', handleCallStart);
            vapi.off('call-end', handleCallEnd);
            vapi.off('message', handleMessage);
            vapi.off('speech-start', handleSpeechStart);
            vapi.off('speech-end', handleSpeechEnd);
            vapi.off('error', handleError);
        };
    }, [interviewId, router, saveCompletedInterview]);
    
    const prepareVariableValues = () => {
        const variables: Record<string, any> = {};
        if (type === 'interview') {
            if (interviewRole) { variables.interviewRole = interviewRole; variables.role = interviewRole; variables.jobTitle = interviewRole; }
            if (interviewLevel) { variables.interviewLevel = interviewLevel; variables.level = interviewLevel; variables.experience = interviewLevel; }
            if (company) { variables.company = company; variables.companyName = company; }
            if (questions && questions.length > 0) { variables.questionsText = questions.map((q, i) => `${i + 1}. ${q}`).join('\\n'); variables.totalQuestions = questions.length; }
        } else if (type === 'custom' && jobTitle) {
            variables.jobTitle = jobTitle; variables.role = jobTitle;
        }
        if (userId) variables.userId = userId;
        if (interviewId) variables.interviewId = interviewId;
        variables.sessionType = type;
        variables.interviewType = type;
        return variables;
    };
    
    const startVapiCall = async (): Promise<boolean> => {
        const assistantId = type === 'interview' ? process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID : type === 'custom' ? process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID_CUSTOM : process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
        if (!assistantId) throw new Error(`Missing VAPI assistant ID for type: ${type}`);
        
        try {
            const assistantOverrides: VapiAssistantOverrides = {
                variableValues: prepareVariableValues(),
                serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`,
                artifactPlan: {
                    recordingEnabled: true,
                    recordingFormat: 'mp3',
                }
            };
            console.log("Starting VAPI call with overrides:", JSON.stringify(assistantOverrides, null, 2));
            await vapi.start(assistantId, assistantOverrides);
            return true;
        } catch (error) {
            console.error("Failed to start Vapi call:", error);
            throw error;
        }
    };
    
    const handleStartCall = async () => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            setCallStatus(CallStatus.CONNECTING);
            try {
                await startVapiCall();
            } catch (error) {
                setCallStatus(CallStatus.INACTIVE);
                setErrorMessage(`Failed to start call: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    
    const handleEndCall = async () => {
        if (callStatus === CallStatus.ACTIVE) {
            await vapi.stop();
        }
    };
    


    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer hover-card'>
                    <div className={`avatar ${isSpeaking ? 'speaking' : ''}`}>
                        <Image 
                            src='/ai-avatar.png' 
                            alt='AI Interviewer' 
                            width={90} 
                            height={75} 
                            className='object-cover' 
                        />
                        <span className='animate-speak'/>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/ai-avatar.png' alt='AI Interviewer' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI Interviewer</h3>
                    {type === 'interview' && company && (
                        <p className='text-base text-gray-300 font-medium'>{company}</p>
                    )}
                    {/* Debug indicator */}
                    {isSpeaking && <p className="text-xs text-green-400">Speaking</p>}
                    {type === 'interview' && company && <p className='text-sm text-gray-600'>{company}</p>}
                </div>
                <div className='card-border hover-card'>
                    <div className='card-content'>
                        <div className={`avatar ${userIsSpeaking ? 'speaking' : ''}`}>
                            <Image 
                                src='/user-avatar.png' 
                                alt='user' 
                                width={540} 
                                height={540} 
                                className='rounded-full object-cover size-[160px]' 
                            />
                            <span className='animate-speak'/>
                        </div>
                        <Image src='/user-avatar.png' alt='user' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>Candidate</h3>
                        {type === 'interview' && interviewRole && (
                            <p className='text-base text-gray-300 font-medium'>
                                {interviewLevel} {interviewRole}
                            </p>
                        )}
                        {/* Debug indicator */}
                        {userIsSpeaking && <p className="text-xs text-green-400">Speaking</p>}
                        {type === 'interview' && interviewRole && <p className='text-sm text-gray-600'>{interviewLevel} {interviewRole}</p>}
                    </div>
                </div>
            </div>

            {callStatus === CallStatus.ACTIVE && (
                <div className='my-4 text-center'>
                    <p className='text-lg font-semibold text-gray-700'>{formatTimer(recordingDuration)}</p>
                </div>
            )}

            {questions && questions.length > 0 && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                    <h4 className='text-lg font-medium mb-2'>Interview Questions:</h4>
                    <ol className='list-decimal ml-5 space-y-1'>
                        {questions.map((question, index) => (
                            <li key={index} className='text-sm text-blue-100 pb-2 border-b border-blue-700/30 last:border-0'>{question}</li>
                        ))}
                    </ol>
                </div>
            )}
            
            <div className='transcript-border'>
                <div className='transcript min-h-16 text-base'>
                    <p className={cn('transition-opacity duration-500', messages.length > 0 ? 'animate-fadeIn opacity-100' : 'text-gray-500')}>
                        {messages.length > 0 ? lastMessage : 'Interview transcript will appear here...'}
                    </p>
                </div>
            </div>

            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p className={cn('transition-opacity duration-500', 'animate-fadeIn opacity-100')}>{lastMessage}</p>
                    </div>
                </div>
            )}
            
            <div className='w-full flex justify-center mt-6'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button 
                        className='relative btn-call text-lg px-8 py-4'
                        onClick={handleStartCall}
                        disabled={callStatus === CallStatus.CONNECTING}
                    >
                        <span className={cn(
                            'absolute animate-ping rounded-full opacity-75', 
                            callStatus !== CallStatus.CONNECTING && 'hidden'
                        )} />
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED 
                                ? 'Start Interview' 
                                : 'Connecting...'}
                        </span>
                    </button>
                ) : (
                    <button 
                        className='btn-disconnect text-lg px-8 py-4'
                        onClick={handleEndCall}
                    >
                        END INTERVIEW
                    </button>
                )}
            </div>

            {errorMessage && <div className="mt-4 p-2 text-center text-red-700 bg-red-100 rounded-md"><p>{errorMessage}</p></div>}
            {isProcessing && <div className="mt-4 text-center text-blue-700"><p>Processing and saving your interview...</p></div>}
        </>
    );
};

export default Agent;