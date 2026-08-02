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

function replaceRuntimeOdometer(html, values) {
  let output = html;

  for (const [id, value] of Object.entries(values)) {
    const spanPattern = new RegExp(
      `<span\\b(?=[^>]*\\bid=["']${id}["'])(?=[^>]*\\bclass=["'][^"']*\\bodometer\\b[^"']*["'])[^>]*>\\s*<\\/span>`,
      "g"
    );
    output = output.replace(
      spanPattern,
      `<span id="${id}" data-runtime-static="true">${value}</span>`
    );
  }

  return output;
}

function getFooterConfig() {
  const themeConfig = hexo.theme && hexo.theme.config ? hexo.theme.config : {};
  return themeConfig.footer || {};
}

hexo.extend.filter.register("after_render:html", (html) => {
  const footerConfig = getFooterConfig();
  if (footerConfig.runtime !== true) return html;

  if (
    !html.includes('id="runtime_days"') &&
    !html.includes("id='runtime_days'")
  ) {
    return html;
  }
  const values = getRuntimeParts(footerConfig.start);
  return replaceRuntimeOdometer(html, values);
});
