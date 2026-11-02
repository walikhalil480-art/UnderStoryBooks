import fs from 'node:fs';
import path from 'node:path';
import type { Book, BookChapter } from '../src/types';
import { parseEpubBuffer } from './epubParser';

const TEXT_CACHE_DIR = path.resolve(process.cwd(), 'server', 'storage', 'texts');
if (!fs.existsSync(TEXT_CACHE_DIR)) {
  fs.mkdirSync(TEXT_CACHE_DIR, { recursive: true });
}

// Memory cache for quick lookups
const pageCountCache = new Map<string, number>();

/**
 * Extracts real page count from PDF buffer using regex scan and pdfjs-dist fallback.
 */
export async function getPdfPageCount(buffer: Buffer): Promise<number> {
  if (!buffer || buffer.length < 10) return 1;

  // 1. Fast regex scan for standard uncompressed / FlateDecode PDFs
  try {
    const raw = buffer.toString('latin1');
    const pageMatches = raw.match(/\/Type\s*\/Page\b/g);
    if (pageMatches && pageMatches.length > 0) {
      return pageMatches.length;
    }
  } catch {}

  // 2. Comprehensive PDF.js parse for compressed cross-reference streams
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
      useSystemFonts: true
    });
    task.promise.catch(() => {}); // prevent node unhandled rejection
    const doc = await task.promise;
    const count = doc.numPages;
    task.destroy().catch(() => {});
    return Math.max(1, count);
  } catch (err) {
    return 1;
  }
}

/**
 * Extracts real pages and paragraphs from an uploaded PDF manuscript.
 */
export async function extractPdfChapters(buffer: Buffer, bookTitle: string): Promise<BookChapter[]> {
  if (!buffer || buffer.length < 10) return [];
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const task = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
      useSystemFonts: true
    });
    task.promise.catch(() => {}); // prevent node unhandled rejection
    const doc = await task.promise;
    const numPages = doc.numPages;
    const chapters: BookChapter[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();

    // Group text items by Y coordinate (reading lines top to bottom)
    const lineMap = new Map<number, string[]>();
    for (const item of textContent.items as Array<{ str: string; transform: number[] }>) {
      if (!item.str || !item.str.trim()) continue;
      const y = Math.round(item.transform[5]);
      if (!lineMap.has(y)) {
        lineMap.set(y, []);
      }
      lineMap.get(y)!.push(item.str);
    }

    const sortedY = Array.from(lineMap.keys()).sort((a, b) => b - a);
    const rawLines = sortedY.map((y) => lineMap.get(y)!.join(' ').trim()).filter(Boolean);

    const paragraphs: string[] = [];
    let currentPara: string[] = [];

    for (const line of rawLines) {
      currentPara.push(line);
      if (currentPara.length >= 4 || /[.:?!]$/.test(line)) {
        paragraphs.push(currentPara.join(' '));
        currentPara = [];
      }
    }
    if (currentPara.length > 0) {
      paragraphs.push(currentPara.join(' '));
    }

    const firstLine = rawLines[0] || '';
    const pageHeading =
      firstLine.length > 0 && firstLine.length <= 60
        ? firstLine
        : `Page ${i} of ${numPages}`;

    chapters.push({
      number: `Page ${i}`,
      title: `${pageHeading}`,
      content:
        paragraphs.length > 0
          ? paragraphs
          : [`[Page ${i} graphical or illustrated manuscript page — View in PDF Reader for full visual presentation]`]
    });
  }

  task.destroy().catch(() => {});
  return chapters;
  } catch {
    return [];
  }
}

/**
 * Loads real manuscript chapters (PDF or EPUB) for a published book.
 * Returns null if the book has no uploaded manuscript.
 */
export async function getManuscriptChapters(book: Book): Promise<BookChapter[] | null> {
  const manuscriptPath = book.manuscriptPath || book.provenance?.manuscriptPath;
  if (!manuscriptPath) {
    return null;
  }

  if (!fs.existsSync(manuscriptPath)) {
    throw new Error(`Manuscript file not found on disk at: ${manuscriptPath}`);
  }

  const stat = fs.statSync(manuscriptPath);
  const cacheKey = `${book.id}_ms_${stat.size}_${stat.mtimeMs}.json`;
  const cachedFile = path.join(TEXT_CACHE_DIR, cacheKey);

  if (fs.existsSync(cachedFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cachedFile, 'utf-8'));
      if (Array.isArray(cached) && cached.length > 0) {
        return cached;
      }
    } catch {}
  }

  const isPdf =
    book.manuscriptFormat === 'PDF' ||
    manuscriptPath.toLowerCase().endsWith('.pdf');
  const isEpub =
    book.manuscriptFormat === 'EPUB' ||
    manuscriptPath.toLowerCase().endsWith('.epub');

  let extractedChapters: BookChapter[] = [];

  if (isPdf) {
    const buf = fs.readFileSync(manuscriptPath);
    extractedChapters = await extractPdfChapters(buf, book.title);
  } else if (isEpub) {
    const buf = fs.readFileSync(manuscriptPath);
    const parsed = parseEpubBuffer(buf);
    extractedChapters = parsed.chapters;
  } else {
    throw new Error(`Unsupported manuscript file format for ${book.title}: ${manuscriptPath}`);
  }

  if (extractedChapters.length > 0) {
    try {
      fs.writeFileSync(cachedFile, JSON.stringify(extractedChapters, null, 2), 'utf-8');
      // Also write primary cache file for backwards compatibility
      const legacyCache = path.join(TEXT_CACHE_DIR, `${book.id}.json`);
      fs.writeFileSync(legacyCache, JSON.stringify(extractedChapters, null, 2), 'utf-8');
    } catch {}
  }

  return extractedChapters;
}
