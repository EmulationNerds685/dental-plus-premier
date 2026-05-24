import sharp from "sharp";

sharp("src/assets/DP_Logo.png")
  .resize(64, 64)
  .png()
  .toFile("src/assets/optimized/DP_Logo_favicon.png")
  .then(() => console.log("Favicon created!"))
  .catch(console.error);
