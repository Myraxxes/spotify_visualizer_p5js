require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const querystring = require('querystring');

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.static(path.join(__dirname, 'public')));


// TOKEN LOGIC
let appAccessToken = null;
let tokenExpiresAt = 0;

async function getAppToken() {
  const now = Date.now();

  // reuse token if still valid
  if (appAccessToken && now < tokenExpiresAt) {
    return appAccessToken;
  }

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    querystring.stringify({
      grant_type: 'client_credentials',
    }),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  appAccessToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;

  return appAccessToken;
}

// SEARCH
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    const token = await getAppToken();

    const response = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 5,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('Search error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});