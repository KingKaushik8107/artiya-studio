export function getDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return '';

  const trimmedUrl = url.trim();

  // Support local paths if needed elsewhere
  if (trimmedUrl.startsWith('/')) return trimmedUrl;

  if (!trimmedUrl.startsWith('https://')) return '';

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (
      parsedUrl.hostname === 'drive.google.com' ||
      parsedUrl.hostname === 'www.drive.google.com'
    ) {
      const pathMatch = parsedUrl.pathname.match(
        /\/file\/d\/([a-zA-Z0-9_-]+)/
      );

      const fileId =
        pathMatch?.[1] || parsedUrl.searchParams.get('id');

      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w600`;
      }

      if (parsedUrl.pathname === '/thumbnail') {
        return trimmedUrl;
      }
    }

    return trimmedUrl;
  } catch {
    return '';
  }
}