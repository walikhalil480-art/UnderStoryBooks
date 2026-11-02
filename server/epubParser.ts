import * as fflate from 'fflate';

export function parseEpubBuffer(buf: Buffer): { title: string; chapters: Array<{ number: string; title: string; content: string[] }> } {
  const unzipped = fflate.unzipSync(new Uint8Array(buf));
  
  // 1. Locate container.xml
  let opfPath = 'content.opf';
  const containerBytes = unzipped['META-INF/container.xml'] || unzipped['meta-inf/container.xml'];
  if (containerBytes) {
    const containerXml = fflate.strFromU8(containerBytes);
    const rootfileMatch = containerXml.match(/full-path\s*=\s*["']([^"']+)["']/i);
    if (rootfileMatch) {
      opfPath = rootfileMatch[1];
    }
  }

  // 2. Read OPF
  const opfBytes = unzipped[opfPath] || unzipped[opfPath.replace(/\\/g, '/')];
  if (!opfBytes) {
    throw new Error('EPUB missing package OPF: ' + opfPath);
  }
  const opfXml = fflate.strFromU8(opfBytes);
  const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/') + 1) : '';

  // Extract title
  const titleMatch = opfXml.match(/<dc:title[^>]*>([^<]+)<\/dc:title>/i) || opfXml.match(/<title[^>]*>([^<]+)<\/title>/i);
  const bookTitle = titleMatch ? titleMatch[1].trim() : 'EPUB Document';

  // Extract manifest items: id -> href
  const manifest = new Map<string, string>();
  const itemRegex = /<item\s+[^>]*id\s*=\s*["']([^"']+)["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(opfXml)) !== null) {
    manifest.set(m[1], m[2]);
  }
  // Try alternative attribute ordering
  const itemRegex2 = /<item\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*id\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = itemRegex2.exec(opfXml)) !== null) {
    manifest.set(m[2], m[1]);
  }

  // Extract spine itemrefs in order
  const spineIds: string[] = [];
  const spineRegex = /<itemref\s+[^>]*idref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = spineRegex.exec(opfXml)) !== null) {
    spineIds.push(m[1]);
  }

  const chapters: Array<{ number: string; title: string; content: string[] }> = [];

  for (let i = 0; i < spineIds.length; i++) {
    const idref = spineIds[i];
    const rawHref = manifest.get(idref);
    if (!rawHref) continue;

    // Remove any anchor fragment e.g. chapter1.xhtml#header
    const cleanHref = rawHref.split('#')[0];
    const fullHref = (opfDir + cleanHref).replace(/\\/g, '/');

    // Look up file in unzipped archive
    const fileBytes = unzipped[fullHref] || unzipped[cleanHref] || Object.entries(unzipped).find(([k]) => k.toLowerCase() === fullHref.toLowerCase())?.[1];
    if (!fileBytes) continue;

    const html = fflate.strFromU8(fileBytes);
    
    // Extract chapter title
    const hMatch = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i) || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const rawTitle = hMatch ? hMatch[1].replace(/<[^>]+>/g, '').trim() : `Chapter ${i + 1}`;
    const cleanTitle = rawTitle.replace(/\s+/g, ' ') || `Chapter ${i + 1}`;

    // Extract paragraphs and text blocks
    const pMatches = Array.from(html.matchAll(/<(?:p|div|li)[^>]*>([\s\S]*?)<\/(?:p|div|li)>/gi));
    const paragraphs: string[] = [];

    for (const pm of pMatches) {
      const cleanP = pm[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
      if (cleanP.length > 0 && !paragraphs.includes(cleanP)) {
        paragraphs.push(cleanP);
      }
    }

    if (paragraphs.length === 0) {
      // Fallback: strip all tags from body
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      const bodyContent = (bodyMatch ? bodyMatch[1] : html).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (bodyContent.length > 0) {
        paragraphs.push(bodyContent);
      }
    }

    if (paragraphs.length > 0) {
      chapters.push({
        number: `Chapter ${chapters.length + 1}`,
        title: cleanTitle,
        content: paragraphs
      });
    }
  }

  return { title: bookTitle, chapters };
}
