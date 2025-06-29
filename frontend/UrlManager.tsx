import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Link, List, ListItem, Paper } from '@mui/material';

type UrlEntry = {
  id: number;
  original_url: string;
  short_id: string;
  created_at: string;
};

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const App: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [sessionUrls, setSessionUrls] = useState<UrlEntry[]>([]);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionUrls = async () => {
    const res = await axios.get(`${API_BASE}/list`, { withCredentials: true });
    setSessionUrls(res.data.urls);
  };

  useEffect(() => {
    fetchSessionUrls();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setShortUrl(null);
      const res = await axios.post(`${API_BASE}/shorten`, { url: inputUrl });
      setShortUrl(res.data.shortUrl);
      setInputUrl('');
      fetchSessionUrls();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    }
  };

  const handleRenderClick = async (shortId: string) => {
    try {
      setError(null);
      setRenderedUrl(null);
      const res = await axios.get(`${API_BASE}/r/${shortId}?render=true`);
      setRenderedUrl(res.data.originalUrl);
    } catch {
      setError('Failed to render URL');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <form onSubmit={handleShorten}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Enter a long URL"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            required
          />
          <Button variant="contained" type="submit">Shorten</Button>
        </Box>
      </form>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      {shortUrl && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography>Shortened URL:</Typography>
          <Link href={shortUrl} target="_blank" rel="noopener">{shortUrl}</Link>
        </Paper>
      )}
      <Typography variant="h6" sx={{ mt: 4 }}>Your Shortened URLs (this session)</Typography>
      <List>
        {sessionUrls.map(u => (
          <ListItem key={u.short_id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Link href="#" onClick={() => handleRenderClick(u.short_id)}>
                {API_BASE.replace('/api', '') + '/r/' + u.short_id}
              </Link>
              <Typography variant="body2" color="textSecondary">{u.original_url}</Typography>
            </Box>
          </ListItem>
        ))}
      </List>
      {renderedUrl && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography>Rendered URL:</Typography>
          <iframe src={renderedUrl} title="Rendered" style={{ width: '100%', height: 400, border: 0 }}></iframe>
        </Paper>
      )}
    </Box>
  );
};

export default App;
