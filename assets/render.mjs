import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';

// Renders an SVG to PNG so the README does not depend on the viewer's fonts.
const [, , svgPath, outPath, width, height] = process.argv;
const svg = await readFile(svgPath, 'utf8');
const browser = await chromium.launch({
  executablePath: process.env.SCHOOLDAY_CHROMIUM ?? undefined,
  args: ['--no-sandbox'],
});
const page = await browser.newPage({
  viewport: { width: +width, height: +(height ?? width) },
});
await page.setContent(
  `<style>html,body{margin:0;padding:0}svg{display:block;width:${width}px;height:${height ?? width}px}</style>${svg}`,
);
await writeFile(outPath, await page.screenshot({ omitBackground: true }));
await browser.close();
console.log('rendered', outPath);
