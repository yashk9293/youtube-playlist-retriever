import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Create the OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );

  // 2. Define the scopes we want for YouTube Data API
  const scopes = [
    'https://www.googleapis.com/auth/youtube.readonly',
    // Add any other scopes you need
  ];

  // 3. Generate the URL for Google OAuth consent page
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',    // "offline" to get a refresh token
    prompt: 'consent',         // Force consent to ensure refresh token is received
    scope: scopes,
  });

  // 4. Redirect the user to the authorization URL
  res.redirect(authorizationUrl);
}
