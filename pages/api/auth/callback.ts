import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { URLSearchParams } from 'url';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Parse the code from the query parameters
  const code = req.query.code as string;

  // 2. Create the OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!
  );

  try {
    // 3. Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // 4. Here you have accessToken, refreshToken, etc.
    //    In a production app, you would securely store these.
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    // For simplicity, let’s store the token in a session or cookie. 
    // (In real apps, consider an encrypted cookie or server session store.)
    const params = new URLSearchParams({
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    });

    // 5. Redirect to home page (or another page) with tokens in query/params
    res.redirect('/?' + params.toString());
  } catch (err) {
    console.error('Error exchanging code for token', err);
    res.status(500).send('Authentication failed');
  }
}
