import { supabase } from '../lib/supabaseClient';

type Song = {
  id: string;
  title: string;
  artist: string | null;
};

type Chord = {
  id: string;
  position_in_section: number | null;
  chord_symbol: string;
};

export default async function Home() {
  // 1) Get all songs
  const { data: songs, error: songsError } = await supabase
    .from('songs')
    .select('id, title, artist')
    .order('title', { ascending: true });

  if (songsError) {
    console.error('Error loading songs:', songsError.message);
  }

  // 2) Find the "Dreams" song (if it exists)
  const dreamsSong = songs?.find(
    (song: Song) => song.title.toLowerCase() === 'dreams'
  );

  let dreamsChords: Chord[] | null = null;
  let chordsErrorMessage: string | null = null;

  if (dreamsSong) {
    const { data: chords, error: chordsError } = await supabase
      .from('song_chords')
      .select('id, position_in_section, chord_symbol')
      .eq('song_id', dreamsSong.id)
      .eq('level', 1)
      .order('position_in_section', { ascending: true });

    if (chordsError) {
      console.error('Error loading chords:', chordsError.message);
      chordsErrorMessage = chordsError.message;
    } else {
      dreamsChords = chords;
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        background: '#050816',
        color: '#f9fafb',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        HarmonIQ — Songs in your library
      </h1>

      {/* Songs list */}
      {!songs || songs.length === 0 ? (
        <p>No songs found yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: '600px' }}>
          {songs.map((song: Song) => (
            <li
              key={song.id}
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '0.5rem',
                background: '#111827',
                border: '1px solid #1f2937',
              }}
            >
              <div style={{ fontWeight: 600 }}>{song.title}</div>
              {song.artist && (
                <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{song.artist}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Divider */}
      <hr
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '2rem 0 1rem',
          borderColor: '#1f2937',
        }}
      />

      {/* Dreams chords display */}
      <section style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Dreams — Level 1 chords
        </h2>

        {!dreamsSong && <p>Dreams is not in your songs table yet.</p>}

        {dreamsSong && chordsErrorMessage && (
          <p>Could not load chords: {chordsErrorMessage}</p>
        )}

        {dreamsSong && !chordsErrorMessage && (!dreamsChords || dreamsChords.length === 0) && (
          <p>No chords found for Dreams at level 1.</p>
        )}

        {dreamsSong && dreamsChords && dreamsChords.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: '#111827',
              border: '1px solid #1f2937',
            }}
          >
            {dreamsChords.map((chord) => (
              <span
                key={chord.id}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '999px',
                  border: '1px solid #4b5563',
                  fontSize: '0.95rem',
                }}
              >
                {chord.chord_symbol}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
