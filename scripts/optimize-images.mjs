import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const dir = join(process.cwd(), "public", "books");

async function run() {
  const files = readdirSync(dir);
  for (const file of files) {
    const full = join(dir, file);
    if (!statSync(full).isFile()) continue;
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const before = statSync(full).size;
    if (before < 400 * 1024) continue;
    const isPng = file.toLowerCase().endsWith(".png");
    const outPath = isPng ? full.replace(/\.png$/i, ".jpg") : full;
    let img = sharp(full).rotate();
    const meta = await img.metadata();
    if ((meta.width ?? 0) > 1200) {
      img = img.resize({ width: 1200, withoutEnlargement: true });
    }
    const buf = await img.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    const after = buf.length;
    const tmp = outPath + ".tmp.jpg";
    const { writeFileSync, rmSync, renameSync, unlinkSync } = await import("fs");
    writeFileSync(tmp, buf);
    if (outPath !== full) rmSync(full, { force: true });
    rmSync(outPath, { force: true });
    renameSync(tmp, outPath);
    console.log(`${file}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024).toFixed(0)}KB`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
