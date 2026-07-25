// Utility to detect embeddable video URLs (YouTube / Vimeo) and return an
// iframe-compatible URL. For anything else we treat it as a direct file URL.

export type VideoKind = "youtube" | "vimeo" | "file";

export function detectVideo(url: string | null | undefined): { kind: VideoKind; embed: string } | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;

  // YouTube: watch?v=, youtu.be/, /shorts/, /embed/
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  if (yt) {
    return {
      kind: "youtube",
      embed: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&playsinline=1`,
    };
  }

  // Vimeo: vimeo.com/{id} or player.vimeo.com/video/{id}
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return {
      kind: "vimeo",
      embed: `https://player.vimeo.com/video/${vm[1]}?title=0&byline=0&portrait=0`,
    };
  }

  return { kind: "file", embed: u };
}
