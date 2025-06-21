# PrepWise - AI Interview Preparation Platform

PrepWise is an advanced AI-powered interview preparation platform that helps users practice, analyze, and improve their interviewing skills through realistic AI-driven mock interviews and detailed feedback.

## Features

- AI-driven mock interviews tailored to specific job roles and industries
- Voice recording and analysis for comprehensive feedback
- Detailed interview analysis with strengths and areas for improvement
- Quantum-resistant encryption for user data privacy
- Privacy-forward approach with automatic data expiration

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
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_interview_assistant_id_here
NEXT_PUBLIC_VAPI_GENERATE_ASSISTANT_ID=your_vapi_generate_assistant_id_here
```

These variables are required for Vapi voice AI integration. You can obtain these values by:
1. Creating an account on [Vapi.ai](https://vapi.ai)
2. Creating two assistants (one for interviews, one for generation)
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
