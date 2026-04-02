const PIXEL_ID = '1558392138553435';
const ACCESS_TOKEN = 'EAAQjs5iKBGsBRMJpfTdZAlbJutrVJXpnFUFjTzj7ZCPNPwGDMAZAcCZCEF1FlphYhxJ4NwcU42CNFXYEYA3hfmvl8qnqXFZCvbxKf9xvZC4Ykj8kZBgauHhfBLqdZAXuQlvagzawtepS4aabc9epFf1coRXKddZAl1bsUTtpmZAnhNl9p0NU46YiYEpZBDcjE5Js66RDgZDZD';
const API_VERSION = 'v21.0';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://helenarodriguez.site');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_name, event_id, event_source_url, user_data } = req.body;

    if (!event_name || !event_id) {
      return res.status(400).json({ error: 'event_name and event_id are required' });
    }

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url: event_source_url || 'https://helenarodriguez.site',
          action_source: 'website',
          user_data: user_data || {}
        }
      ]
    };

    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', result);
      return res.status(response.status).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('CAPI Error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
