/**
 * Mount a chart after layout; show fallback on failure.
 * @param {HTMLCanvasElement} canvas
 * @param {() => Promise<(() => void) | void>} mountFn
 * @param {string} label
 * @returns {Promise<(() => void) | void>}
 */
export async function mountChartWhenReady(canvas, mountFn, label) {
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const wrap = canvas.parentElement;
  if (wrap && !wrap.style.height) {
    wrap.style.height = `${wrap.getBoundingClientRect().height || 260}px`;
  }

  try {
    return await mountFn(canvas);
  } catch (err) {
    console.error(`[CardioFL] Chart "${label}" failed:`, err);
    if (wrap) {
      const note = document.createElement("p");
      note.className = "text-muted text-sm";
      note.style.padding = "var(--space-4)";
      note.textContent = `Could not render ${label}. Reload the page or check Chart.js.`;
      wrap.appendChild(note);
    }
    return undefined;
  }
}
