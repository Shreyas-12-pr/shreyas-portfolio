"use client";

import { useState } from "react";

export function HeroArt() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = [
    { id: "ideas", label: "Ideas", hint: "Exploration & Systems" },
    { id: "build", label: "Build", hint: "Code & Architecture" },
    { id: "learn", label: "Learn", hint: "Continuous Growth" },
    { id: "repeat", label: "Repeat", hint: "Iterative Mastery" },
  ];

  return (
    <div className="hero-art" aria-label="Interactive geometric system graphic">
      <div className="art-ambient-glow" />

      {/* Top HUD Readout */}
      <div className="art-topline">
        <span className="art-hud-tag">
          <span className="hud-dot" /> SYS: ONLINE
        </span>
        <span className="art-hud-coords">12.9716° N · 77.5946° E</span>
      </div>

      {/* Animated SVG Radar & Orbits */}
      <svg className="art-svg-stage" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="185" stroke="rgba(84, 245, 155, 0.12)" strokeWidth="1" strokeDasharray="4 8" className="spin-slow-cw" />
        <circle cx="200" cy="200" r="145" stroke="rgba(84, 245, 155, 0.22)" strokeWidth="1.2" strokeDasharray="8 6" className="spin-medium-ccw" />
        <ellipse cx="200" cy="200" rx="175" ry="105" stroke="rgba(84, 245, 155, 0.18)" strokeWidth="1" transform="rotate(-30 200 200)" />
        <ellipse cx="200" cy="200" rx="175" ry="105" stroke="rgba(118, 229, 207, 0.18)" strokeWidth="1" transform="rotate(30 200 200)" />
        <circle cx="200" cy="200" r="100" stroke="rgba(84, 245, 155, 0.25)" strokeWidth="1" />
        <circle cx="200" cy="200" r="65" stroke="rgba(84, 245, 155, 0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
        
        {/* Orbital Node Markers */}
        <circle cx="200" cy="15" r="4" fill="#54f59b" className="pulse-dot" />
        <circle cx="345" cy="200" r="3.5" fill="#76e5cf" className="pulse-dot" />
        <circle cx="200" cy="385" r="4" fill="#54f59b" className="pulse-dot" />
        <circle cx="55" cy="200" r="3.5" fill="#76e5cf" className="pulse-dot" />
      </svg>

      {/* Central Core */}
      <div className="art-core">
        <div className="art-core-inner">
          <span className="art-core-letter">S</span>
          <span className="art-core-caption">
            CURIOUS
            <br />
            BY DESIGN
          </span>
        </div>
      </div>

      {/* Floating Interactive Micro-Badges */}
      <div className="art-floating-tags">
        {tags.map((tag, idx) => (
          <button
            type="button"
            key={tag.id}
            className={`art-label art-label-${idx} ${activeTag === tag.id ? "art-label-active" : ""}`}
            onMouseEnter={() => setActiveTag(tag.id)}
            onMouseLeave={() => setActiveTag(null)}
            onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
            title={tag.hint}
          >
            <span>{tag.label}</span>
          </button>
        ))}
      </div>

      {/* Active Hint Overlay */}
      {activeTag && (
        <div className="art-hint-toast">
          {tags.find((t) => t.id === activeTag)?.hint}
        </div>
      )}

      {/* Bottom HUD Readout */}
      <div className="art-bottomline">
        <span className="art-hud-label">LEARNING · BUILDING · SHARING</span>
        <span className="art-hud-status">
          <span className="art-cross">✳</span> B.TECH CSE
        </span>
      </div>
    </div>
  );
}
