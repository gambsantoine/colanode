import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import AdmZip from 'adm-zip';

// The draw.io editor is served by Colanode itself so it works without any
// external service. Network access is only needed here, when building the app.
const VERSION = '32.6.9';
const SHA256 =
  '31afc82b7920c409d0591f6126ccb6c377d7800e7f11ab324f88bdf1e4249ce7';
const URL = `https://github.com/jgraph/drawio/releases/download/v${VERSION}/draw.war`;

// The server side files are not needed. draw.io's service worker would also
// download the whole editor in the background: the app's own one caches the
// files actually used.
const REMOVED_ENTRIES = [
  'WEB-INF',
  'META-INF',
  'service-worker.js',
  'service-worker.js.map',
  'workbox-05b6c01b.js',
  'workbox-05b6c01b.js.map',
];
const VERSION_FILE = '.colanode-version';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const targets: Record<string, string> = {
  web: resolve(root, 'apps/web/public/drawio'),
  desktop: resolve(root, 'apps/desktop/assets/drawio'),
};

const download = async (): Promise<Buffer> => {
  console.log(`Downloading draw.io ${VERSION}...`);
  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error(`Failed to download draw.io: ${response.status}`);
  }

  const data = Buffer.from(await response.arrayBuffer());
  const hash = createHash('sha256').update(data).digest('hex');
  if (hash !== SHA256) {
    throw new Error(`Unexpected draw.io checksum: ${hash}`);
  }

  return data;
};

const isInstalled = (target: string) => {
  const file = resolve(target, VERSION_FILE);
  return existsSync(file) && readFileSync(file, 'utf-8') === VERSION;
};

const install = (archive: Buffer, target: string) => {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  new AdmZip(archive).extractAllTo(target, true);

  for (const entry of REMOVED_ENTRIES) {
    rmSync(resolve(target, entry), { recursive: true, force: true });
  }

  writeFileSync(resolve(target, VERSION_FILE), VERSION);
  console.log(`Installed draw.io ${VERSION} in ${target}`);
};

const main = async () => {
  const names = process.argv.slice(2);
  const selected = names.length > 0 ? names : Object.keys(targets);
  const pending = selected.map((name) => {
    const target = targets[name];
    if (!target) {
      throw new Error(`Unknown target: ${name}`);
    }

    return target;
  });

  const missing = pending.filter((target) => !isInstalled(target));
  if (missing.length === 0) {
    console.log(`draw.io ${VERSION} is already installed`);
    return;
  }

  const archive = await download();
  missing.forEach((target) => install(archive, target));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
