"use client";

import { useEffect, useRef } from "react";
import { HERO_MOBILE_QUERY, heroVideo } from "@/data/site";
import { Arrow } from "../icons";

// Pre-launch hero: a muted, looping video (its headline is part of the video)
// and the launch-updates button. Phones and portrait screens get the 4:5 cut,
// the rest the 16:9 one; <source media> picks it, so only one file downloads.
// The poster <picture> behind shows the matching first frame until playback
// starts, and stays when the visitor prefers reduced motion.
export function Hero() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    // iOS only autoplays muted video; set it on the element itself to be sure.
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      v.removeAttribute("autoplay");
      return;
    }
    v.play().catch(() => {
      // Autoplay blocked (e.g. low-power mode): the poster stays up.
    });
  }, []);

  const { desktop, mobile } = heroVideo;

  return (
    <section className="hero full hero-video" aria-labelledby="hero-title">
      <picture className="hv-poster">
        <source media={HERO_MOBILE_QUERY} srcSet={mobile.poster} />
        <img src={desktop.poster} alt="" fetchPriority="high" />
      </picture>
      <video ref={video} className="hv" autoPlay muted loop playsInline preload="auto" aria-hidden="true" disablePictureInPicture>
        <source media={HERO_MOBILE_QUERY} src={mobile.src} type="video/mp4" />
        <source src={desktop.src} type="video/mp4" />
      </video>

      <div className="hero-copy">
        <h1 id="hero-title" className="sr">
          {heroVideo.line}
        </h1>
        <div className="ctas">
          <a className="btn btn-light" href="#letter">
            Get launch updates <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
