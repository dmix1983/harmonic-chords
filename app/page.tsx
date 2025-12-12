"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Song {
  slug: string;
  title: string;
}

export default function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    async function loadSongs() {
      try {
        const res = await fetch("/songs/index.json");
        const data = await res.json();
        setSongs(data);
      } catch (err) {
        console.error("Error loading song index:", err);
      }
    }

    loadSongs();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Brand header */}
<header className="mb-12">
  <h1 className="text-4xl font-bold tracking-tight mb-2">
    HarmonIQ
  </h1>
</header>


        {/* Song list */}
        <section className="space-y-2">
          {songs.map((song, index) => (
            <div key={song.slug}>
              <Link
                href={`/song/${song.slug}`}
                className="block px-4 py-3 rounded-md transition-all duration-200
                           hover:bg-neutral-800 hover:text-white
                           text-lg font-medium"
              >
                {song.title}
              </Link>

              {/* Divider except after last item */}
              {index < songs.length - 1 && (
                <div className="border-b border-neutral-800 my-2" />
              )}
            </div>
          ))}

          {songs.length === 0 && (
            <p className="text-neutral-500 mt-4">No songs found.</p>
          )}
        </section>
      </div>
    </main>
  );
}
