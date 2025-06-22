"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import vapiEncryptionService from "@/lib/services/vapiEncryptionService";

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
    userName: string;
    userId?: string;
    interviewId?: string;
    type: "generate" | "interview";
    questions?: string[];
}

const Agent = ({userName, userId, interviewId, type, questions}: AgentProps) => {
    const router = useRouter();
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const cleanupRecordingRef = useRef<(() => void) | null>(null);
    const [lastMessage, setLastMessage] = useState<string>('');
    

    // Visual timer for recording duration
    const [recordingDuration, setRecordingDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const lastKnownDurationRef = useRef<number>(0); // Backup duration tracking
    
    // Error handling state
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Timer utility functions
    const formatTimer = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        const now = Date.now();
        startTimeRef.current = now;
        lastKnownDurationRef.current = 0; // Reset backup duration
        console.log(`[Timer] Starting timer at: ${now} (${new Date(now).toISOString()})`);
        
        timerRef.current = setInterval(() => {
            if (startTimeRef.current) {
                const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setRecordingDuration(elapsed);
                lastKnownDurationRef.current = elapsed; // Keep backup
                // Only log every 10 seconds to avoid spam
                if (elapsed % 10 === 0) {
                    console.log(`[Timer] Recording duration: ${elapsed}s`);
                }
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        
        // Calculate final duration based on start time
        let finalDuration = 0;
        if (startTimeRef.current) {
            finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            console.log(`[Timer] Calculated final duration from timestamps: ${finalDuration}s`);
        } else {
            console.log(`[Timer] Warning: No start time recorded`);
        }
        
        // Use backup duration if calculation seems wrong
        const backupDuration = lastKnownDurationRef.current;
        const stateDuration = recordingDuration;
        
        console.log(`[Timer] Duration comparison - Calculated: ${finalDuration}s, Backup: ${backupDuration}s, State: ${stateDuration}s`);
        
        // Choose the best duration value (prefer calculated, fallback to backup, then state)
        if (finalDuration > 0) {
            console.log(`[Timer] Using calculated duration: ${finalDuration}s`);
        } else if (backupDuration > 0) {
            finalDuration = backupDuration;
            console.log(`[Timer] Using backup duration: ${finalDuration}s`);
        } else if (stateDuration > 0) {
            finalDuration = stateDuration;
            console.log(`[Timer] Using state duration: ${finalDuration}s`);
        } else {
            console.error(`[Timer] ❌ All duration values are 0! This indicates a timer malfunction.`);
        }
        
        // Reset references
        startTimeRef.current = null;
        lastKnownDurationRef.current = 0;
        
        return finalDuration;
    };

    // Save recording duration to MongoDB
    const saveRecordingDuration = async (duration: number) => {
        if (!interviewId || !userId) return;
        
        try {
            // Ensure duration is an integer
            const integerDuration = Math.floor(duration);
            console.log(`[Recording Timer] Saving duration: ${integerDuration}s (integer) for interview: ${interviewId}`);
            
            const response = await fetch('/api/user/recordings-mongodb/update-duration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId,
                    userId,
                    duration: integerDuration // Send as integer
                })
            });
            
            if (response.ok) {
                console.log(`[Recording Timer] ✅ Duration saved successfully: ${integerDuration}s`);
            } else {
                console.error(`[Recording Timer] ❌ Failed to save duration:`, await response.text());
            }
        } catch (error) {
            console.error(`[Recording Timer] ❌ Error saving duration:`, error);
        }
    };

    // Verify recording duration was saved correctly
    const verifyRecordingDuration = async (expectedDuration: number): Promise<boolean> => {
        if (!interviewId) return false;
        
        try {
            console.log(`[Duration Verification] 🔍 Verifying rec_length was saved correctly...`);
            console.log(`[Duration Verification] Looking for interview: ${interviewId}`);
            console.log(`[Duration Verification] Expected duration: ${expectedDuration}s`);
            
            const response = await fetch('/api/user/recordings-mongodb');
            if (!response.ok) {
                console.error(`[Duration Verification] ❌ Failed to fetch recordings for verification`);
                return false;
            }
            
            const data = await response.json();
            if (!data.success) {
                console.error(`[Duration Verification] ❌ API returned error:`, data.message);
                return false;
            }
            
            // Log all recordings for debugging
            console.log(`[Duration Verification] 📋 All user recordings:`, data.recordings.map((r: any) => ({
                id: r.id,
                interviewId: r.interviewId,
                rec_length: r.rec_length,
                createdAt: r.createdAt
            })));
            
            // Find our recording by interviewId
            const recording = data.recordings.find((r: any) => r.interviewId === interviewId);
            
            if (!recording) {
                console.error(`[Duration Verification] ❌ Recording not found for interview: ${interviewId}`);
                console.error(`[Duration Verification] Available interview IDs:`, data.recordings.map((r: any) => r.interviewId));
                return false;
            }
            
            const savedDuration = recording.rec_length || 0;
            console.log(`[Duration Verification] 📊 Found recording for interview: ${interviewId}`);
            console.log(`[Duration Verification] 📊 Saved rec_length: ${savedDuration}s`);
            console.log(`[Duration Verification] 📊 Recording created at: ${recording.createdAt}`);
            
            if (savedDuration === expectedDuration) {
                console.log(`[Duration Verification] ✅ Verification SUCCESS! rec_length matches expected duration (${expectedDuration}s)`);
                return true;
            } else {
                console.error(`[Duration Verification] ❌ Verification FAILED! Expected: ${expectedDuration}s, Saved: ${savedDuration}s`);
                return false;
            }
            
        } catch (error) {
            console.error(`[Duration Verification] ❌ Error during verification:`, error);
            return false;
        }
    };

    useEffect(() => {
        const handleCallStart = async () => {
            console.log(`[Call Flow] ✅ Call started event received at: ${Date.now()} (${new Date().toISOString()})`);

            setCallStatus(CallStatus.ACTIVE);
            
            // Start the visual timer
            console.log(`[Recording Timer] Starting timer for interview: ${interviewId}`);
            startTimer();
            
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
            
            // Check if we have preset questions
            if (questions && questions.length > 0) {
                console.log("Using preset interview questions:", questions);
                
                // Format questions for display in the transcript
                const questionsFormatted = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
                
                // Add multiple messages to ensure the AI understands the questions
                setMessages([
                    {
                        role: 'system',
                        content: `IMPORTANT: This is a preset interview with the following questions. Please incorporate these questions during the interview:\n\n${questionsFormatted}`
                    },
                    {
                        role: 'assistant',
                        content: 'I understand. I will conduct this interview using the preset questions provided. Let me begin by introducing myself.'
                    }
                ]);
                
                // Show an initial message to the user
                setLastMessage(`The interview will use the preset questions shown below. The AI interviewer will incorporate them during your conversation.`);
            }
        };
        
        const handleCallEnd = async () => {
            console.log(`[Call Flow] ❌ Call ended event received at: ${Date.now()} (${new Date().toISOString()})`);
            setCallStatus(CallStatus.FINISHED);
            setErrorMessage(''); // Clear any previous errors
            
            // Stop the timer and get final duration
            console.log(`[Timer] Call ended, stopping timer...`);
            console.log(`[Timer] Current recordingDuration state: ${recordingDuration}s`);
            console.log(`[Timer] Start time ref: ${startTimeRef.current}`);
            console.log(`[Timer] Last known duration ref: ${lastKnownDurationRef.current}s`);
            
            const finalDuration = stopTimer();
            const integerDuration = Math.floor(finalDuration);
            console.log(`[Recording Timer] ⏱️ Final calculated duration: ${finalDuration}s (will save as ${integerDuration}s)`);
            
            // Warn if duration seems suspiciously short
            if (finalDuration < 5) {
                console.warn(`[Recording Timer] ⚠️ Warning: Very short call duration (${finalDuration}s). This might indicate a connection issue or immediate call termination.`);
            }
            // Stop encrypted recording
            if (cleanupRecordingRef.current) {
                cleanupRecordingRef.current();
                cleanupRecordingRef.current = null;
                console.log("Encrypted recording stopped");
            }
            
            // If this is an interview, save duration and verify before redirecting
            if (type === 'interview' && interviewId) {
                setIsProcessing(true);
                try {
                    // Step 1: Save the recording duration to MongoDB
                    console.log(`[Recording Timer] 💾 Saving duration: ${integerDuration}s to MongoDB...`);
                    await saveRecordingDuration(finalDuration);
                    
                    // Step 2: Wait a moment for the database to update
                    console.log(`[Recording Timer] ⏳ Waiting for database update...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Step 3: Verify the duration was saved correctly
                    console.log(`[Recording Timer] 🔍 Verifying rec_length was saved correctly...`);
                    const verificationSuccess = await verifyRecordingDuration(integerDuration);
                    
                    if (verificationSuccess) {
                        // Step 4: Only redirect if verification succeeds
                        console.log(`[Recording Timer] ✅ Verification successful! Redirecting to my-interviews...`);
                        setIsProcessing(false);
                        setTimeout(() => {
                            router.push('/my-interviews');
                        }, 1000);
                    } else {
                        // Step 5: Handle verification failure
                        console.error(`[Recording Timer] ❌ Verification failed! rec_length may not have been saved correctly.`);
                        console.error(`[Recording Timer] 🚨 Manual intervention may be required for interview: ${interviewId}`);
                        
                        setErrorMessage('Warning: Recording duration may not have been saved correctly. Redirecting anyway...');
                        setIsProcessing(false);
                        
                        // Still redirect but with a warning
                        setTimeout(() => {
                            console.log(`[Recording Timer] ⚠️ Redirecting despite verification failure...`);
                            router.push('/my-interviews');
                        }, 3000);
                    }
                } catch (error) {
                    console.error(`[Recording Timer] ❌ Error during end call process:`, error);
                    
                    setErrorMessage('Error processing interview data. Redirecting...');
                    setIsProcessing(false);
                    
                    // Fallback: redirect anyway after longer delay
                    setTimeout(() => {
                        console.log(`[Recording Timer] 🔄 Fallback redirect after error...`);
                        router.push('/my-interviews');
                    }, 4000);
                }
            }
        };
        
        const handleMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                if (message.role && message.transcript) {
                    const newMessage = {
                        role: message.role,
                        content: message.transcript
                    };
                    
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
                console.error("Vapi error name:", error.name);
                console.error("Vapi error message:", error.message);
                console.error("Vapi error stack:", error.stack);
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
    }, [interviewId, userId, type, router, questions]);
    
    // Helper function to start a Vapi call with either workflow or assistant
    const startVapiCall = async (callType: 'workflow' | 'assistant'): Promise<boolean> => {
        const interviewWorkflow = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        const interviewAssistant = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
        
        try {
            if (callType === 'workflow' && interviewWorkflow) {
                console.log("Starting Vapi workflow with ID:", interviewWorkflow);
                
                // The most compatible approach is to just use the ID
                // We'll rely on the UI to display the questions to both user and AI
                await vapi.start(interviewWorkflow);
                console.log("Vapi workflow call started successfully");
                return true;
            } else if (interviewAssistant) {
                console.log("Starting call with Vapi assistant:", interviewAssistant);
                await vapi.start(interviewAssistant);
                console.log("Vapi assistant call started successfully");
                return true;
            } else {
                console.error("Missing Vapi configuration for", callType);
                return false;
            }
        } catch (error) {
            console.error(`Failed to start Vapi ${callType}:`, error);
            return false;
        }
    };
    
    const handleStartCall = async () => {
        if (callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED) {
            setCallStatus(CallStatus.CONNECTING);
            
            try {
                // Start Vapi call with proper configuration based on interview type
                if (type === 'interview' && interviewId) {
                    // Check if we should use workflow or assistant
                    const started = await startVapiCall('workflow');
                    
                    if (!started) {
                        // Fallback to assistant if workflow start fails
                        await startVapiCall('assistant');
                    }
                    
                    // Start encrypted recording for interview mode
                    if (userId) {
                        try {
                            const cleanup = await vapiEncryptionService.startEncryptedRecording(interviewId);
                            cleanupRecordingRef.current = cleanup;
                            console.log("Encrypted recording started for interview:", interviewId);
                        } catch (error) {
                            console.error("Failed to start encrypted recording:", error);
                            // Continue with the call even if encryption fails
                        }
                    }
                } else if (type === 'generate') {
                    // For interview generation mode - simpler assistant
                    const generateAssistant = process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
                    
                    if (!generateAssistant) {
                        throw new Error("Missing Vapi generate assistant ID in environment variables");
                    }
                    
                    await vapi.start(generateAssistant);
                } else {
                    throw new Error("Invalid interview configuration");
                }
                
                // Call will transition to ACTIVE via the handleCallStart callback when it connects
            } catch (error) {
                console.error("Failed to start call:", error);
                setCallStatus(CallStatus.INACTIVE);
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
                        <Image src='/ai-avatar.png' alt='vapi' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user-avatar.png' alt='user' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            
            {/* Display preset questions if available */}
            {hasPresetQuestions && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                    <h4 className='text-lg font-medium mb-2'>Interview Questions:</h4>
                    <p className='text-xs text-gray-500 mb-2'>The AI interviewer will see these questions and may incorporate them into the interview.</p>
                    <ol className='list-decimal ml-5 space-y-1'>
                        {questions.map((question, index) => (
                            <li key={index} className='text-sm text-gray-700'>{question}</li>
                        ))}
                    </ol>
                    <p className='mt-3 text-xs text-blue-600 italic'>
                        This interview uses a structured conversation flow for a more realistic experience.
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
            
            {/* Recording Timer Display */}
            {type === 'interview' && callStatus === CallStatus.ACTIVE && (
                <div className='w-full flex justify-center mb-4'>
                    <div className='bg-red-100 border border-red-300 rounded-lg px-4 py-2 flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
                        <span className='text-red-700 font-mono text-lg font-semibold'>
                            REC {formatTimer(recordingDuration)}
                        </span>
                    </div>
                </div>
            )}
            
            {/* Processing State Display */}
            {type === 'interview' && isProcessing && (
                <div className='w-full flex justify-center mb-4'>
                    <div className='bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
                        <span className='text-blue-700 font-semibold'>
                            Processing interview data...
                        </span>
                    </div>
                </div>
            )}
            
            {/* Error Message Display */}
            {errorMessage && (
                <div className='w-full flex justify-center mb-4'>
                    <div className='bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <span className='text-yellow-700 font-semibold'>
                            {errorMessage}
                        </span>
                    </div>
                </div>
            )}
            
            <div className='w-full flex justify-center'>
                {callStatus !== CallStatus.ACTIVE ? (
                    <button 
                        className='relative btn-call'
                        onClick={handleStartCall}
                    >
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== CallStatus.CONNECTING && 'hidden')} />
                        <span>
                            {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? 'Call' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button 
                        className='btn-disconnect'
                        onClick={handleEndCall}
                    >
                        END
                    </button>
                )}
            </div>
        </>
    );
};

export default Agent;