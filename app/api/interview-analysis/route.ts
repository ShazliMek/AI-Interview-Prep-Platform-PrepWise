import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { connectToMongoDB } from "@/lib/mongodb";
import { VoiceRecording, InterviewAnalysis } from "@/lib/models/mongodb-schemas";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recordingId } = await request.json();
    
    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Recording ID is required" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Check if recording exists and belongs to user
    const recording = await VoiceRecording.findById(recordingId);
    if (!recording || recording.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Recording not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if analysis already exists
    let existingAnalysis = await InterviewAnalysis.findOne({ recordingId });
    if (existingAnalysis) {
      return NextResponse.json({
        success: true,
        analysis: existingAnalysis.analysis,
        message: "Analysis already exists"
      });
    }

    // Call Python backend for analysis
    const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/analyze-recording`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        recording_id: recordingId,
        user_id: user.id 
      })
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend analysis failed: ${backendResponse.status}`);
    }

    const analysisResult = await backendResponse.json();
    
    // Calculate overall score
    const clarityScore = Math.max(0, 100 - (analysisResult.clarity?.filler_word_count || 0) * 10);
    const confidenceScore = analysisResult.confidence_metrics?.pitch_stability_score || 0;
    const paceScore = Math.max(0, 100 - Math.abs((analysisResult.pace || 150) - 150));
    const overallScore = (clarityScore + confidenceScore + paceScore) / 3;

    // Store analysis in MongoDB
    const analysisData = {
      recordingId,
      userId: user.id,
      interviewId: recording.interviewId,
      analysis: {
        ...analysisResult,
        overallScore: Math.round(overallScore * 10) / 10,
        recommendations: generateRecommendations(analysisResult)
      }
    };

    const savedAnalysis = await InterviewAnalysis.create(analysisData);

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis.analysis,
      message: "Analysis completed successfully"
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { success: false, message: "Analysis failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('recordingId');

    if (!recordingId) {
      return NextResponse.json(
        { success: false, message: "Recording ID is required" },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const analysis = await InterviewAnalysis.findOne({ 
      recordingId,
      userId: user.id 
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, message: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: analysis.analysis
    });

  } catch (error) {
    console.error("Get analysis error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get analysis" },
      { status: 500 }
    );
  }
}

function generateRecommendations(analysis: any): string[] {
  const recommendations: string[] = [];
  
  if (analysis.clarity?.filler_word_count > 5) {
    recommendations.push("Try to reduce filler words like 'um', 'uh', and 'like' for clearer communication");
  }
  
  if (analysis.confidence_metrics?.pitch_stability_score < 70) {
    recommendations.push("Practice speaking with more consistent tone and pace to improve confidence");
  }
  
  if (analysis.pace < 120) {
    recommendations.push("Consider speaking a bit faster to maintain engagement");
  } else if (analysis.pace > 180) {
    recommendations.push("Try slowing down your speech for better clarity and understanding");
  }
  
  if (analysis.tone?.confidence < 0.7) {
    recommendations.push("Work on expressing a more positive and confident tone");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Great job! Your interview performance shows strong communication skills");
  }
  
  return recommendations;
}
