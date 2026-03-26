type AdminSession = {
    role: 'admin';
    iat: number; // ms
    exp: number; // ms
};

function getSecret() {
    return process.env.ADMIN_PANEL_SECRET || "sale50_admin_secret_9988";
}

// Simple text encoder for Base64URL
function toBase64Url(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64Url(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return atob(str);
}

// In Next.js Middleware/Edge, we can't use node:crypto hmac easily with simple strings synchronously, 
// so we'll use a very basic salt + base64 encoding for the "session" in this specific case, 
// OR use SubtleCrypto for properly signed JWT.

// Let's use a simpler approach for the middleware: skip hashing if we don't have crypto, 
// BUT SubtleCrypto is globally available on Edge.

async function hmacSha256(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
        'raw', encoder.encode(key),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['sign']
    );
    const signature = await crypto.subtle.sign(
        'HMAC', cryptoKey, encoder.encode(data)
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function signAdminSession(ttlMs = 7 * 24 * 60 * 60 * 1000) {
    const payload: AdminSession = { role: 'admin', iat: Date.now(), exp: Date.now() + ttlMs };
    const data = toBase64Url(JSON.stringify(payload));
    const h = await hmacSha256(getSecret(), data);
    return `${data}.${h}`;
}

export async function verifyAdminSession(token: string | undefined | null): Promise<AdminSession | null> {
    try {
        if (!token) return null;
        const [data, sig] = token.split('.');
        if (!data || !sig) return null;
        const expected = await hmacSha256(getSecret(), data);
        if (sig !== expected) return null;
        
        const payload = JSON.parse(fromBase64Url(data)) as AdminSession;
        if (payload.exp < Date.now()) return null;
        if (payload.role !== 'admin') return null;
        return payload;
    } catch {
        return null;
    }
}
