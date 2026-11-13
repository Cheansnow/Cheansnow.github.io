(() => {
  if (window.cheanPhotoOriginalsInitialized) return;
  window.cheanPhotoOriginalsInitialized = true;

  const releaseTags = {
    "2024-photography-review": "photo-originals-2024-photography-review",
    "2026-national-day-holiday": "photo-originals-2026-national-day-holiday",
    "2026-xiamen-linhai-jihoufeng": "photo-originals-2026-xiamen-linhai-jihoufeng",
  };

  const originalUrl = (src) => {
    try {
      const url = new URL(src, window.location.href);
      if (url.origin !== window.location.origin) return null;

      const match = url.pathname.match(
        /^\/images\/posts\/([^/]+)\/previews\/([^/]+\.jpg)$/i,
      );
      if (!match) return null;

      const [, slug, fileName] = match;
      const tag = releaseTags[slug];
      if (!tag) return null;

      return {
        url: `https://github.com/Cheansnow/Cheansnow.github.io/releases/download/${tag}/${fileName}`,
        fileName,
      };
    } catch {
      return null;
    }
  };

  const setDownloadTarget = (link, original) => {
    link.href = original.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("download");
  };

  const mountViewerButton = () => {
    const viewer = document.querySelector(".image-viewer-container");
    const image = viewer?.querySelector(".image-viewer-frame img");
    if (!image || viewer.dataset.photoOriginalsMounted) return;
    viewer.dataset.photoOriginalsMounted = "true";

    const link = document.createElement("a");
    link.className = "photo-original-download";
    link.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i><span>下载原图</span>';
    link.hidden = true;
    link.addEventListener("click", (event) => event.stopPropagation());
    viewer.appendChild(link);

    const refresh = () => {
      const original = originalUrl(image.getAttribute("src"));
      link.hidden = !original;
      if (!original) return;
      setDownloadTarget(link, original);
    };

    new MutationObserver(refresh).observe(image, {
      attributes: true,
      attributeFilter: ["src"],
    });
    refresh();
  };

  mountViewerButton();
  document.addEventListener("DOMContentLoaded", mountViewerButton);
  window.addEventListener("redefine:page:refresh", mountViewerButton);
})();
