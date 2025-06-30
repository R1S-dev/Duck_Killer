import { useRef, useEffect, useCallback } from "react";

export function useSound(url) {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(url);
    audioRef.current.volume = 0.5;
  }, [url]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // ignore error ako korisnik blokira autoplay
      });
    }
  }, []);

  return play;
}
