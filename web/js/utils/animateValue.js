/**
 * Animate a number from 0 → target over duration ms.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} [duration=800]
 * @param {(n: number) => string} [format]
 */
export function animateCounter(el, target, duration = 800, format = (n) => `${Math.round(n)}`) {
  const start = performance.now();
  const from = 0;
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = format(from + (target - from) * eased);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/**
 * Animate bar width after mount.
 * @param {HTMLElement} bar
 * @param {number} pct 0–100
 */
export function animateBarWidth(bar, pct) {
  bar.style.width = "0%";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.width = `${Math.min(100, pct)}%`;
    });
  });
}
