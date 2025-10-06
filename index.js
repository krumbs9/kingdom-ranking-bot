const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// YOUR CONFIGURATION
const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE';
const GROUP_ID = 34272721;

// Test endpoint
app.get('/', (req, res) => {
  res.send('Ranking server is working!');
});

// Endpoint to change ranks
app.post('/setrank', async (req, res) => {
  console.log('Received setrank request:', req.body);
  
  try {
    const { userId, roleId, apiKey } = req.body;
    
    if (!userId || !roleId || !apiKey) {
      console.log('Missing parameters');
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }
    
    if (apiKey !== process.env.GAME_SECRET) {
      console.log('Invalid game secret');
      return res.status(403).json({ success: false, error: 'Invalid API key' });
    }
    
    console.log(`Attempting to rank user ${userId} to role ${roleId}`);
    
    const response = await axios.patch(
      `https://apis.roblox.com/cloud/v2/groups/${GROUP_ID}/memberships/user_${userId}`,
      { roleId: roleId },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
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
