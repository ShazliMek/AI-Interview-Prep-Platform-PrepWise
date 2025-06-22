# Vapi Workflow Integration

This document explains how the Vapi workflow JSON file is integrated into the PrepWise interview platform.

## Overview

The system now supports both Vapi assistants and Vapi workflows for conducting AI interviews:

- **Vapi Assistant**: A simpler implementation using a single prompt to guide the conversation.
- **Vapi Workflow**: A structured conversation flow with defined states, transitions, and variable extraction.

## How the Workflow Works

The Vapi workflow JSON file defines a structured conversation flow for mock interviews with several connected nodes:

1. **Introduction** - Starts the conversation as an interview coach
2. **Collect Interview Details** - Gathers information about the job, company, experience level
3. **Start Mock Interview** - Transitions to acting as the interviewer
4. **Conduct Interview** - Asks questions and provides feedback
5. **End Interview** - Concludes the mock interview
6. **Final Feedback** - Offers personalized improvement tips
7. **End Call Success** - Terminates the call with an encouraging message

## How It's Integrated

The workflow is implemented in the following way:

1. The workflow ID is stored in the environment variable `NEXT_PUBLIC_VAPI_WORKFLOW_ID`.
2. In the `Agent` component, the system attempts to use the workflow first, then falls back to the assistant if needed.
3. Preset interview questions are displayed in the UI for both the user and the AI to see.
4. When a call starts, the system adds system messages to inform the AI about the preset questions.

## Benefits of Using the Workflow

1. **Structured Interview Process**: The workflow ensures a consistent interview format.
2. **Variable Extraction**: The workflow automatically extracts key information like company, job title, etc.
3. **Dynamic Conversation Flow**: The system can adapt based on user responses.
4. **Enhanced Interruptibility**: Built-in settings for voice activity detection create a more natural conversation.

## How to Update the Workflow

1. Modify the `vapi.json` file with your desired changes.
2. Upload the updated JSON to the Vapi dashboard.
3. Update the `NEXT_PUBLIC_VAPI_WORKFLOW_ID` environment variable with the new workflow ID.

## Preset Interviews

Preset interviews work with both workflow and assistant modes. The preset questions are:
1. Displayed in the UI for the user's reference
2. Sent as system messages to the AI
3. Incorporated into the interview conversation

## Troubleshooting

If the workflow isn't working as expected:
- Check that the workflow ID is correctly set in the environment variables
- Verify that the workflow has been uploaded and published in the Vapi dashboard
- Look for any console errors during the call initiation process
