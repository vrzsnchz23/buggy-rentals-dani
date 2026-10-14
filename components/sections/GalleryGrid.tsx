"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

/**
 * The photo mosaic and its lightbox.
 *
 * The tiles carry no text. Everything else on this page is already captioned,
 * and a caption burned over every tile would both clutter the mosaic and put
 * seven more pieces of small text on top of seven different photographs —
 * which is seven contrast problems to solve for no gain. The meaning lives in
 * each tile's accessible name and in the caption the lightbox shows, where
 * there is a known dark backdrop behind it.
 *
 * The lightbox is a real dialog: it takes focus on open, returns it to the
 * tile that opened it on close, keeps Tab inside itself, and answers Escape
 * and the arrow keys. A gallery that traps a keyboard user is worse than no
 * gallery.
 */

export interface GalleryPhoto {
  image: StaticImageData;
  /** What the photograph shows, for anyone who cannot see it. */
  alt: string;
  /** The line shown under the photo in the lightbox. */
  caption: string;
  /** Tailwind span classes for the mosaic. */
  span: string;
}

export interface GalleryLabels {
  open: string;
  close: string;
  prev: string;
  next: string;
  /** "Photo 3 of 7" — `{current}` and `{total}` are replaced. */
  counter: string;
}

export function GalleryGrid({ photos, labels }: { photos: GalleryPhoto[]; labels: GalleryLabels }) {
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const isOpen = open !== null;

  const close = useCallback(() => {
    const returning = open;
    setOpen(null);
    /* After the dialog has gone, not before, or the focus lands on an element
       that is about to be removed. */
    requestAnimationFrame(() => {
      if (returning !== null) tiles.current[returning]?.focus();
    });
  }, [open]);

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (!isOpen) return;

    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        /* Keep Tab inside the dialog. */
        const focusable = dialog.current?.querySelectorAll<HTMLElement>("button");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      {/* ── The mosaic ──
          Four columns with a few tiles spanning two, so the grid reads as a
          composition rather than a sheet of identical thumbnails. Two columns
          on a phone, where a 4-up tile would be a postage stamp. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[9rem] sm:auto-rows-[12rem] lg:auto-rows-[14rem] gap-3 sm:gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.image.src}
            ref={(el) => {
              tiles.current[i] = el;
            }}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${photo.alt} — ${labels.open}`}
            data-reveal
            style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C05232] ${photo.span}`}
          >
            <Image
              src={photo.image}
              alt=""
              aria-hidden="true"
              fill
              /* The two-column tiles are half the grid, the rest a quarter. */
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              placeholder="blur"
              quality={50}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            />

            {/* The affordance: the tile says it opens. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#081c2c]/70 via-[#081c2c]/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 text-[#1B4F72] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300 shadow-lg"
            >
              <Maximize2 className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>

      {/* ── The lightbox ── */}
      {current && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#050e16]/95 backdrop-blur-sm p-4 sm:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
        >
          <div ref={dialog} className="contents">
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div
              className="relative w-full max-w-5xl animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.image}
                alt={current.alt}
                sizes="(max-width: 1024px) 100vw, 1024px"
                placeholder="blur"
                className="w-full h-auto max-h-[72svh] object-contain rounded-2xl"
              />

              <figcaption className="mt-4 text-center">
                <p className="text-white text-base sm:text-lg font-semibold text-balance">{current.caption}</p>
                {/* #CBD5E1 on this backdrop is the same muted ink the rest of
                    the dark sections use. */}
                <p className="text-[#CBD5E1] text-xs mt-1.5">
                  {labels.counter
                    .replace("{current}", String((open ?? 0) + 1))
                    .replace("{total}", String(photos.length))}
                </p>
              </figcaption>
            </div>

            <div className="flex items-center gap-3 mt-5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={labels.prev}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={labels.next}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
