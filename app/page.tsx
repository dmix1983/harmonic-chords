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
        // Load the list of songs from a JSON file you maintain in /public
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
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">HarmonIQ Songs</h1>

      <ul className="list-disc ml-6 space-y-2">
        {songs.map((song) => (
          <li key={song.slug}>
            <Link
              href={`/song/${song.slug}`}
              className="text-blue-500 underline hover:text-blue-700"
            >
              {song.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
