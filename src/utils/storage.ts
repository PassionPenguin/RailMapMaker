import { ContentData, SavedFileMeta } from '@types';

const LIST_KEY = 'rmm:fileList';
const FILE_KEY_PREFIX = 'rmm:file:';

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.warn('[storage] failed to read', key, error);
    return fallback;
  }
}

export function loadFileList(): SavedFileMeta[] {
  return readJson<SavedFileMeta[]>(LIST_KEY, []);
}

export function loadFile(id: number): ContentData | null {
  if (!isBrowser) return null;
  const raw = localStorage.getItem(`${FILE_KEY_PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContentData;
  } catch (error) {
    console.warn('[storage] failed to parse file', id, error);
    return null;
  }
}

export function upsertFile(content: ContentData, id?: number): number {
  if (!isBrowser) return id ?? 0;
  const fileList = loadFileList();
  const nextId = id ?? ((fileList.at(-1)?.id ?? -1) + 1);
  const payload: ContentData = { ...content, lastModified: Date.now() };
  localStorage.setItem(`${FILE_KEY_PREFIX}${nextId}`, JSON.stringify(payload));

  const meta: SavedFileMeta = {
    id: nextId,
    name: payload.name,
    author: payload.author,
    lastModified: payload.lastModified,
    size: JSON.stringify(payload).length
  };

  const remaining = fileList.filter((file) => file.id !== nextId);
  remaining.push(meta);
  remaining.sort((a, b) => b.lastModified - a.lastModified);
  localStorage.setItem(LIST_KEY, JSON.stringify(remaining));

  return nextId;
}

export function deleteFile(id: number) {
  if (!isBrowser) return;
  localStorage.removeItem(`${FILE_KEY_PREFIX}${id}`);
  const updated = loadFileList().filter((file) => file.id !== id);
  localStorage.setItem(LIST_KEY, JSON.stringify(updated));
}

export function clearAllFiles() {
  if (!isBrowser) return;
  const files = loadFileList();
  files.forEach((file) => localStorage.removeItem(`${FILE_KEY_PREFIX}${file.id}`));
  localStorage.removeItem(LIST_KEY);
}
