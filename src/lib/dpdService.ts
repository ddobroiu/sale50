const BASE_URL = 'https://api.dpd.ro/v1';

export type DpdCredentials = {
  userName: string;
  password: string;
  language?: 'RO' | 'EN';
};

function getCreds(): DpdCredentials {
  const userName = process.env.DPD_USERNAME;
  const password = process.env.DPD_PASSWORD;
  if (!userName || !password) {
    // Fallback to empty to avoid crash if not set yet, but it should be set
    return { userName: '', password: '', language: 'RO' };
  }
  return { userName, password, language: 'RO' };
}

async function dpdFetchCsv(path: string, body?: any) {
  const creds = getCreds();
  if (!creds.userName) return { ok: false, status: 401, text: '' };
  
  const payload = { ...creds, ...(body || {}) };
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

export type DpdSiteRow = {
  id: number;
  name: string;
  municipality?: string;
  region?: string;
  postCode?: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  const n = text.length;
  let cell = '';
  let row: string[] = [];
  let inQuotes = false;
  while (i < n) {
    const ch = text[i++];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += ch;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export async function getAllSitesRO(): Promise<DpdSiteRow[]> {
  const { ok, text, status } = await dpdFetchCsv('/location/site/csv/642');
  if (!ok || !text) return [];
  const rows = parseCsv(text.trim());
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  const idx = (name: string) => header.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const idIdx = idx('id');
  const nameIdx = idx('name');
  const municipalityIdx = idx('municipality');
  const regionIdx = idx('region');
  const postCodeIdx = idx('postCode');
  const out: DpdSiteRow[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const idStr = cols[idIdx] || '';
    const id = parseInt(idStr, 10);
    if (!Number.isFinite(id)) continue;
    const name = (cols[nameIdx] || '').trim();
    const municipality = (cols[municipalityIdx] || '').trim() || undefined;
    const region = (cols[regionIdx] || '').trim() || undefined;
    const postCode = (cols[postCodeIdx] || '').trim() || undefined;
    out.push({ id, name, municipality, region, postCode });
  }
  return out;
}
