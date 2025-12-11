'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Song = {
  id: string;
  title: string;
  artist: string | null;
};

type Chord = {
  id: string;
  chord_symbol: string;
  position_in_section: number | null;
};

export default function SongPage() {
  const searchParams = useSearchParams();
  const songId = searchParams.get('songId');

  const [song, setSong] = useState<Song | null>(null);
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!songId) {
        setError('No songId provided in URL.');
        setLoading(false);
        return;
      }

      try {
        // 1) Fetch the song
        const { data: songData, error: songError } = await supabase
          .from('songs')
          .select('*')
          .eq('id', songId)
          .single();

        if (songError || !songData) {
          setError(songError?.message ?? 'Song not found.');
          setLoading(false);
          return;
        }

        setSong(songData);

        // 2) Fetch Level 1 chords
        const { data: chordsData, error: chordsError } = await supabase
          .from('song_chords')
          .select('id, chord_symbol, position_in_section')
          .eq('song_id', songId)
          .eq('level', 1)
          .order('position_in_section', { ascending: true });

        if (chordsError) {
          setError(chordsError.message);
        } else {
          setChords(chordsData ?? []);
        }
      } catch (err) {
        console.error(err);
        setError('Unexpected error loading song.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [songId]);

  // UI states

  if (loading) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui' }}>
        <p>Loading song…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
          Debug songId: <code>{songId ?? 'null'}</code>
        </p>
      </div>
    );
  }

  if (!song) {
    return (
      <div style={{ padding: 32, fontFamily: 'system-ui' }}>
        <h1>No song found</h1>
        <p>Debug songId: <code>{songId ?? 'null'}</code></p>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, fontFamily: 'system-ui', color: '#f9fafb', background: '#050816', minHeight: '100vh' }}>
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#9ca3af',
          textDecoration: 'none',
        }}
      >
        ← Back to songs
      </a>

      <h1>{song.title}</h1>
      {song.artist && (
        <h3 style={{ opacity: 0.7 }}>{song.artist}</h3>
      )}

      <h2 style={{ marginTop: '2rem' }}>Level 1 Chords</h2>

      {chords.length === 0 && (
        <p>No chords found for this song at level 1.</p>
      )}

      {chords.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}
        >
          {chords.map((chord) => (
            <span
              key={chord.id}
              style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '999px',
                background: '#1f2937',
                border: '1px solid #4b5563',
                color: '#f9fafb',
                fontSize: '0.95rem',
              }}
            >
              {chord.chord_symbol}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

