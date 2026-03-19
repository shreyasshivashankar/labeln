'use client';

import { useRef, useEffect } from 'react';

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play — some browsers block autoplay even when muted
    video.play().catch(() => {
      // Silently ignore if autoplay is blocked
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-auto block"
      >
        <source src="/videos/showcase.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
