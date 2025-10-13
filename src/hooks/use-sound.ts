'use client';

import { Howl } from 'howler';
import { useCallback, useEffect, useRef } from 'react';

export function useSound(src: string, volume: number = 0.5) {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howl on the client side only
    const sound = new Howl({
      src: [src],
      volume: volume,
      html5: true, // This can help with faster loading on some browsers
    });
    soundRef.current = sound;

    // Cleanup on unmount
    return () => {
      sound.unload();
    };
  }, [src, volume]);

  const playSound = useCallback(() => {
    const sound = soundRef.current;
    if (sound) {
      if (sound.state() === 'loaded') {
        sound.play();
      } else {
        // If not loaded yet, play once loaded
        sound.once('load', () => {
          sound.play();
        });
      }
    }
  }, []);

  return playSound;
}
