import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessToken = req.query.accessToken as string;

    if (!accessToken) {
      return res.status(400).json({ error: 'Missing access token' });
    }

    // 1. Create a new OAuth2Client with no client/secret needed for just using an existing token
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // 2. Fetch playlists
    const playlistsResponse = await youtube.playlists.list({
      part: ['snippet', 'contentDetails'],
      mine: true,
      maxResults: 10, // adjust as needed
    });

    console.log('PLAYLISTS RESPONSE', JSON.stringify(playlistsResponse.data, null, 2));

    const playlists = playlistsResponse.data.items || [];

    // 3. For each playlist, fetch its items
    const playlistData = [];
    for (const playlist of playlists) {
      const playlistId = playlist.id;
      const title = playlist.snippet?.title;

      // Fetch items in this playlist
      const playlistItemsResponse = await youtube.playlistItems.list({
        part: ['snippet', 'contentDetails'],
        playlistId: playlistId!,
        maxResults: 5, // adjust as needed
      });

      playlistData.push({
        playlistId,
        title,
        items: playlistItemsResponse.data.items,
      });
    }

    res.status(200).json({ playlists: playlistData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch YouTube playlists' });
  }
}
