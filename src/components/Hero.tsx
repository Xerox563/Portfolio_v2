import { useEffect, useRef, useState } from "react";
import { Magnetic } from "./Magnetic";
import { scrollTo } from "../lib/smoothScroll";
import { useContent } from "../lib/content";

export function Hero() {
  const { identity } = useContent();
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section id="home" ref={heroRef} className="hero parallax-section" data-gsap-reveal data-stagger="0.08" data-y="60">
      {/* backdrop layers */}
      <div className="hero__bg" aria-hidden>
        <div className="hero__grid" data-parallax-layer data-parallax-speed="0.15" data-parallax-scrub="1" />
        <div 
          className="blob hero__blob hero__blob-1" 
          data-parallax-layer 
          data-parallax-speed="0.3" 
          data-parallax-scrub="1"
          style={{ background: "#c8ff5e" }}
        />
        <div 
          className="blob hero__blob hero__blob-2" 
          data-parallax-layer 
          data-parallax-speed="0.4" 
          data-parallax-scrub="1"
          style={{ background: "#5ec8ff" }}
        />
        <div 
          className="blob hero__blob hero__blob-3" 
          data-parallax-layer 
          data-parallax-speed="0.35" 
          data-parallax-scrub="1"
          style={{ background: "#ff5ea0" }}
        />
        <div 
          className="blob hero__blob hero__blob-4" 
          data-parallax-layer 
          data-parallax-speed="0.25" 
          data-parallax-scrub="1"
          style={{ background: "#9b7bff" }}
        />
        <div className="hero__vignette" />
      </div>

      {/* meta corners */}
      <div className="hero__meta hero__meta--tl" data-gsap-reveal data-delay="0.1" data-y="40">
        <span className="eyebrow">Portfolio — v04</span>
      </div>
      <div className="hero__meta hero__meta--tr" data-gsap-reveal data-delay="0.15" data-y="40">
        <Clock />
      </div>
      <div className="hero__meta hero__meta--bl" data-gsap-reveal data-delay="0.2" data-y="40">
        <span className="mono">{identity.location}</span>
      </div>
      <div className="hero__meta hero__meta--br" data-gsap-reveal data-delay="0.25" data-y="40">
        <span className="status">
          <span className="status__dot" /> {identity.availability}
        </span>
      </div>

      {/* center */}
      <div className="hero__content container" data-gsap-reveal data-y="80">
        <p
          className="hero__role"
          data-gsap-split
          data-split-type="chars"
          data-stagger="0.02"
        >
          {identity.role.split(" / ")[0]}
          <span className="serif" style={{ color: "var(--accent)" }}>/</span>
          {identity.role.split(" / ")[1] ?? ""}
        </p>

        <h1
          className={`hero__name display ${identity.heroWordmark.length > 6 ? "hero__name--long" : ""}`}
          aria-label={identity.name}
        >
          {identity.heroWordmark.split("").map((ch, i) => (
            <span className="hero__char" key={i} aria-hidden>
              <span
                className="hero__char-inner"
                data-gsap-split
                data-split-type="chars"
                data-stagger="0.02"
              >
                {ch}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="hero__lede"
          data-gsap-split
          data-split-type="lines,words"
          data-stagger="0.03"
        >
          {identity.taglineHighlight &&
          identity.tagline.includes(identity.taglineHighlight) ? (
            <>
              {identity.tagline.split(identity.taglineHighlight)[0]}
              <span className="serif grad-text">&nbsp;{identity.taglineHighlight}</span>
              {identity.tagline.split(identity.taglineHighlight)[1] ?? ""}
            </>
          ) : (
            identity.tagline
          )}
        </p>

        <div className="hero__actions" data-gsap-reveal data-stagger="0.1" data-y="40">
          <Magnetic strength={0.35}>
            <button className="btn" onClick={() => scrollTo("#work")} data-cursor="hover">
              <span className="btn__fill" />
              View selected work
              <Arrow />
            </button>
          </Magnetic>
          <Magnetic strength={0.35}>
            <button
              className="btn btn--ghost"
              onClick={() => scrollTo("#contact")}
              data-cursor="hover"
            >
              <span className="btn__fill" />
              Start a project
            </button>
          </Magnetic>
        </div>
      </div>

      {/* scroll cue */}
      <button
        className="hero__scroll"
        onClick={() => scrollTo("#about")}
        data-cursor="hover"
        data-gsap-reveal
        data-delay="1.2"
        data-y="30"
      >
        <span className="mono">Scroll</span>
        <span className="hero__scroll-track">
          <span className="hero__scroll-dot" data-gsap-reveal data-stagger="0" />
        </span>
      </button>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L8 3M13 8L8 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Clock() {
  const { identity } = useContent();
  const [time, setTime] = useState(() => formatNow(identity.timezone));
  useEffect(() => {
    const id = setInterval(() => setTime(formatNow(identity.timezone)), 1000);
    return () => clearInterval(id);
  }, [identity.timezone]);
  return <span className="mono">{time}</span>;
}

function formatNow(timeZone: string) {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });
}
