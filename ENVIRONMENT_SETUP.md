# Environment Setup Guide

## Overview
This application uses several third-party services that require API keys and configuration. Follow this guide to set up your environment properly.

## Required Environment Variables

### Firebase (Frontend)
These variables are safe to expose to the browser (prefixed with `NEXT_PUBLIC_`):

- `NEXT_PUBLIC_FIREBASE_API_KEY` - Get from Firebase Console > Project Settings
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID

### Firebase Admin (Server-Side Only)
These are secret and should never be exposed to the browser:

- `FIREBASE_PROJECT_ID` - Same as the client project ID
- `FIREBASE_CLIENT_EMAIL` - Service account email from JSON key file
- `FIREBASE_PRIVATE_KEY` - Service account private key (with escaped newlines)

**How to get Firebase Admin credentials:**
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Copy the values from the downloaded JSON file
4. For `FIREBASE_PRIVATE_KEY`, ensure newlines are escaped as `\n`

### Groq API (AI Chat Feature)
- `GROQ_API_KEY` - Your Groq API key from https://console.groq.com/

**Note:** If this is not set, the AI chat feature will return a 503 error with a helpful message.

### Database
- `DATABASE_URL` - PostgreSQL connection string

## Troubleshooting

### "net::ERR_BLOCKED_BY_CLIENT" Error
This error appears when:
- Ad blockers are blocking Firestore requests
- Browser extensions are interfering with Firebase
- CSP headers are too restrictive

**Solution:** 
- The app now includes proper CSP headers to allow Firestore
- Ask users to disable ad blockers for your domain
- Check browser console for exact blocked resources

### "AI service is not configured" Error (503)
This means `GROQ_API_KEY` is not set in your environment.

**Solution:**
1. Get your API key from https://console.groq.com/
2. Add it to your `.env.local` (development) or deployment environment
3. For deployment, add the variable to:
   - Vercel: Project Settings > Environment Variables
   - Docker: Pass as build arg or runtime env var
   - Other platforms: Follow their env var documentation

### Firestore Connection Issues
If Firestore can't connect:

1. Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly
2. Verify your Firebase project allows the client SDK
3. Check Firebase Console > Authentication > Sign-in method is enabled
4. Check Firestore Rules > Database Rules allow read/write for authenticated users

## Development Setup

1. Copy `.env.example` to `.env.local`
2. Fill in all the required values
3. Run `npm install` and `npm run dev`

## Production Deployment

### For Vercel:
1. Go to Project Settings > Environment Variables
2. Add all non-NEXT_PUBLIC_ variables (they're private)
3. Add NEXT_PUBLIC_* variables (they're public)
4. Redeploy

### For Docker/Self-Hosted:
1. Create a `.env` file with all variables
2. Pass variables via `docker run -e VAR_NAME=value`
3. Or use Docker Compose with environment section

### For Other Platforms:
Refer to their documentation for setting environment variables.

## Security Notes

- ✅ Never commit `.env` or `.env.local` to version control
- ✅ Use `.env.example` to document required variables
- ✅ NEXT_PUBLIC_* variables will be bundled in the client - they can be public
- ✅ All other variables must be set server-side only
- ✅ Keep `FIREBASE_PRIVATE_KEY` and `GROQ_API_KEY` secret
