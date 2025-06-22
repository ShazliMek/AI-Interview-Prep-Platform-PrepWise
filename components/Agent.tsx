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
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [lastMessage, setLastMessage] = useState<string>('');
    const [interviewId] = useState<string>(
        propInterviewId || (type === 'custom' ? `custom-${uuidv4()}` : '')
    );

    // --- Merged State from both branches ---
    const cleanupRecordingRef = useRef<(() => Promise<Blob | null>) | null>(null);
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

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (startTimeRef.current) {
            const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
            startTimeRef.current = null;
            return finalDuration;
        }
        return recordingDuration; // Fallback
    };

    // Data saving utilities
    const saveRecordingDuration = async (duration: number) => {
        if (!interviewId || !userId) return;
        try {
            const response = await fetch('/api/user/recordings-mongodb/update-duration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interviewId, userId, duration })
            });
            if (response.ok) console.log(`[DB] Duration saved: ${duration}s`);
            else console.error(`[DB] Failed to save duration`);
        } catch (error) {
            console.error(`[DB] Error saving duration:`, error);
        }
    };

    const saveCompletedInterview = async () => {
        if (type !== 'custom' && type !== 'interview') return;
        try {
            const response = await fetch('/api/save-completed-interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId,
                    role: jobTitle || interviewRole || 'Interview',
                    type: type === 'custom' ? 'Custom' : 'Preset',
                    company: company || 'Not specified',
                    techstack: [],
                    level: interviewLevel || 'Not specified',
                }),
            });
            const data = await response.json();
            if (data.success) console.log('[DB] Interview metadata saved.');
            else console.error('[DB] Failed to save interview metadata:', data.error);
        } catch (error) {
            console.error('[DB] Error saving interview metadata:', error);
        }
    };

    // --- Main useEffect hook with merged logic ---
    useEffect(() => {
        const handleCallStart = async () => {
            console.log("🟢 Call started!");
            setCallStatus(CallStatus.ACTIVE);
            startTimer();
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

        const handleCallEnd = async () => {
            console.log(`[Call Flow] ❌ Call ended.`);
            setCallStatus(CallStatus.FINISHED);
            setIsProcessing(true);
            setErrorMessage('');

            const finalDuration = stopTimer();
            console.log(`[Recording] Final duration: ${finalDuration}s`);

            try {
                let audioBlob: Blob | null = null;
                if (cleanupRecordingRef.current) {
                    console.log("[Recording] Stopping and retrieving audio blob...");
                    audioBlob = await cleanupRecordingRef.current();
                    cleanupRecordingRef.current = null;
                }

                if (audioBlob && (type === 'interview' || type === 'custom') && interviewId) {
                    console.log(`[Recording] Retrieved audio blob: ${audioBlob.size} bytes`);
                    const formData = new FormData();
                    formData.append('audio', audioBlob);
                    formData.append('interviewId', interviewId);
                    formData.append('metadata', JSON.stringify({ duration: finalDuration, fileSize: audioBlob.size, mimeType: 'audio/webm' }));
                    
                    const response = await fetch('/api/user/recordings-mongodb', { method: 'POST', body: formData });
                    if (!response.ok) throw new Error('Failed to save recording to database');
                    
                    console.log("[Recording] ✅ Recording saved successfully.");
                    await saveRecordingDuration(finalDuration);
                    await saveCompletedInterview();

                    console.log(`[Redirect] Process complete. Redirecting to analysis page...`);
                    router.push(`/interview-analysis?id=${interviewId}`);
                } else {
                     console.warn("[Call End] No audio blob or invalid type. Redirecting to my-interviews.");
                     router.push('/my-interviews');
                }

            } catch (error) {
                console.error(`[Call End Process] ❌ Error:`, error);
                setErrorMessage('Error processing interview data. Redirecting...');
                setTimeout(() => { router.push('/my-interviews'); }, 4000);
            } finally {
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
    }, [interviewId, userId, type, router, company, interviewLevel, interviewRole, jobTitle, questions]);
    
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
        return variables;
    };
    
    const startVapiCall = async (): Promise<boolean> => {
        const assistantId = type === 'interview' ? process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID : type === 'custom' ? process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID_CUSTOM : process.env.NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID;
        if (!assistantId) throw new Error(`Missing VAPI assistant ID for type: ${type}`);
        
        try {
            const assistantOverrides = { variableValues: prepareVariableValues() };
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
    
    const hasPresetQuestions = questions && questions.length > 0;

    return (
        <>
            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src='/ai-avatar.png' alt='AI Interviewer' width={65} height={54} className='object-cover' />
                        {isSpeaking && <span className='animate-speak'/>}
                    </div>
                    <h3>AI Interviewer</h3>
                    {type === 'interview' && company && <p className='text-sm text-gray-600'>{company}</p>}
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src='/user-avatar.png' alt='user' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>Candidate</h3>
                        {type === 'interview' && interviewRole && <p className='text-sm text-gray-600'>{interviewLevel} {interviewRole}</p>}
                    </div>
                </div>
            </div>

            {callStatus === CallStatus.ACTIVE && (
                <div className='my-4 text-center'>
                    <p className='text-lg font-semibold text-gray-700'>{formatTimer(recordingDuration)}</p>
                </div>
            )}

            {hasPresetQuestions && (
                <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                    <h4 className='text-lg font-medium mb-2'>Interview Questions:</h4>
                    <ol className='list-decimal ml-5 space-y-1'>
                        {questions.map((question, index) => (
                            <li key={index} className='text-sm text-gray-700'>{question}</li>
                        ))}
                    </ol>
                </div>
            )}

            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p className={cn('transition-opacity duration-500', 'animate-fadeIn opacity-100')}>{lastMessage}</p>
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

            {errorMessage && <div className="mt-4 p-2 text-center text-red-700 bg-red-100 rounded-md"><p>{errorMessage}</p></div>}
            {isProcessing && <div className="mt-4 text-center text-blue-700"><p>Processing and saving your interview...</p></div>}
        </>
    );
};

export default Agent;