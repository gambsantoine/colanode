import { AppType } from '@colanode/client/types';

// draw.io has no rendering library: its editor runs in an iframe and talks to
// the app through postMessage (https://www.drawio.com/doc/faq/embed-mode). The
// editor is bundled with the app (npm run fetch:drawio -w @colanode/scripts) so
// it works without any external service.
export interface DrawioHost {
  url: string;
  origin: string;
}

export const getDrawioHost = (appType: AppType): DrawioHost => {
  if (appType === 'desktop') {
    return { url: 'local://drawio/index.html', origin: 'local://drawio' };
  }

  return {
    url: `${window.location.origin}/drawio/index.html`,
    origin: window.location.origin,
  };
};

// An SVG holding the diagram: it can be displayed anywhere, without draw.io,
// and reopened in the editor.
export const DRAWIO_FILE_EXTENSION = '.drawio.svg';

export type DrawioMessage =
  | { event: 'init' }
  | { event: 'load'; xml?: string }
  | { event: 'autosave'; xml: string }
  | { event: 'save'; xml: string }
  | { event: 'export'; data: string };

export type DrawioAction =
  | { action: 'load'; xml: string; autosave: 1; title: string }
  | { action: 'export'; format: 'xmlsvg' | 'xmlpng'; spinKey?: string };

export const buildDrawioUrl = (host: DrawioHost, dark: boolean): string => {
  const params = new URLSearchParams({
    embed: '1',
    // No cloud storage, no external services.
    offline: '1',
    stealth: '1',
    proto: 'json',
    spin: '1',
    saveAndExit: '0',
    noExitBtn: '1',
    configure: '0',
    dark: dark ? '1' : '0',
  });

  return `${host.url}?${params}`;
};

const DRAWIO_EVENTS = ['init', 'load', 'autosave', 'save', 'export'];

export const parseDrawioMessage = (data: unknown): DrawioMessage | null => {
  if (typeof data !== 'string') {
    return null;
  }

  try {
    const message = JSON.parse(data) as { event?: unknown };
    return DRAWIO_EVENTS.includes(message?.event as string)
      ? (message as DrawioMessage)
      : null;
  } catch {
    return null;
  }
};

const decodeBase64 = (value: string): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

// Exports are returned as data URLs.
export const drawioDataToBlob = (data: string, type: string): Blob => {
  const [, base64] = data.split(';base64,');
  return base64
    ? new Blob([decodeBase64(base64)], { type })
    : new Blob([data], { type });
};

export const drawioDataToText = (data: string): string => {
  const [, base64] = data.split(';base64,');
  return base64 ? new TextDecoder().decode(decodeBase64(base64)) : data;
};

const SVG_START = /^\s*(<\?xml[^>]*\?>\s*)?(<!DOCTYPE[^>]*>\s*)?<svg[\s>]/i;

// Used by the file preview: only `.drawio.svg` files can be shown without the
// editor, `.drawio` files hold the raw diagram.
export const renderDrawio = async (code: string): Promise<string> => {
  if (!SVG_START.test(code)) {
    throw new Error('Open this file in the draw.io editor to display it');
  }

  return code;
};
