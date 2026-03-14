export default async function handler(req, res) {
  // 允许跨域（CORS）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scene, duration, style } = req.body;
    
    const response = await fetch('https://api.coze.cn/open_api/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COZE_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        bot_id: process.env.COZE_BOT_ID,
        user: 'web_user_' + Date.now(),
        query: `${scene}，${duration}秒，${style}风格`,
        stream: false,
        custom_variables: { duration, style }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
