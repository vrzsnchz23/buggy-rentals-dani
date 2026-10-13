"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AlertCircle, Check, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { PHOTO_CHOICES, resolveCover } from "@/lib/blog/photo-library";
import { isUploadKey, uploadId, uploadKey, uploadToImageData, type UploadMeta } from "@/lib/blog/uploads";

/**
 * Picks the photo that heads an article: one already on the site, or one from
 * this computer.
 *
 * The upload path does its work in the browser before anything is sent. A
 * photo straight off a phone is 4000px wide and several megabytes, which is
 * far more than a 1200px-wide cover will ever show, so it is drawn into a
 * canvas at a sane size, re-encoded, and reduced a second time to the tiny
 * blurred placeholder that next/image shows while the real file loads. Three
 * reasons it happens here rather than on the server: the upload is small
 * enough to survive a slow connection and a serverless body limit, nothing on
 * the server has to decode an image, and the intrinsic size is known before
 * the request is even made — which is what the page needs in order to reserve
 * the right space and not shift the layout as the photo arrives.
 *
 * EXIF orientation is honoured, so a photo taken in portrait does not arrive
 * on its side.
 */

/** The longest edge a cover is stored at. A full-bleed hero asks for 2048. */
const MAX_EDGE = 2000;

/** Before decoding, not after: a 100-megapixel file can lock up a tab. */
const MAX_INPUT_BYTES = 25 * 1024 * 1024;

type Decoded = { source: CanvasImageSource; width: number; height: number; cleanup: () => void };

async function decode(file: File): Promise<Decoded> {
  /* createImageBitmap is the only path that applies EXIF orientation
     predictably, so it is tried first. */
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bitmap, width: bitmap.width, height: bitmap.height, cleanup: () => bitmap.close() };
    } catch {
      /* Fall through: some formats and older browsers refuse here. */
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("decode failed"));
      img.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

