import Redis from "ioredis";

// Prefixo pra não misturar com dados de outros projetos que usem o mesmo banco Redis.
const PREFIXO = "controle-caixa:";

// Reaproveita a conexão entre chamadas "quentes" da função serverless.
let redis;
function getRedis() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL não está definida nas variáveis de ambiente deste projeto no Vercel");
    }
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export default async function handler(req, res) {
  try {
    const client = getRedis();

    if (req.method === "GET") {
      const key = req.query.key;
      if (!key) {
        res.status(400).json({ error: "faltou o parâmetro key" });
        return;
      }
      const valor = await client.get(PREFIXO + key);
      res.status(200).json({ value: valor ?? null });
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const key = body?.key;
      if (!key) {
        res.status(400).json({ error: "faltou key" });
        return;
      }
      await client.set(PREFIXO + key, body?.value ?? "");
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "método não permitido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "erro ao acessar o banco de dados: " + (err?.message || String(err)),
    });
  }
}
