import { Request, Response } from 'express';
import { createShortUrl, getUrlByShortId, getUrlsByIp, countRecentUrlsByIp } from '../models/urlModel';
import { generateShortId } from '../utils/shorten';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function shortenUrl(req: Request, res: Response) {
  const { url } = req.body;
  const ip = req.ip;

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Optional enhancement: rate limiting
  const recent = await countRecentUrlsByIp(ip);
  if (recent >= 5) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  let shortId = generateShortId();
  // Ensure uniqueness (very low collision, but check)
  let existing = await getUrlByShortId(shortId);
  while (existing) {
    shortId = generateShortId();
    existing = await getUrlByShortId(shortId);
  }

  const record = await createShortUrl(url, shortId, ip);
  res.json({ shortUrl: `${BASE_URL}/r/${shortId}`, shortId, originalUrl: record.original_url });
}

export async function redirectUrl(req: Request, res: Response) {
  const { shortId } = req.params;
  const record = await getUrlByShortId(shortId);
  if (!record) return res.status(404).send('Not found');
  // For frontend "render", just return the URL instead of redirect
  if (req.query.render === 'true') {
    return res.json({ originalUrl: record.original_url });
  }
  res.redirect(record.original_url);
}

export async function listUrls(req: Request, res: Response) {
  const ip = req.ip;
  const urls = await getUrlsByIp(ip);
  res.json({ urls });
}
