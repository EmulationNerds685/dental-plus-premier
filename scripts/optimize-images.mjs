/**
 * Image Optimization Script for Dental Plus
 * Converts large PNG/JPG images to compressed WebP format.
 * 
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const ASSETS_DIR = path.resolve("src/assets");
const OUTPUT_DIR = path.resolve("src/assets/optimized");
const MAX_WIDTH = 1920;       // Max width in px (plenty for web)
const WEBP_QUALITY = 80;      // 80% is visually lossless for photos
const JPEG_QUALITY = 82;      // Fallback quality for JPEGs
const SIZE_THRESHOLD_KB = 200; // Only optimize files > 200KB

async function optimizeImages() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ASSETS_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".png", ".jpg", ".jpeg"].includes(ext) && !fs.statSync(path.join(ASSETS_DIR, f)).isDirectory();
  });

  console.log(`\n🦷 Dental Plus Image Optimizer`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Found ${files.length} images to process\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  const results = [];

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    // Skip small files
    if (originalSize < SIZE_THRESHOLD_KB * 1024) {
      console.log(`⏭  ${file} (${formatSize(originalSize)}) — already small, skipping`);
      // Just copy as-is for small files
      const smallOutputPath = path.join(OUTPUT_DIR, `${baseName}${path.extname(file)}`);
      fs.copyFileSync(inputPath, smallOutputPath);
      totalOptimized += originalSize;
      results.push({ file, original: originalSize, optimized: originalSize, saved: 0 });
      continue;
    }

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      // Resize if wider than MAX_WIDTH, maintain aspect ratio
      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      // Convert to WebP
      await pipeline
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toFile(outputPath);

      const optimizedSize = fs.statSync(outputPath).size;
      totalOptimized += optimizedSize;
      const savedPercent = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(
        `✅ ${file.padEnd(30)} ${formatSize(originalSize).padStart(10)} → ${formatSize(optimizedSize).padStart(10)}  (${savedPercent}% smaller)`
      );
      results.push({ file, original: originalSize, optimized: optimizedSize, saved: parseFloat(savedPercent) });
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Total Original:  ${formatSize(totalOriginal)}`);
  console.log(`📊 Total Optimized: ${formatSize(totalOptimized)}`);
  console.log(`🎉 Total Saved:     ${formatSize(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  console.log(`\n📂 Optimized images saved to: ${OUTPUT_DIR}\n`);

  return results;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

optimizeImages().catch(console.error);
