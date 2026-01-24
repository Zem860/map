import { useEffect, useMemo, useState } from "react";
import type { ProductImageGalleryProps } from "@/type/product";

const ProductImageGallery = ({ images, title }: ProductImageGalleryProps) => {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const hasImages = safeImages.length > 0;
  const hasMultiple = safeImages.length > 1;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // clamp index when images change
  useEffect(() => {
    if (!hasImages) return;
    setSelectedIndex((i) => Math.min(Math.max(i, 0), safeImages.length - 1));
  }, [hasImages, safeImages.length]);

  const currentIndex = hasImages ? selectedIndex : 0;
  const curSrc = hasImages ? safeImages[currentIndex] : "";

  const prevImage = () => {
    if (!hasMultiple) return;
    setSelectedIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  };

  const nextImage = () => {
    if (!hasMultiple) return;
    setSelectedIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
  };

  // keyboard shortcuts when zoomed
  useEffect(() => {
    if (!isZoomed) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isZoomed, safeImages.length]);

  if (!hasImages) {
    return (
      <div className="aspect-[3/4] rounded-xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const MainImage = (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-muted">
      <img
        src={curSrc}
        alt={`${title} - ${currentIndex + 1}`}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 text-white text-xs px-3 py-1.5 backdrop-blur">
          {currentIndex + 1} / {safeImages.length}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Main */}
      <div className="relative">
        {/* click area to zoom */}
        <button
          type="button"
          className="block w-full text-left cursor-zoom-in"
          onClick={() => setIsZoomed(true)}
          aria-label="Open image zoom"
        >
          {MainImage}
        </button>

        {/* arrows (non-zoom) */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 flex items-center justify-center backdrop-blur hover:bg-black/70 transition"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white w-10 h-10 flex items-center justify-center backdrop-blur hover:bg-black/70 transition"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* pictures */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, index) => {
            const active = index === currentIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={[
                  "relative flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden border transition",
                  active
                    ? "border-primary ring-2 ring-primary/25"
                    : "border-transparent hover:border-muted-foreground/30",
                ].join(" ")}
                aria-label={`Select image ${index + 1}`}
                aria-current={active ? "true" : "false"}
              >
                <img
                  src={src}
                  alt={`${title} picture - ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Zoom Overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom dialog"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* top bar */}
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <div className="text-white/80 text-sm hidden sm:block">
                ESC to close · ←/→ to navigate
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="rounded-full bg-white/10 text-white w-10 h-10 flex items-center justify-center hover:bg-white/20 transition"
                aria-label="Close zoom"
              >
                ✕
              </button>
            </div>

            {/* zoom image */}
            <div className="rounded-2xl overflow-hidden bg-black/30 border border-white/10">
              <img
                src={curSrc}
                alt={`${title} - zoomed ${currentIndex + 1}`}
                className="w-full max-h-[80vh] object-contain mx-auto"
                draggable={false}
              />
            </div>

            {/* arrows in zoom */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white w-12 h-12 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 text-white w-12 h-12 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            {/* counter */}
            {hasMultiple && (
              <div className="mt-3 text-center text-white/80 text-sm">
                {currentIndex + 1} / {safeImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
