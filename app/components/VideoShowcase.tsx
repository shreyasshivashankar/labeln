'use client';

import { useRef, useEffect } from 'react';

export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Silently ignore if autoplay is blocked
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/*
        Video is 9:16 portrait (1080x1920).
        - Mobile: show full portrait, natural aspect ratio
        - Desktop: crop to 16:9 landscape, video centered via object-cover
      */}
      <div style={{ aspectRatio: '1868 / 1680' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full block object-cover md:object-center"
        >
          <source src="/videos/showcase.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
