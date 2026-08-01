const fs = require("fs");
const path = require("path");

const FALLBACK_START_TIME = "2026/07/29 00:00:00";

function getRuntimeParts(startTime) {
  const startDate = new Date(startTime || FALLBACK_START_TIME);
  const diff = Date.now() - startDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const daysFloat = diff / dayMs;
  const days = Math.floor(daysFloat);
  const hoursFloat = (daysFloat - days) * 24;
  const hours = Math.floor(hoursFloat);
  const minutesFloat = (hoursFloat - hours) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.floor((minutesFloat - minutes) * 60);

  return {
    runtime_days: days,
    runtime_hours: hours,
    runtime_minutes: minutes,
    runtime_seconds: seconds,
  };
}

function walkHtmlFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function replaceRuntimeOdometer(html, values) {
  let output = html;

  for (const [id, value] of Object.entries(values)) {
    const spanPattern = new RegExp(
      `<span\\b(?=[^>]*\\bid=["']${id}["'])(?=[^>]*\\bclass=["'][^"']*\\bodometer\\b[^"']*["'])[^>]*>\\s*<\\/span>`,
      "g"
    );
    output = output.replace(spanPattern, `<span id="${id}">${value}</span>`);
  }

  return output;
}

hexo.on("generateAfter", () => {
  const themeConfig = hexo.theme && hexo.theme.config ? hexo.theme.config : {};
  const footerConfig = themeConfig.footer || {};

  if (footerConfig.runtime !== true) return;

  const values = getRuntimeParts(footerConfig.start);
  const publicDir = hexo.public_dir;

  for (const htmlFile of walkHtmlFiles(publicDir)) {
    const original = fs.readFileSync(htmlFile, "utf8");
    const updated = replaceRuntimeOdometer(original, values);
    if (updated !== original) {
      fs.writeFileSync(htmlFile, updated);
    }
  }
});
