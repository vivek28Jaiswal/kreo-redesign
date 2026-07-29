import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function extractKeyboard() {
  const inputPath = path.resolve('designs-img/image.png');
  const outputDir = path.resolve('public/images');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const metadata = await sharp(inputPath).metadata();

  // Fine-tune crop box to exclude the original price badge on the right:
  const left = Math.round(metadata.width * 0.38);
  const top = Math.round(metadata.height * 0.14);
  const width = Math.round(metadata.width * 0.23);
  const height = Math.round(metadata.height * 0.76);

  // Crop around keyboard
  const croppedBuffer = await sharp(inputPath)
    .extract({ left, top, width, height })
    .toBuffer();

  // Extract raw pixel data to set white background to transparent
  const { data, info } = await sharp(croppedBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = new Uint8ClampedArray(data.buffer);
  
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    
    // If pixel is near-white (background of keyboard image)
    if (r > 248 && g > 248 && b > 248) {
      pixelData[i + 3] = 0; // fully transparent
    } else if (r > 240 && g > 240 && b > 240) {
      // smooth alpha transition for edges
      const avg = (r + g + b) / 3;
      pixelData[i + 3] = Math.round(((255 - avg) / 15) * 255);
    }
  }

  await sharp(Buffer.from(pixelData.buffer), {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    }
  })
  .png()
  .toFile(path.join(outputDir, 'keyboard.png'));

  console.log('Successfully re-saved cleaned public/images/keyboard.png');
}

extractKeyboard().catch(err => {
  console.error('Error extracting keyboard:', err);
});
