const memoryStore = globalThis.__GESTAO360_MEMORY__ || new Map();
globalThis.__GESTAO360_MEMORY__ = memoryStore;

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(body));
}

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
  return { url: url.replace(/\/$/, ''), token };
}

async function redisCommand(command) {
  const { url, token } = getRedisConfig();
  if (!url || !token) return null;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Redis ${response.status}: ${text}`);
  }

  const payload = await response.json();
  if (payload && payload.error) throw new Error(payload.error);
  return payload ? payload.result : null;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const key = String(req.query?.key || '').trim();
      if (!key) return json(res, 400, { error: 'Parâmetro key é obrigatório.' });

      let value = await redisCommand(['GET', key]);
      if (value == null && memoryStore.has(key)) value = memoryStore.get(key);
      return json(res, 200, { value: value ?? null });
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) { body = null; }
      }

      const key = String(body?.key || '').trim();
      const value = body?.value;
      if (!key) return json(res, 400, { error: 'Campo key é obrigatório.' });
      if (value === undefined) return json(res, 400, { error: 'Campo value é obrigatório.' });

      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      const persisted = await redisCommand(['SET', key, serialized]);
      if (persisted == null) memoryStore.set(key, serialized);

      return json(res, 200, {
        ok: true,
        persisted: persisted != null,
        storage: persisted != null ? 'redis' : 'memory-fallback'
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Método não permitido.' });
  } catch (error) {
    return json(res, 500, { error: 'Falha ao acessar a base de dados.', detail: String(error?.message || error) });
  }
};
