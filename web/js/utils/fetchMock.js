/**
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function fetchMock(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}
