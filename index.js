const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// YOUR CONFIGURATION
const API_KEY = process.env.API_KEY || 'J7Wyz0FHHUabV7CKL+06XcE06JV5ZstWtMVc4nzi8a23d0TDZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SWtvM1YzbDZNRVpJU0ZWaFlsWTNRMHRNS3pBMldHTkZNRFpLVmpWYWMzUlhkRTFXWXpSdWVtazRZVEl6WkRCVVJDSXNJbTkzYm1WeVNXUWlPaUl4TmpnNU9UZzJOREE1SWl3aVpYaHdJam94TnpVNU56YzFNVEkzTENKcFlYUWlPakUzTlRrM056RTFNamNzSW01aVppSTZNVGMxT1RjM01UVXlOMzAubkIzdURQUWVVMlo3azZnN3dLdks2eXpWZlUzNVdISTFXLUNMbVBILWdBT1B4NVZhSFMycFV6LTNZRno3VTBXcHYwYTA2d3FDLU1tOHlOS2IwY1NPWkZGM3hvODhsZzNUVXZUMV9fRlBfbzMtU0xnNGs0dVJjNXVtTXQxckV1UzFWZktkUVFsTnN4YzY0cl83RWl0SGc2aWxGd3BTazc3c0djN2RNYzY3a0N5U25JVERmTGl4dEU3VE1icXo1dkZCcU5oNEFSWUdMcHgzZHdQTFFLQXhvTjJmSUVOb2ZJelQ2ZmlpVmtUbURNRUZPeE5Oby12RXFIQWl6ZFFsZkt2eWxGNm9JSjRjMlRTclZCaC1uT0RBSlRqR1BlR2pvQW9xZzRqTDljZDE3UlBpUWVKcUlSOVpGck95NldpSTZrUFFEQmZrZVZMN0IxbW1TUkk4b2xCeExB';
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
    
    // Try the full resource path format
    const membershipPath = `groups/${GROUP_ID}/memberships/${userId}`;
    
    const response = await axios({
      method: 'PATCH',
      url: `https://apis.roblox.com/cloud/v2/${membershipPath}`,
      data: { 
        path: membershipPath,
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
      status: error.response?.status,
      fullError: error
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
