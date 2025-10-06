const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const GROUP_ID = 34272721;

app.get('/', (req, res) => {
  res.send('Ranking server is working!');
});

app.post('/setrank', async (req, res) => {
  console.log('Received setrank request:', req.body);
  
  try {
    const { userId, roleId, apiKey } = req.body;
    
    if (!userId || !roleId || !apiKey) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }
    
    if (apiKey !== process.env.GAME_SECRET) {
      return res.status(403).json({ success: false, error: 'Invalid API key' });
    }
    
    console.log(`Attempting to rank user ${userId} to role ${roleId}`);
    
    // Use PATCH with the membership resource path
    const response = await axios({
      method: 'PATCH',
      url: `https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/memberships/${userId}`,
      data: {
        role: `groups/${GROUP_ID}/roles/${roleId}`
      },
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Roblox API response:', response.data);
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Ranking server running on port ' + PORT);
});
