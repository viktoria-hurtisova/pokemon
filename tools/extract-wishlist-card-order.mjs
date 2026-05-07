import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "wishlist.html"), "utf8");
const match = html.match(/const CARDS = \[([\s\S]*?)\n\];/);
if (!match) throw new Error("CARDS block not found in wishlist.html");
const cardIds = [];
for (const line of match[1].split("\n")) {
  const slug = line.match(/setSlug: "([^"]+)"/);
  const num = line.match(/number: "([^"]+)"/);
  if (slug && num) cardIds.push(`${slug[1]}-${num[1]}`);
}
const outPath = path.join(root, "wishlist-card-order.json");
fs.writeFileSync(outPath, JSON.stringify({ cardIds }, null, 2) + "\n");
console.log("Wrote", cardIds.length, "ids to wishlist-card-order.json");
try {
  const meta = JSON.parse(fs.readFileSync(path.join(root, "lists-meta.json"), "utf8"));
  const wl = meta.lists?.find((x) => x.id === "wishlist");
  if (wl && wl.total !== cardIds.length) {
    console.warn(
      `lists-meta.json wishlist total is ${wl.total} but CARDS has ${cardIds.length} entries — update lists-meta.json "total" to ${cardIds.length}.`
    );
  }
} catch (_) {}
