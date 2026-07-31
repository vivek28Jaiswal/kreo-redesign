import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function recolorScreen() {
  const inputPath = path.resolve('C:/Users/dipwa/.gemini/antigravity-ide/brain/0dcc1be4-0174-40ab-94ef-e85716e77cb4/scratch/extracted_screen.png');
  const outputPath = path.resolve('public/images/screen-purple.png');

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);

  // Iterate over pixels (RGB/RGBA)
  const channels = info.channels;
  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Check if pixel is in the orange/yellow/amber family:
    // Orange has high Red, medium Green, low Blue (e.g., R > 150, G: 50-200, B < 120)
    // Or if R > G and G > B and R > 100
    if (r > 120 && r > b + 40 && g > b) {
      // Map orange intensity to rich purple / lavender
      // Light orange -> bright soft lavender (#d8b4fe / #c084fc)
      // Deep orange -> rich deep purple (#8b5cf6 / #7c3aed)
      const brightness = (r * 0.5 + g * 0.5) / 255;
      
      // Interpolate between deep violet (#6b21a8) and bright lavender (#e9d5ff)
      pixels[i] = Math.round(107 + brightness * (233 - 107));     // Red
      pixels[i + 1] = Math.round(33 + brightness * (213 - 33));   // Green
      pixels[i + 2] = Math.round(168 + brightness * (255 - 168)); // Blue
    }
  }

  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
  .png()
  .toFile(outputPath);

  console.log('Saved recolored screen texture to', outputPath);
}

recolorScreen().catch(console.error);
