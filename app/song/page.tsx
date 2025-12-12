"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SongPage() {
  const searchParams = useSearchParams();
  const songParam = searchParams.get("song"); // e.g. "let-it-be"

  const [songData, setSongData] = useState<any>(null);

  useEffect(() => {
    if (!songParam) return;

    async function loadSong() {
      try {
        const res = await fetch(`/songs/${songParam}.json`);
        const data = await res.json();
        setSongData(data);
      } catch (err) {
        console.error("Error loading song data:", err);
      }
    }

    loadSong();
  }, [songParam]);

  if (!songParam) {
    return <div className="p-6 text-red-500">No song specified.</div>;
  }

  if (!songData) {
    return <div className="p-6">Loading song...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{songData.title}</h1>

      <h2 className="text-xl font-semibold mb-2">Chords:</h2>

      <ul className="list-disc ml-6">
        {songData.chords?.map((chord: string, idx: number) => (
          <li key={idx} className="text-lg">
            {chord}
          </li>
        ))}
      </ul>
    </div>
  );
}

