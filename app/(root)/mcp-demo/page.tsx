/**
 * Example component showing how to use the MCP service
 */
'use client';

import { useState } from 'react';
import { MCPService } from '@/lib/services/mcpService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Define types for the various responses
interface AnalysisResult {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string;
}

interface ModelResult {
  model: string;
  output: string;
}

interface OrchestrationResult {
  result: string;
  modelResults: ModelResult[];
}

interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export default function MCPDemoComponent() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [orchestrationResult, setOrchestrationResult] = useState<OrchestrationResult | null>(null);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Example 1: Get interview questions
  const handleGetQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await MCPService.getInterviewQuestions('fullstack', 'intermediate');
      setQuestions(result.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Analyze a response
  const handleAnalyzeResponse = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await MCPService.analyzeResponse(
        'Tell me about your experience with React',
        'I have been using React for 3 years, primarily building web applications with Redux for state management. I\'ve implemented complex UI components and optimized performance using memoization and virtualization.',
        'frontend'
      );
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example 3: Orchestrate multiple models
  const handleOrchestrateModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await MCPService.orchestrateModels(
        'Generate and evaluate interview questions',
        ['gemini-pro', 'claude-3-sonnet']
      );
      setOrchestrationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get available tools
  const handleGetTools = async () => {
    try {
      setLoading(true);
      setError(null);
      const toolsList = await MCPService.getTools();
      setTools(toolsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">MCP Server Demo</h1>
      <p className="text-gray-500">
        This component demonstrates using the Model Context Protocol (MCP) server
        to orchestrate AI models and tools.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Button onClick={handleGetTools} disabled={loading}>
          {loading ? 'Loading...' : 'List Available Tools'}
        </Button>
        <Button onClick={handleGetQuestions} disabled={loading}>
          {loading ? 'Loading...' : 'Get Interview Questions'}
        </Button>
        <Button onClick={handleAnalyzeResponse} disabled={loading}>
          {loading ? 'Loading...' : 'Analyze Response'}
        </Button>
        <Button onClick={handleOrchestrateModels} disabled={loading}>
          {loading ? 'Loading...' : 'Orchestrate Models'}
        </Button>
      </div>

      {tools.length > 0 && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
          <ul className="space-y-2">
            {tools.map((tool, index) => (
              <li key={index} className="border-b pb-2">
                <strong>{tool.name}</strong>: {tool.description}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {questions.length > 0 && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Interview Questions</h2>
          <ul className="list-disc pl-5 space-y-2">
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </Card>
      )}

      {analysisResult && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Response Analysis</h2>
          <div className="space-y-2">
            <p>
              <strong>Score:</strong> {analysisResult.score}/10
            </p>
            <div>
              <strong>Strengths:</strong>
              <ul className="list-disc pl-5">
                {analysisResult.strengths.map((strength: string, index: number) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Areas for Improvement:</strong>
              <ul className="list-disc pl-5">
                {analysisResult.improvements.map((improvement: string, index: number) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
            <p>
              <strong>Suggestion:</strong> {analysisResult.suggestions}
            </p>
          </div>
        </Card>
      )}

      {orchestrationResult && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Model Orchestration Results</h2>
          <p className="mb-4">{orchestrationResult.result}</p>
          <div className="space-y-4">
            {orchestrationResult.modelResults.map((result: ModelResult, index: number) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">{result.model}</h3>
                <p className="text-gray-700">{result.output}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
