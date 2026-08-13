/**
 * Build the four PNGs home-assistant/brands wants, to its rules.
 *
 * The rules that actually bite: every image must be trimmed to its content, an icon is
 * exactly 256 and 512 square, and a logo's *shortest* side has to land between 128 and
 * 256 (512 for the @2x). So the logo is rendered generously and then trimmed, and the
 * render size is chosen so that what is left lands in the middle of the range rather
 * than on its edge — a logo trimmed to exactly 128 passes today and fails the day
 * somebody nudges the padding.
 *
 * The same four images end up in two places, and they are not two decisions:
 *
 * - `custom_components/schoolday/brand/` ships with the integration. HACS looks there,
 *   and Home Assistant serves what it finds from /api/brands/integration/schoolday/, so
 *   this is what actually puts an icon on the screen.
 * - `brands/custom_integrations/schoolday/` is staged in the shape
 *   home-assistant/brands wants, ready to be lifted into a pull request there. That is
 *   the belt to the shipped copy's braces, and it is the only reason the strict rules
 *   above are obeyed at all.
 *
 * Rendered once and copied, so the two can never disagree.
 */
import { chromium } from 'playwright';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const OUT = 'brands/custom_integrations/schoolday';
const SHIPPED = 'custom_components/schoolday/brand';
const IMAGES = ['icon.png', 'icon@2x.png', 'logo.png', 'logo@2x.png'];

const browser = await chromium.launch({
  executablePath: process.env.SCHOOLDAY_CHROMIUM ?? undefined,
  args: ['--no-sandbox'],
});

async function render(svgPath, width, height, outPath) {
  const svg = await readFile(svgPath, 'utf8');
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${width}px;height:${height}px}</style>${svg}`,
  );
  await writeFile(outPath, await page.screenshot({ omitBackground: true }));
  await page.close();
  console.log('rendered', outPath, `${width}x${height}`);
}

// The icon is a full-bleed rounded square: rendering it at the target size is already
// a trimmed image, so there is nothing to cut off.
await render('assets/schoolday-icon.svg', 256, 256, `${OUT}/icon.png`);
await render('assets/schoolday-icon.svg', 512, 512, `${OUT}/icon@2x.png`);

// The logo carries the icon plus the wordmark, and the SVG has padding around both.
// Rendered at 3x and 6x of the source box, trimming leaves 192 and 384 high.
await render('assets/schoolday-logo.svg', 960, 216, `${OUT}/logo.png`);
await render('assets/schoolday-logo.svg', 1920, 432, `${OUT}/logo@2x.png`);

await browser.close();

execFileSync('python3', [
  '-c',
  `
from PIL import Image
import sys
for name in ["logo.png", "logo@2x.png"]:
    path = "${OUT}/" + name
    im = Image.open(path).convert("RGBA")
    im = im.crop(im.getbbox())
    im.save(path, optimize=True)
for name in ["icon.png", "icon@2x.png", "logo.png", "logo@2x.png"]:
    im = Image.open("${OUT}/" + name).convert("RGBA")
    print(f'{name:14} {im.size[0]}x{im.size[1]}  kuerzeste Seite {min(im.size)}')
`,
], { stdio: 'inherit' });

// After the trim, not before it: the shipped copy has to be the finished image.
await mkdir(SHIPPED, { recursive: true });
for (const name of IMAGES) {
  await copyFile(`${OUT}/${name}`, `${SHIPPED}/${name}`);
}
console.log('copied', IMAGES.length, 'images to', SHIPPED);
