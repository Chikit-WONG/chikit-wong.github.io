import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const certificates = [
  {
    sectionId: 'mcm-finalist-2026',
    assetPath: 'assets/certificates/mcm-finalist-2026.webp',
  },
  {
    sectionId: 'sustainable-innovators-third-prize-2026',
    assetPath: 'assets/certificates/sustainable-innovators-third-prize-2026.webp',
  },
  {
    sectionId: 'academic-excellence-award-2026',
    assetPath: 'assets/certificates/academic-excellence-award-2026.webp',
  },
  {
    sectionId: 'outstanding-performance-award-2026',
    assetPath: 'assets/certificates/outstanding-performance-award-2026.webp',
  },
];

test('each certificate section uses a directly loadable image', async () => {
  const html = await readFile(
    path.join(repositoryRoot, 'certificates.html'),
    'utf8',
  );

  for (const { sectionId, assetPath } of certificates) {
    const sectionStart = html.indexOf(`<section id="${sectionId}">`);
    assert.notEqual(sectionStart, -1, `Missing section #${sectionId}`);

    const nextSectionStart = html.indexOf('<section ', sectionStart + 1);
    const section = html.slice(
      sectionStart,
      nextSectionStart === -1 ? html.length : nextSectionStart,
    );
    const escapedPath = assetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    assert.match(
      section,
      new RegExp(`<img[^>]+src=["']${escapedPath}["']`),
      `#${sectionId} must reference ${assetPath} with an img src`,
    );
  }
});

test('certificate WebP assets are complete RIFF containers', async () => {
  for (const { assetPath } of certificates) {
    const image = await readFile(path.join(repositoryRoot, assetPath));

    assert.equal(
      image.subarray(0, 4).toString('ascii'),
      'RIFF',
      `${assetPath} must contain binary WebP data`,
    );
    assert.equal(
      image.subarray(8, 12).toString('ascii'),
      'WEBP',
      `${assetPath} must have a WebP signature`,
    );

    const declaredLength = image.readUInt32LE(4) + 8;
    assert.equal(
      image.length,
      declaredLength,
      `${assetPath} is truncated`,
    );
  }
});
