"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clx } from "@lib/utils";

const DEFAULT_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTYnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzE2JyBoZWlnaHQ9JzEwJyBmaWxsPSIjMjIyMjIyIi8+PC9zdmc+";

type ImageGalleryProps = {
  images?: string[];
  media?: { images?: string[] };
  coverImage?: string;
};

export function ImageGallery({ images, media, coverImage }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const isInitialRenderRef = useRef(true);
  useEffect(() => {
    // After first client render, disable priority to avoid multiple priority images after interactions
    isInitialRenderRef.current = false;
  }, []);
  
  // Priority: media.images > images prop > fallback to coverImage
  const imageList = media?.images?.length ? media.images : images?.length ? images : coverImage ? [coverImage] : [];
  
  if (!imageList || imageList.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-3" role="region" aria-label="Galería de imágenes de la propiedad">
      {/* Main Image */}
      <div className="col-span-4 md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-white/10 relative">
        <Image
          src={imageList[active]}
          alt={`Imagen ${active + 1} de ${imageList.length} de la galería`}
          fill
          sizes="(max-width: 768px) 100vw, 75vw"
          className="object-cover transition-opacity duration-300 motion-reduce:transition-none"
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR}
          priority={isInitialRenderRef.current && active === 0}
        />
      </div>

      {/* Thumbnails */}
      <div className="col-span-4 md:col-span-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[400px]">
        {imageList.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            className={clx(
              "shrink-0 aspect-video md:aspect-[4/3] w-40 md:w-auto rounded-xl overflow-hidden ring-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] transition-all duration-200 motion-reduce:transition-none",
              i === active ? "ring-[var(--ring)]" : "ring-white/10 hover:ring-white/20"
            )}
            aria-label={`Ver imagen ${i + 1} de ${imageList.length}`}
            aria-pressed={i === active}
          >
            <Image
              src={src}
              alt={`Miniatura ${i + 1}`}
              width={160}
              height={120}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL={DEFAULT_BLUR}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
