import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const photosDir = join(process.cwd(), "photos");
const publicImagesDir = join(process.cwd(), "public", "images");

if (!existsSync(photosDir)) {
  console.log("photos/ folder not found, skipping copy.");
  process.exit(0);
}

mkdirSync(publicImagesDir, { recursive: true });

const photos = readdirSync(photosDir).filter((file) =>
  /\.(jpg|jpeg|png|webp)$/i.test(file)
);

for (const photo of photos) {
  cpSync(join(photosDir, photo), join(publicImagesDir, photo), { force: true });
}

console.log(`Copied ${photos.length} photos to public/images/`);
