'use client'

import { useEffect, useState } from 'react';

export function MouseFollower() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition duration-300"
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.15), transparent 80%)`,
      }}
    />
  );
}
