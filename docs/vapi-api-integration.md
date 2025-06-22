# Vapi Workflow API Integration

This document explains how the Vapi workflow integrates with external APIs to provide a dynamic interview experience.

## API Endpoints

The Vapi workflow makes use of two custom API endpoints:

### 1. Interview Questions API

**Endpoint**: `http://localhost:3000/api/interview-questions`

**Purpose**: Fetches customized interview questions based on user input.

**Parameters**:
- `company`: The company name for the interview
- `role`: The job title/role
- `experience`: Experience level (entry, mid, senior)
- `tech`: Technology stack or required skills

**Response Format**:
```json
{
  "success": true,
  "data": {
    "questions": [
      "Question 1",
      "Question 2",
      "Question 3",
      "Question 4",
      "Question 5"
    ],
    "company": "Company Name",
    "role": "Job Title",
    "experience": "Experience Level",
    "tech": "Technology Stack"
  }
}
```

**Error Handling**: If the API request fails, the workflow will fall back to default questions.

### 2. Save Interview Data API

**Endpoint**: `http://localhost:3000/api/save-interview`

**Purpose**: Saves interview session data including user details, questions asked, and feedback.

**Request Body**:
```json
{
  "interviewData": {
    "company": "Company Name",
    "jobTitle": "Job Title",
    "experience": "Experience Level",
    "techStack": "Technology Stack",
    "notes": "Additional Context",
    "questionsAsked": 6
  },
  "feedback": "Personalized feedback provided to the user",
  "timestamp": "2025-06-21T10:30:00Z"
}
```

**Response Format**:
```json
{
  "success": true,
  "message": "Interview data received successfully",
  "savedAt": "2025-06-21T10:35:00Z"
}
```

## Variable Usage in Workflow

The Vapi workflow uses variables to maintain state and personalize the interview experience:

1. **User Input Variables**:
   - `company`: Company name
   - `jobTitle`: Position/role
   - `experience`: Experience level
   - `techStack`: Required skills/technologies
   - `notes`: Additional context

2. **API Response Variables**:
   - `customQuestions.data.questions`: Array of questions from the API
   - These are referenced in conversation prompts to guide the interview

3. **Feedback Variables**:
   - `final_feedback`: Extracted from the feedback conversation node
   - Sent to the save-interview API for storage and analysis

## Error Handling

The workflow includes the following error handling mechanisms:

1. **API Request Failures**:
   - If fetching questions fails, the workflow continues with default questions
   - If saving interview data fails, the call ends gracefully anyway

2. **Human Escalation**:
   - A global node allows users to request human assistance at any point
   - This provides a safety net for complex situations

## Testing & Validation

To test the API integration:

1. **Local Testing**:
   - Run the Next.js application locally with `npm run dev`
   - Use tools like Postman to send test requests to your API endpoints

2. **Vapi Dashboard Testing**:
   - In the Vapi dashboard, use the "Call" button to test the workflow
   - Check the "Calls" tab to review conversation logs and API interactions

3. **End-to-End Testing**:
   - Test from your application using the Agent component
   - Verify data is correctly fetched and saved

## Troubleshooting

Common issues and their solutions:

1. **API Connectivity Issues**:
   - For local development, ensure your API endpoints accept requests from Vapi's servers
   - Add proper CORS headers to your Next.js API routes (see example below)
   - Make sure localhost:3000 is accessible to external services (consider ngrok for testing)

```typescript
// Example CORS configuration for Next.js API routes
// Add to /app/api/interview-questions/route.ts and /app/api/save-interview/route.ts

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// Add OPTIONS handler for preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Then add the headers to your GET/POST response
// Example: return NextResponse.json(data, { headers: corsHeaders });
```

2. **Variable Reference Issues**:
   - Ensure variable names match exactly in API responses and prompt references
   - Use `{{variableName}}` syntax consistently

3. **Workflow Edge Conditions**:
   - If nodes aren't connecting properly, check the edge conditions
   - Use more explicit conditions for critical transitions
