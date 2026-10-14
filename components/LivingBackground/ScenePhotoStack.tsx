"use client";

import React from "react";
import { SCENES, type SceneKey } from "@/data/scenes";

function hideBrokenImage(event: React.SyntheticEvent<HTMLImageElement>) {
  const picture = event.currentTarget.closest("picture");
  if (picture instanceof HTMLElement) {
    picture.style.display = "none";
  }
}

export function ScenePhotoStack({
  activeSceneKey,
  overlay,
}: {
  activeSceneKey: SceneKey;
  overlay: string;
}) {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[-4] overflow-hidden select-none bg-[#16141A]"
        aria-hidden="true"
      >
        {Object.entries(SCENES).map(([key, sc]) => {
          const isActive = key === activeSceneKey;
          return (
            <picture
              key={key}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <source type="image/avif" srcSet={sc.srcSetAvif} sizes="100vw" />
              <source type="image/webp" srcSet={sc.srcSetWebp} sizes="100vw" />
              <img
                src={sc.webpUrl}
                alt=""
                className="w-full h-full object-cover object-center"
                loading="eager"
                fetchPriority={key === "default" ? "high" : "low"}
                decoding="async"
                onError={hideBrokenImage}
              />
            </picture>
          );
        })}
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-[-3] transition-all duration-1000 ease-in-out"
        style={{ background: overlay }}
        aria-hidden="true"
      />
    </>
  );
}
