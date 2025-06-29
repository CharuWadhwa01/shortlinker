import pool from './db';

export async function createShortUrl(originalUrl: string, shortId: string, ip: string) {
  const result = await pool.query(
    `INSERT INTO urls (original_url, short_id, created_at, ip) VALUES ($1, $2, NOW(), $3) RETURNING *`,
    [originalUrl, shortId, ip]
  );
  return result.rows[0];
}

export async function getUrlByShortId(shortId: string) {
  const result = await pool.query(
    `SELECT * FROM urls WHERE short_id = $1`,
    [shortId]
  );
  return result.rows[0];
}

export async function getUrlsByIp(ip: string) {
  const result = await pool.query(
    `SELECT * FROM urls WHERE ip = $1 ORDER BY created_at DESC LIMIT 20`,
    [ip]
  );
  return result.rows;
}

export async function countRecentUrlsByIp(ip: string) {
  const result = await pool.query(
    `SELECT COUNT(*) FROM urls WHERE ip = $1 AND created_at > NOW() - INTERVAL '1 minute'`,
    [ip]
  );
  return parseInt(result.rows[0].count, 10);
}
