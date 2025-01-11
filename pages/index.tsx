import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface PlaylistItem {
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      default?: { url?: string };
    };
  };
}

interface Playlist {
  playlistId?: string;
  title?: string;
  items?: PlaylistItem[];
}

export default function Home() {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  // Access token could be in the query if we used redirect in callback.ts
  const accessToken = (router.query.accessToken as string) || '';

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const res = await fetch(`/api/youtube?accessToken=${accessToken}`);
        const data = await res.json();
        setPlaylists(data.playlists);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch playlists', error);
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handleLogin = () => {
    // Redirect to our /api/auth which triggers the OAuth flow
    window.location.href = '/api/auth';
  };

  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-600">
        <h1 className="mb-4 text-2xl font-bold">YouTube Playlists Demo</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Login with Google
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-green-600">
        <div className="text-lg font-semibold">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-600">
      <h1 className="mb-6 text-3xl font-bold">Your YouTube Playlists</h1>
      {playlists.map((p) => (
        <div
          key={p.playlistId}
          className="mb-4 p-4 bg-white rounded shadow-sm"
        >
          <h2 className="mb-2 text-xl font-semibold text-black">{p.title}</h2>
          {p.items?.length ? (
            p.items.map((item, idx) => (
              <div key={idx} className="ml-4 border-l pl-4 py-2">
                <p className="text-gray-800">{item.snippet?.title}</p>
              </div>
            ))
          ) : (
            <p className="ml-4 text-gray-500">No items in this playlist.</p>
          )}
        </div>
      ))}
    </div>
  );
}
