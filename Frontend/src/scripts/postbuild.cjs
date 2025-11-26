const fs = require("fs");
const path = require("path");
const dist = path.resolve(__dirname, "../../dist");
const src = path.join(dist, "index.html");
const dst = path.join(dist, "404.html");
try {
  const html = fs.readFileSync(src);
  fs.writeFileSync(dst, html);
  process.stdout.write("Created dist/404.html for SPA fallback\n");
} catch (e) {
  process.stderr.write("postbuild failed: " + e.message + "\n");
  process.exitCode = 1;
}
