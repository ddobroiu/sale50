// lib/dpd.ts
const BASE_URL = 'https://api.dpd.ro/v1';

export type DpdCredentials = {
  userName: string;
  password: string;
  language?: 'RO' | 'EN';
};

function getCreds(): DpdCredentials {
  const userName = process.env.DPD_USERNAME;
  const password = process.env.DPD_PASSWORD;
  if (!userName || !password) throw new Error('DPD credentials missing');
  return { userName, password, language: 'RO' };
}

async function dpdFetch(path: string, body: any) {
  const creds = getCreds();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ ...creds, ...body }),
  });
  if (res.headers.get('content-type')?.includes('application/json')) {
    return { ok: res.ok, status: res.status, data: await res.json() };
  }
  return { ok: res.ok, status: res.status, text: await res.text() };
}

let _cachedSites: any[] | null = null;

export async function getAllSitesRO() {
  if (_cachedSites) return _cachedSites;
  
  const res = await dpdFetch('/location/site/csv/642', {}); // 642 = Romania
  if (!res.ok || !res.text) return [];
  
  const rows = res.text.trim().split('\n').map(r => r.split(','));
  if (rows.length < 2) return [];
  
  const header = rows[0].map(h => h.trim().toLowerCase());
  const nameIdx = header.indexOf('name');
  const regionIdx = header.indexOf('region');
  const postCodeIdx = header.indexOf('postcode');
  const idIdx = header.indexOf('id');

  _cachedSites = rows.slice(1).map(cols => ({
    id: parseInt(cols[idIdx]),
    name: (cols[nameIdx] || '').trim(),
    region: (cols[regionIdx] || '').trim(),
    postCode: (cols[postCodeIdx] || '').trim()
  })).filter(s => !!s.id && !!s.name);

  return _cachedSites;
}


// Oblio Integration
export async function getOblioAccessToken() {
  const r = await fetch('https://www.oblio.eu/api/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: process.env.OBLIO_CLIENT_ID, client_secret: process.env.OBLIO_CLIENT_SECRET }),
  });
  const d = await r.json();
  return d.access_token;
}

export async function createOblioInvoice(payload: any, token: string) {
  const r = await fetch('https://www.oblio.eu/api/docs/invoice', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return r.json();
}