async function prepare(file: File) {
  const decoded = await decode(file);
  try {
    const { source, width, height } = decoded;
    if (!width || !height) throw new Error("no dimensions");

    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(source, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (!blob) throw new Error("encode failed");

    /* The placeholder. 16px on the long edge is around 400 bytes of base64,
       which is the size next/image inlines into the HTML. */
    const blur = document.createElement("canvas");
    const bw = w >= h ? 16 : Math.max(1, Math.round((16 * w) / h));
    const bh = w >= h ? Math.max(1, Math.round((16 * h) / w)) : 16;
    blur.width = bw;
    blur.height = bh;
    blur.getContext("2d")?.drawImage(source, 0, 0, bw, bh);
    const blurDataURL = blur.toDataURL("image/jpeg", 0.5);

    return { blob, width: w, height: h, blurDataURL };
  } finally {
    decoded.cleanup();
  }
}

export function CoverPicker({
  value,
  onChange,
  initialUploads,
}: {
  value: string;
  onChange: (key: string) => void;
  /** Photos uploaded previously, so they can be reused. */
  initialUploads: UploadMeta[];
}) {
  const [open, setOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadMeta[]>(initialUploads);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploaded = isUploadKey(value) ? uploads.find((u) => u.id === uploadId(value)) : undefined;
  const current = uploaded ? uploadToImageData(uploaded) : resolveCover(value);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      if (file.size > MAX_INPUT_BYTES) {
        throw new Error("That photo is larger than 25MB. Export a smaller version and try again.");
      }

      let prepared;
      try {
        prepared = await prepare(file);
      } catch {
        throw new Error(
          "That file could not be read as a photo. JPG, PNG and WebP work — an iPhone HEIC does not, so export it as JPG first."
        );
      }

      const form = new FormData();
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      form.append("file", new File([prepared.blob], name, { type: "image/jpeg" }));
      form.append("filename", name);
      form.append("width", String(prepared.width));
      form.append("height", String(prepared.height));
      form.append("blurDataURL", prepared.blurDataURL);

      const res = await fetch("/api/admin/blog/images", { method: "POST", body: form });
      if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
          const json = await res.json();
          if (json?.error) detail = String(json.error);
        } catch {}
        throw new Error(detail);
      }

      const meta: UploadMeta = await res.json();
      setUploads((list) => [meta, ...list]);
      onChange(uploadKey(meta.id));
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The photo could not be uploaded.");
    } finally {
      setBusy(false);
      /* So choosing the same file again still fires a change event. */
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-20 rounded-xl overflow-hidden ring-1 ring-[#0F2035]/10 shrink-0 bg-[#F0F4F8]">
          <Image src={current} alt="" aria-hidden="true" fill sizes="112px" quality={50} className="object-cover" />
        </div>
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white ring-1 ring-[#0F2035]/15 text-sm font-bold text-[#0F2035] hover:bg-[#F0F4F8] transition-colors"
          >
            <ImageIcon className="w-4 h-4" aria-hidden="true" />
            Choose or upload a cover
          </button>
          <p className="text-xs text-[#55606E] mt-1.5 truncate">
            {uploaded ? uploaded.filename : value || "none"}
          </p>
          {/* Covers are drawn into wide boxes — 16/9 on the list, a 22rem band
              at the top of the article — so a portrait photo loses its top and
              bottom. Better to know before publishing than after. */}
          {current.height > current.width && (
            <p className="text-xs text-[#92400e] mt-1">
              This photo is taller than it is wide, so the cover will crop the top and bottom of it.
            </p>
          )}
        </div>
      </div>

      {error && !open && (
        <p role="alert" className="flex items-start gap-2 text-xs text-[#b91c1c] mt-2">
          <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Choose a cover photo"
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#0F2035]/8">
              <h2 className="font-bold text-[#0F2035]">Cover photo</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-11 h-11 -mr-2 flex items-center justify-center text-[#55606E] hover:text-[#0F2035] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* ─── From this computer ─── */}
              <div>
                <input
                  ref={fileRef}
                  id="cover-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void upload(file);
                  }}
                />
                <label
                  htmlFor="cover-upload"
                  className={`flex items-center justify-center gap-2.5 min-h-14 rounded-xl border-2 border-dashed transition-colors ${
                    busy
                      ? "border-[#0F2035]/15 text-[#55606E] cursor-wait"
                      : "border-[#C05232]/40 text-[#A8411F] hover:border-[#C05232] hover:bg-[#C05232]/[0.04] cursor-pointer"
                  } text-sm font-bold`}
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Shrinking and uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" aria-hidden="true" />
                      Upload a photo from this computer
                    </>
                  )}
                </label>
                <p className="text-xs text-[#55606E] mt-2">
                  JPG, PNG or WebP. Large photos are shrunk here before they are sent, so a photo straight from a
                  camera is fine.
                </p>
                {error && (
                  <p role="alert" className="flex items-start gap-2 text-xs text-[#b91c1c] mt-2">
                    <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" aria-hidden="true" />
                    {error}
                  </p>
                )}
              </div>

              {/* ─── Previous uploads ─── */}
              {uploads.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[#55606E] uppercase tracking-wider mb-2.5">
                    Your uploads
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uploads.map((u) => {
                      const key = uploadKey(u.id);
                      return (
                        <Thumb
                          key={u.id}
                          label={u.filename}
                          image={uploadToImageData(u)}
                          picked={key === value}
                          onPick={() => {
                            onChange(key);
                            setOpen(false);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ─── The site's own photos ─── */}
              <div>
                <h3 className="text-xs font-semibold text-[#55606E] uppercase tracking-wider mb-2.5">
                  Photos already on the site
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PHOTO_CHOICES.map((photo) => (
                    <Thumb
                      key={photo.key}
                      label={photo.label}
                      image={photo.image}
                      picked={photo.key === value}
                      onPick={() => {
                        onChange(photo.key);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Thumb({
  label,
  image,
  picked,
  onPick,
}: {
  label: string;
  image: Parameters<typeof Image>[0]["src"];
  picked: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={picked}
      className={`group relative aspect-[4/3] rounded-xl overflow-hidden transition-all ${
        picked ? "ring-2 ring-offset-2 ring-[#A8411F]" : "ring-1 ring-[#0F2035]/10 hover:ring-2 hover:ring-[#1B4F72]"
      }`}
    >
      <Image src={image} alt={label} fill sizes="(max-width: 640px) 45vw, 200px" quality={50} className="object-cover" />
      {picked && (
        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#A8411F] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" aria-hidden="true" />
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 bg-[#0F2035]/85 text-white text-[0.65rem] font-semibold px-2 py-1.5 text-left truncate">
        {label}
      </span>
    </button>
  );
}
