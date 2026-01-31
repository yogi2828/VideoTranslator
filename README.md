# Video Translator AI

This is a Next.js application that allows users to upload a video, transcribe the audio, translate the text to a different language, and generate a new audio track for the translation. It uses Firebase for authentication and to store translation history. The AI functionalities are powered by Genkit and Google's Gemini models.

## Features

- **Video Transcription**: Extracts audio from video files and transcribes it to text.
- **Multi-Language Translation**: Translates the transcribed text into various languages.
- **Text-to-Speech (TTS)**: Generates a new audio track for the translated text.
- **User Authentication**: Secure login and signup functionality using Firebase Authentication.
- **Translation History**: Logged-in users can view their past translation jobs.
- **Multi-Step UI**: A user-friendly, step-by-step interface for the translation process.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **AI/Backend**: Genkit with Google Gemini
- **Database & Auth**: Firebase (Firestore & Authentication)
- **Form Management**: React Hook Form & Zod
- **Deployment**: Firebase App Hosting

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 1. Install Dependencies

First, install the necessary npm packages:

```bash
npm install
```

### 2. Set Up Environment Variables

This project uses Firebase and Google's Generative AI. You need to create a `.env` file in the root of your project and add your configuration keys.

Create a file named `.env` and add the following, replacing the placeholder values with your actual credentials:

```
# Firebase client-side config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Genkit/Gemini server-side config
GEMINI_API_KEY=AIza...
```

**Note**: The `GEMINI_API_KEY` is required for the server-side AI flows to work. The `NEXT_PUBLIC_` variables are for the client-side Firebase SDK.

### 3. Run the Development Server

Once the dependencies are installed and the environment variables are set, you can start the development server:

```bash
npm run dev
```

This will run the Next.js app on `http://localhost:9002` by default.

## Application Structure

The core logic of the application is organized as follows:

-   **Main Translation UI (`src/components/video-translator.tsx`)**: This component contains the multi-step form that guides the user through uploading a video, selecting languages, and starting the translation process. It orchestrates the calls to the AI flows.

-   **AI Flows (`src/ai/flows/`)**: This directory contains the server-side Genkit flows that handle the heavy lifting of the AI processing:
    -   `transcribe-uploaded-video.ts`: Transcribes the video's audio.
    -   `translate-transcribed-text.ts`: Translates the text.
    -   `generate-translated-audio.ts`: Creates the new audio file.

-   **Firebase Integration (`src/firebase/`)**: This directory contains all the configuration and hooks for interacting with Firebase services like Authentication and Firestore.

-   **Pages (`src/app/`)**: The different pages of the application are defined here, such as the landing page (`/`), translation page (`/translate`), and `history` page.
