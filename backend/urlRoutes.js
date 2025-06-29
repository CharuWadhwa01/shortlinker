import { Router } from 'express';
import { shortenUrl, redirectUrl, listUrls } from '../controllers/urlController';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/r/:shortId', redirectUrl);
router.get('/list', listUrls);

export default router;
