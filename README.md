# PrepWise - AI Interview Preparation Platform

PrepWise is an advanced AI-powered interview preparation platform that helps users practice, analyze, and improve their interviewing skills through realistic AI-driven mock interviews and detailed feedback.

## Features

- AI-driven mock interviews tailored to specific job roles and industries
- Voice recording and analysis for comprehensive feedback
- Detailed interview analysis with strengths and areas for improvement
- Quantum-resistant encryption for user data privacy
- Privacy-forward approach with automatic data expiration
- Model Context Protocol (MCP) server for advanced AI model orchestration

## Data Security & Privacy

PrepWise takes a privacy-first approach to handling user data:

### Voice Data Storage

- All voice recordings are encrypted using hybrid encryption methods
- Automatic deletion of voice recordings after 30 days (user-configurable)
- User controls for consent and data management

### Quantum-Resistant Security

PrepWise implements quantum-resistant cryptographic approaches:
- Hybrid encryption combining traditional and post-quantum algorithms
- Key encapsulation mechanisms resistant to quantum computing attacks
- Zero-knowledge proof mechanisms for certain verification processes

## Getting Started

### Environment Configuration

Create a `.env.local` file in the root directory with the following environment variables:

```
# Vapi Integration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_interview_assistant_id_here
NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID=your_vapi_generate_assistant_id_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=ai-interview-prep

# Anthropic AI (for MCP server)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

These variables are required for various integrations. You can obtain the Vapi values by:
1. Creating an account on [Vapi.ai](https://vapi.ai)
2. Creating assistants for interviews and question generation
3. Getting your web token from the dashboard

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## AI Interview Technology

PrepWise leverages advanced AI technology for realistic interview experiences:

- **Vapi AI Integration**: Voice-based AI assistant technology for natural conversation
- **Structured Workflow**: Customized interview workflows that follow realistic interview patterns
- **Preset Company Interviews**: Pre-configured interviews for specific companies and roles
- **Real-time Feedback**: AI-driven analysis during and after the interview
- **Model Context Protocol (MCP)**: Standardized protocol for AI model orchestration

For more information on the Vapi workflow integration, see [the documentation](./docs/vapi-workflow.md).

## Advanced AI Capabilities

### Model Context Protocol (MCP) Integration

PrepWise includes a Model Context Protocol (MCP) server that enables:

- Orchestrated model usage across different providers (OpenAI, Anthropic, Google)
- Context-aware AI models that maintain interview state
- Specialized tools for interview question generation and response analysis
- Standardized API for extending AI capabilities

To see the MCP capabilities in action, visit the `/mcp-demo` route in the application.

The MCP server provides the following tools:
- `interview.getQuestions`: Generate tailored interview questions
- `interview.analyzeResponse`: Analyze candidate responses
- `models.orchestrate`: Coordinate multiple AI models for complex tasks
