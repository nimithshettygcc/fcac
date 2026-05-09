// On production (firestonecompleteautocare.com) requests are same-origin — no CORS needed.
// On localhost the dev proxy (port 3001) forwards /bsro/services/* to production.
const { hostname } = window.location;
const BSRO_BASE = (
  hostname === 'www.firestonecompleteautocare.com'
  || hostname === 'localhost'
  || hostname === '127.0.0.1'
) ? '' : 'https://www.firestonecompleteautocare.com';

const LOCAL_DEFAULT_STORE = '303598';

function readCookie(name) {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.split('=').slice(1).join('='));
}

export function getStoredStoreNumber() {
  try {
    const raw = readCookie('bsro.cp');
    if (raw) {
      const data = JSON.parse(raw);
      return data?.main?.storeNumber ?? data?.storeNumber ?? null;
    }
  } catch { /* ignore */ }
  const isLocal = window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1';
  return isLocal ? LOCAL_DEFAULT_STORE : null;
}

export async function fetchStoreByNumber(storeNumber) {
  const res = await fetch(
    `${BSRO_BASE}/bsro/services/store/set-store-by-store-number?storeNumber=${encodeURIComponent(storeNumber)}`,
  );
  if (!res.ok) throw new Error(`Store API ${res.status}`);
  return res.json();
}

export async function saveMyStore(storeNumber, zipCode) {
  const url = new URL(`${BSRO_BASE}/bsro/services/store/save-mystore`);
  url.searchParams.set('storeNumber', storeNumber);
  url.searchParams.set('zipCode', zipCode);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Save-store API ${res.status}`);
  return res.json();
}

export async function fetchCartStatus() {
  const res = await fetch(
    `${BSRO_BASE}/bsro/services/store/cart-empty-icon-global-web-bsro`,
  );
  if (!res.ok) throw new Error(`Cart API ${res.status}`);
  return res.json();
}

export async function fetchReviewSummaries(productId) {
  const res = await fetch(
    `${BSRO_BASE}/bsro/services/reviews/get-review-summaries-by-product-ids?id=${encodeURIComponent(productId)}`,
  );
  if (!res.ok) throw new Error(`Reviews API ${res.status}`);
  return res.json();
}
