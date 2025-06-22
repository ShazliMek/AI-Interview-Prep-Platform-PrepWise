"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import vapiEncryptionService from "@/lib/services/vapiEncryptionService";
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
    type: "generate" | "interview" | "custom"; // Add custom type
    questions?: string[];
    interviewRole?: string;
    interviewLevel?: string;
    company?: string;
    jobTitle?: string; // <-- add this
}

const Agent = ({
    userId, 
    interviewId: propInterviewId, 
    type, 
    questions,
    interviewRole,
    interviewLevel,
    company,
    jobTitle // <-- add this
}: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const cleanupRecordingRef = useRef<(() => void) | null>(null);
    const [lastMessage, setLastMessage] = useState<string>('');
    // Always have an interviewId for recording/analysis
    const [interviewId] = useState<string>(
        propInterviewId || (type === 'custom' ? `custom-${uuidv4()}` : '')
    );

    // Debug props for inspection
    useEffect(() => {
        console.log("Agent component initialized with props:", { 
            userId, 
            interviewId, 
            type, 
            questions: questions?.length ? `${questions.length} questions` : 'none',
            interviewRole,
            interviewLevel,
            company
        });
        
        // Check if critical values are missing
        if (type === 'interview') {
            if (!interviewRole) console.warn("⚠️ Missing interviewRole prop - variables may not work in assistant");
            if (!interviewLevel) console.warn("⚠️ Missing interviewLevel prop - variables may not work in assistant");
            if (!company) console.warn("⚠️ Missing company prop - variables may not work in assistant");
        }
    }, [userId, interviewId, type, questions, interviewRole, interviewLevel, company]);

    useEffect(() => {
        const handleCallStart = async () => {
            console.log("🟢 Call started!");
            setCallStatus(CallStatus.ACTIVE);
            
            // Start encrypted recording if we have an interview ID
            if (interviewId && userId) {
                try {
                    const cleanup = await vapiEncryptionService.startEncryptedRecording(interviewId);
                    cleanupRecordingRef.current = cleanup;
                    console.log("Encrypted recording started for interview:", interviewId);
                } catch (error) {
                    console.error("Failed to start encrypted recording:", error);
                }
            }
        };
        
        const handleCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            
            // Stop encrypted recording
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
                console.log("Encrypted recording stopped");
            }
            
            // If this is an interview or custom, redirect to analysis after a delay
            if ((type === 'interview' || type === 'custom') && interviewId) {
                setTimeout(() => {
                    router.push(`/interview-analysis?id=${interviewId}`);
                }, 2000);
            }
        };
        
        const handleMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                if (message.role && message.transcript) {
                    const newMessage = {
                        role: message.role,
                        content: message.transcript
                    };
                    
                    // Check if first assistant message contains any of our variables
                    // This helps us debug if variables are being used
                    if (message.role === 'assistant' && messages.length === 0) {
                        console.log("First assistant message:", message.transcript);
                        
                        // Check which variables are being used in the response
                        const variableUsage = checkVariableUsage(message.transcript, {
                            interviewRole,
                            role: interviewRole,
                            jobTitle: interviewRole,
                            company,
                            interviewLevel,
                            level: interviewLevel,
                            experience: interviewLevel
                        });
                        
                        console.log("Variable usage check:", variableUsage);
                        
                        // Log the results for server-side analysis
                        logVapiDebug('assistant-response-check', {
                            firstMessage: message.transcript,
                            variableUsage,
                            originalVariables: {
                                interviewRole,
                                company,
                                interviewLevel,
                                questions: questions?.length || 0
                            }
                        });
                        
                        // Create user-friendly list of detected variables
                        const variableCheck = [];
                        
                        if (interviewRole && message.transcript.includes(interviewRole)) 
                            variableCheck.push("✅ Contains interviewRole");
                        else if (interviewRole)
                            variableCheck.push("❌ Missing interviewRole");
                            
                        if (company && message.transcript.includes(company)) 
                            variableCheck.push("✅ Contains company");
                        else if (company)
                            variableCheck.push("❌ Missing company");
                            
                        if (interviewLevel && message.transcript.includes(interviewLevel)) 
                            variableCheck.push("✅ Contains interviewLevel");
                        else if (interviewLevel)
                            variableCheck.push("❌ Missing interviewLevel");
                            
                        console.log("Variable usage summary:", variableCheck);
                    }
                    
                    setMessages((prev) => [...prev, newMessage]);
                    setLastMessage(message.transcript);
                }
            }
        };

        const handleSpeechStart = () => setIsSpeaking(true);
        const handleSpeechEnd = () => setIsSpeaking(false);
        const handleError = (error: unknown) => {
            console.error("Vapi error:", error);
            if (error instanceof Error) {
                console.error("Vapi error details:", {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
        };

        // Add event listeners
        vapi.on('call-start', handleCallStart);
        vapi.on('call-end', handleCallEnd);
        vapi.on('message', handleMessage);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('error', handleError);

        // Cleanup function
        return () => {
            // Remove event listeners
            vapi.off('call-start', handleCallStart);
            vapi.off('call-end', handleCallEnd);
            vapi.off('message', handleMessage);
            vapi.off('speech-start', handleSpeechStart);
            vapi.off('speech-end', handleSpeechEnd);
            vapi.off('error', handleError);
            
            // Stop recording if active
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
            }
        };
    }, [interviewId, userId, type, router, company, interviewLevel, interviewRole, messages.length, questions?.length]);
    
    // Helper function to prepare variable values for VAPI
    const prepareVariableValues = () => {
        const variables: Record<string, string | number> = {};

        // Add interview-specific variables
        if (type === 'interview') {
            // Match variable names with what's expected in the VAPI assistant
            if (interviewRole) {
                variables.interviewRole = interviewRole;
                variables.role = interviewRole;           // Common variable name
                variables.jobTitle = interviewRole;       // Alternate variable name
                variables.position = interviewRole;       // Another possible name
            }
            if (interviewLevel) {
                variables.interviewLevel = interviewLevel;
                variables.level = interviewLevel;         // Common variable name
                variables.experience = interviewLevel;    // Alternate variable name
                variables.seniority = interviewLevel;     // Another possible name
            }
            if (company) {
                variables.company = company;
                variables.companyName = company;          // Alternate variable name
            }
            
            // Format questions for the template with multiple format options
            if (questions && questions.length > 0) {
                variables.questionsText = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
                variables.questions = questions.join('\n');   // Simple joined string
                variables.totalQuestions = questions.length;
                variables.interviewContext = `This is a ${interviewLevel || 'professional'} ${interviewRole || 'technical'} interview${company ? ` for ${company}` : ''}.`;
            }
        } else if (type === 'custom') {
            if (jobTitle) {
                variables.jobTitle = jobTitle;
                variables.role = jobTitle;
            }
        }

        // Add user info
        if (userId) variables.userId = userId;
        
        // Add additional interview metadata
        if (interviewId) variables.interviewId = interviewId;
        variables.sessionType = type;

        console.log("Prepared variable values:", variables);
        return variables;
    };
    
    // Helper function to start a Vapi call with proper configuration
    const startVapiCall = async (): Promise<boolean> => {
        const assistantId = type === 'interview' 
            ? process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID 
            : type === 'custom'
                ? process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID_CUSTOM
                : process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
        
        if (!assistantId) {
            throw new Error(`Missing VAPI assistant ID for type: ${type}`);
        }
        
        try {
            const variableValues = prepareVariableValues();
            console.log("Starting call with assistant ID:", assistantId);
            console.log("Variable values:", JSON.stringify(variableValues, null, 2));
            
            // Log prepared variables for debugging
            await logVapiDebug('variable-preparation', {
                assistantId,
                variableValues,
                props: {
                    userId,
                    interviewId,
                    type,
                    questionsCount: questions?.length || 0,
                    interviewRole,
                    interviewLevel,
                    company
                }
            });
            
            // According to VAPI docs, we can pass assistantOverrides as the second parameter
            // to the start() method to override assistant settings and set template variables
            const assistantOverrides = {
                variableValues,
                // Try to add first message with manually injected variables as fallback
                firstMessage: type === 'interview' && interviewRole && company ? 
                    `Hello! I'll be conducting your ${interviewLevel || 'professional'} ${interviewRole} interview for ${company}. Let's get started.` : undefined
            };

            console.log("Starting VAPI call with overrides:", JSON.stringify(assistantOverrides, null, 2));
            
            // Start the call with assistant ID and overrides
            await vapi.start(assistantId, assistantOverrides);
            
            // For interview mode, prepare UI state
            if (type === 'interview' && questions && questions.length > 0) {
                setMessages([
                    {
                        role: 'system',
                        content: `Interview initialized with ${questions.length} preset questions.`
                    }
                ]);
                
                setLastMessage(`Interview ready. The AI will conduct a structured interview using the preset questions.`);
            }
            
            console.log("Vapi call started successfully");
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
                // Call will transition to ACTIVE via the handleCallStart callback when it connects
            } catch (error) {
                console.error("Failed to start call:", error);
                setCallStatus(CallStatus.INACTIVE);
                
                // Show user-friendly error message
                setLastMessage(`Failed to start call: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };
    
    const handleEndCall = async () => {
        if (callStatus === CallStatus.ACTIVE) {
            try {
                // End Vapi call
                await vapi.stop();
                
                // setCallStatus will be updated by the onCallEnd event handler
                // This ensures our state reflects the actual call state from Vapi
                
                // Stop recording explicitly (also handled by call-end event, this is a safety measure)
                if (cleanupRecordingRef.current) {
                    cleanupRecordingRef.current();
                    cleanupRecordingRef.current = null;
                }
            } catch (error) {
                console.error("Failed to end call:", error);
                // Force status update even if the call end fails
                setCallStatus(CallStatus.FINISHED);
            }
        }
    };
    
    // Check if we have preset questions to display
    const hasPresetQuestions = questions && questions.length > 0;

    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image 
                            src='/ai-avatar.png' 
                            alt='AI Interviewer' 
                            width={65} 
                            height={54} 
                            className='object-cover' 
                        />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI Interviewer</h3>
                    {type === 'interview' && company && (
                        <p className='text-sm text-gray-600'>{company}</p>
                    )}
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image 
                            src='/user-avatar.png' 
                            alt='user' 
                            width={540} 
                            height={540} 
                            className='rounded-full object-cover size-[120px]' 
                        />
                        <h3>Candidate</h3>
                        {type === 'interview' && interviewRole && (
                            <p className='text-sm text-gray-600'>
                                {interviewLevel} {interviewRole}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Display preset questions if available */}
            {hasPresetQuestions && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                    <h4 className='text-lg font-medium mb-2'>Interview Questions:</h4>
                    <p className='text-xs text-gray-500 mb-2'>
                        The AI interviewer will use these questions as a guide for the interview.
                    </p>
                    <ol className='list-decimal ml-5 space-y-1'>
                        {questions.map((question, index) => (
                            <li key={index} className='text-sm text-gray-700'>{question}</li>
                        ))}
                    </ol>
                    <p className='mt-3 text-xs text-blue-600 italic'>
                        This interview uses a structured conversation flow for a realistic experience.
                    </p>
                </div>
            )}
            
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p className={cn('transition-opacity duration-500', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )}
            
            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button 
                        className='relative btn-call'
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
                        className='btn-disconnect'
                        onClick={handleEndCall}
                    >
                        END INTERVIEW
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;