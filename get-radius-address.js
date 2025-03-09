// Simple script to get your Radius address from your private key
require('dotenv').config();
const { NewClient, NewAccount, withPrivateKey, Account } = require('@radiustechsystems/sdk');

async function getRadiusAddress() {
  try {
    const RADIUS_ENDPOINT = process.env.RADIUS_API_URL;
    const PRIVATE_KEY = process.env.RADIUS_API_KEY;
    
    if (!RADIUS_ENDPOINT || !PRIVATE_KEY) {
      console.error('Error: Radius API URL or API Key is missing in .env file');
      return;
    }
    
    console.log('Initializing Radius client with endpoint:', RADIUS_ENDPOINT);
    const client = await NewClient(RADIUS_ENDPOINT);
    const account = await NewAccount(withPrivateKey(PRIVATE_KEY, client));
    
    console.log('Your Radius wallet address:', account.address.hex());
    console.log('This is the address you need to fund with testnet tokens');
  } catch (error) {
    console.error('Error getting Radius address:', error);
  }
}

getRadiusAddress();
