"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
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
    const [userIsSpeaking, setUserIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const cleanupRecordingRef = useRef<(() => void) | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneStreamRef = useRef<MediaStream | null>(null);
    const userSpeakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // Setup microphone activity monitoring to detect when user is speaking
    const setupMicrophoneMonitoring = useCallback(async () => {
        try {
            // Clean up any existing audio processing
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                await audioContextRef.current.close();
            }
            if (userSpeakingTimeoutRef.current) {
                clearTimeout(userSpeakingTimeoutRef.current);
            }
            
            // Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            microphoneStreamRef.current = stream;
            
            // Set up audio analysis
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            // Function to check audio levels
            const checkAudioLevel = () => {
                if (!analyserRef.current || callStatus !== CallStatus.ACTIVE) return;
                
                analyserRef.current.getByteFrequencyData(dataArray);
                
                // Calculate average volume
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                
                // Threshold for speaking detection (adjust as needed)
                const threshold = 10; // Lower threshold to make it more sensitive
                
                if (average > threshold) {
                    // User is speaking - debug log to confirm detection
                    console.log("User speaking detected, audio level:", average);
                    setUserIsSpeaking(true);
                    
                    // Clear any existing timeout
                    if (userSpeakingTimeoutRef.current) {
                        clearTimeout(userSpeakingTimeoutRef.current);
                    }
                    
                    // Set a timeout to consider them done speaking if no audio is detected
                    userSpeakingTimeoutRef.current = setTimeout(() => {
                        setUserIsSpeaking(false);
                        console.log("User speaking timeout - stopped speaking");
                    }, 500);
                }
                
                // Continue monitoring
                requestAnimationFrame(checkAudioLevel);
            };
            
            // Start monitoring
            console.log("Microphone monitoring started");
            requestAnimationFrame(checkAudioLevel); // Ensure we call this on animation frame
            
            return () => {
                // Cleanup function
                console.log("Cleaning up microphone monitoring");
                if (microphoneStreamRef.current) {
                    microphoneStreamRef.current.getTracks().forEach(track => track.stop());
                }
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }
                if (userSpeakingTimeoutRef.current) {
                    clearTimeout(userSpeakingTimeoutRef.current);
                }
            };
        } catch (error) {
            console.error("Error setting up microphone monitoring:", error);
            return () => {};
        }
    }, [callStatus, setUserIsSpeaking]);
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
        // Function to save completed interview
        const saveCompletedInterview = async () => {
            // Only save custom or regular interviews, not question generation
            if (type !== 'custom' && type !== 'interview') return;
            
            try {
                // Debug info before saving
                console.log(`Saving interview with company: "${company}"`);
                if (company?.toLowerCase() === 'meta') {
                    console.log('Meta company detected - should use Facebook logo');
                }
                
                // Prepare payload with care for Meta company name
                const payload = {
                    interviewId,
                    role: jobTitle || interviewRole || 'Interview',
                    type: type === 'custom' ? 'Custom' : 'Preset',
                    company: company || 'Not specified',
                    techstack: [], // Could be extracted from conversation in future
                    level: interviewLevel || 'Not specified',
                };
                
                console.log('Save interview payload:', payload);
                
                // Make the API call
                const response = await fetch('/api/save-completed-interview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                
                const data = await response.json();
                if (data.success) {
                    console.log('Interview saved successfully:', data.interview);
                } else {
                    console.error('Failed to save interview:', data.error);
                }
            } catch (error) {
                console.error('Error saving completed interview:', error);
            }
        };
        
        const handleCallStart = async () => {
            console.log("🟢 Call started!");
            setCallStatus(CallStatus.ACTIVE);
            
            // Reset speaking states at start
            setIsSpeaking(false);
            setUserIsSpeaking(false);
            
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
            
            // Start monitoring user's microphone for speech detection
            console.log("Starting microphone monitoring...");
            try {
                const micCleanup = await setupMicrophoneMonitoring();
                const existingCleanup = cleanupRecordingRef.current;
                if (existingCleanup) {
                    cleanupRecordingRef.current = () => {
                        existingCleanup();
                        micCleanup();
                    };
                } else {
                    cleanupRecordingRef.current = micCleanup;
                }
                console.log("Microphone monitoring setup complete");
            } catch (err) {
                console.error("Error setting up microphone monitoring:", err);
            }
        };
        
        const handleCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            
            // Reset speaking states
            setIsSpeaking(false);
            setUserIsSpeaking(false);
            
            // Stop encrypted recording and microphone monitoring
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
                console.log("Encrypted recording and monitoring stopped");
            }
            
            // Explicitly stop any microphone tracks
            if (microphoneStreamRef.current) {
                microphoneStreamRef.current.getTracks().forEach(track => track.stop());
                microphoneStreamRef.current = null;
            }
            
            // Clear any pending timeout
            if (userSpeakingTimeoutRef.current) {
                clearTimeout(userSpeakingTimeoutRef.current);
                userSpeakingTimeoutRef.current = null;
            }
            
            // Save completed interview information
            if ((type === 'interview' || type === 'custom') && interviewId) {
                saveCompletedInterview();
                
                // Redirect to analysis after a delay
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

        const handleSpeechStart = () => {
            console.log("AI speech started");
            setIsSpeaking(true);
        };
        
        const handleSpeechEnd = () => {
            console.log("AI speech ended");
            setIsSpeaking(false);
        };
        
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
    }, [interviewId, userId, type, router, company, interviewLevel, interviewRole, jobTitle, messages.length, questions?.length, setupMicrophoneMonitoring]);
    
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
                    </div>
                    <h3>AI Interviewer</h3>
                    {type === 'interview' && company && (
                        <p className='text-base text-gray-300 font-medium'>{company}</p>
                    )}
                    {/* Debug indicator */}
                    {isSpeaking && <p className="text-xs text-green-400">Speaking</p>}
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
                        <h3>Candidate</h3>
                        {type === 'interview' && interviewRole && (
                            <p className='text-base text-gray-300 font-medium'>
                                {interviewLevel} {interviewRole}
                            </p>
                        )}
                        {/* Debug indicator */}
                        {userIsSpeaking && <p className="text-xs text-green-400">Speaking</p>}
                    </div>
                </div>
            </div>
            
            {/* Display preset questions if available */}
            {hasPresetQuestions && (
                <div className='mt-16 mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-600/30 shadow-inner'>
                    <h4 className='text-lg font-medium mb-3 text-blue-200'>Interview Questions:</h4>
                    <ol className='list-decimal ml-5 space-y-4'>
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
        </>
    );
};

export default Agent;