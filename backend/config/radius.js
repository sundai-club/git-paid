const { Account, Client, NewClient, NewAccount, withPrivateKey, 
  Address, AddressFromHex, Receipt, ABI, ABIFromJSON, Contract, NewContract, BytecodeFromHex } = require('@radiustechsystems/sdk');

// Initialize Radius client and account
let client;
let account;

// Initialize the Radius client and account
async function initializeRadius() {
  if (!client) {
    const RADIUS_ENDPOINT = process.env.RADIUS_API_URL;
    const PRIVATE_KEY = process.env.RADIUS_API_KEY;
    
    if (!RADIUS_ENDPOINT || !PRIVATE_KEY) {
      throw new Error('Radius API URL or API Key is missing. Please check environment variables.');
    }
    
    console.log('Initializing Radius client with endpoint:', RADIUS_ENDPOINT);
    client = await NewClient(RADIUS_ENDPOINT);
    account = await NewAccount(withPrivateKey(PRIVATE_KEY, client));
    console.log('Radius client initialized successfully');
  }
  return { client, account };
}

// Deploy a simple escrow contract
async function deployEscrowContract() {
  try {
    const { client, account } = await initializeRadius();
    
    // Simple escrow contract ABI and bytecode
    // This is a very basic escrow contract that allows the owner to release funds to a beneficiary
    const escrowAbi = ABIFromJSON(`[
      {"inputs":[{"name":"_beneficiary","type":"address"}],"stateMutability":"payable","type":"constructor"},
      {"inputs":[],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},
      {"inputs":[],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},
      {"inputs":[],"name":"beneficiary","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"}
    ]`);
    
    // This is a placeholder. In a real implementation, you would need the actual compiled bytecode of your contract
    const escrowBytecode = BytecodeFromHex('608060405260405161047f38038061047f833981810160405281019061002591906100a4565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505061010e565b600081519050610090816100f7565b92915050565b6000815190506100a5816100f7565b92915050565b6000602082840312156100ba57600080fd5b60006100c884828501610081565b91505092915050565b60006100dc82610096565b9050919050565b6100ec816100d1565b81146100f757600080fd5b50565b610101816100d1565b811461010c57600080fd5b50565b610362806101256000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80633ccfd60b14610051578063590e1ae31461005b578063be040fb014610065578063cf309012146100af575b600080fd5b6100596100f9565b005b6100636101ad565b005b61006d61026d565b60405180827dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100b7610293565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461015457600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f193505050501580156101b9573d6000803e3d6000fd5b50565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461020857600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f1935050505015801561026a573d6000803e3d6000fd5b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fea2646970667358221220d1f1b6b9ec756d7d3f2f2e5e1e15a9f47997fbcf5ca9e8a2c39ddade4362aac364736f6c63430006060033');
    
    console.log('Deploying escrow contract...');
    const deployedContract = await client.deployContract(account.signer, escrowBytecode, escrowAbi);
    console.log('Escrow contract deployed at:', deployedContract.address.hex());
    
    return deployedContract;
  } catch (error) {
    console.error('Error deploying escrow contract:', error);
    throw new Error('Failed to deploy escrow contract: ' + error.message);
  }
}

// Lock funds in escrow by transferring to the escrow contract
async function createEscrow(userId, amount) {
  try {
    const { client, account } = await initializeRadius();
    console.log('Creating escrow for user:', userId, 'amount:', amount);
    
    // In development mode, we'll use a mock implementation
    // if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_RADIUS === 'true') {
    //   const mockEscrowId = `escrow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    //   console.log('Created mock escrow with ID:', mockEscrowId);
    //   return mockEscrowId;
    // }
    
    // For production, we'll use the actual Radius integration
    // Convert amount to the smallest unit (wei equivalent)
    const amountInWei = BigInt(Math.floor(parseFloat(amount) * 10**18));
    
    // Get the user's address from our database or create a new address for the user
    // This is a placeholder - in a real implementation, you would have a way to map
    // user IDs to blockchain addresses
    const userAddressHex = process.env.RADIUS_ESCROW_ADDRESS || '0x1234567890123456789012345678901234567890';
    const escrowAddress = AddressFromHex(userAddressHex);
    
    console.log(`Transferring ${amount} tokens to escrow address ${userAddressHex}`);
    
    // Send funds to the escrow address
    const receipt = await account.send(client, escrowAddress, amountInWei);
    const txHash = receipt.txHash.hex();
    
    console.log('Funds transferred to escrow. Transaction hash:', txHash);
    
    return txHash; // Return the transaction hash as the escrow ID
  } catch (error) {
    console.error("Error creating escrow:", error);
    throw new Error("Failed to create escrow: " + error.message);
  }
}

// Release funds from escrow to the developer
async function releaseEscrow(escrowId, toId) {
  try {
    const { client, account } = await initializeRadius();
    console.log('Releasing escrow:', escrowId, 'to recipient:', toId);
    
    // In development mode, we'll use a mock implementation
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_RADIUS === 'true') {
      const mockTransactionId = `release_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      console.log('Created mock release transaction:', mockTransactionId);
      return {
        success: true,
        transaction: mockTransactionId
      };
    }
    
    // For production, we'll use the actual Radius integration
    // Get the recipient's address
    // This is a placeholder - in a real implementation, you would have a way to map
    // user IDs to blockchain addresses
    const recipientAddressHex = `0x${toId.padStart(40, '0')}`; // Simple conversion for demo
    const recipientAddress = AddressFromHex(recipientAddressHex);
    
    // Amount to release - in a real implementation, this would be stored with the escrow
    const amountToRelease = BigInt(1 * 10**18); // 1 token for demo
    
    console.log(`Transferring ${amountToRelease} tokens to recipient ${recipientAddressHex}`);
    
    // Send funds from the main account to the recipient
    const receipt = await account.send(client, recipientAddress, amountToRelease);
    const txHash = receipt.txHash.hex();
    
    console.log('Funds released to recipient. Transaction hash:', txHash);
    
    return {
      success: true,
      transaction: txHash
    };
  } catch (error) {
    console.error("Error releasing escrow:", error);
    throw new Error("Failed to release escrow: " + error.message);
  }
}

// Refund funds from escrow back to the owner
async function refundEscrow(escrowId, toId) {
  try {
    const { client, account } = await initializeRadius();
    console.log('Refunding escrow:', escrowId, 'to owner:', toId);
    
    // In development mode, we'll use a mock implementation
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_RADIUS === 'true') {
      const mockTransactionId = `refund_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      console.log('Created mock refund transaction:', mockTransactionId);
      return {
        success: true,
        transaction: mockTransactionId
      };
    }
    
    // For production, we'll use the actual Radius integration
    // Get the owner's address
    // This is a placeholder - in a real implementation, you would have a way to map
    // user IDs to blockchain addresses
    const ownerAddressHex = `0x${toId.padStart(40, '0')}`; // Simple conversion for demo
    const ownerAddress = AddressFromHex(ownerAddressHex);
    
    // Amount to refund - in a real implementation, this would be stored with the escrow
    const amountToRefund = BigInt(1 * 10**18); // 1 token for demo
    
    console.log(`Transferring ${amountToRefund} tokens to owner ${ownerAddressHex}`);
    
    // Send funds from the main account to the owner
    const receipt = await account.send(client, ownerAddress, amountToRefund);
    const txHash = receipt.txHash.hex();
    
    console.log('Funds refunded to owner. Transaction hash:', txHash);
    
    return {
      success: true,
      transaction: txHash
    };
  } catch (error) {
    console.error("Error refunding escrow:", error);
    throw new Error("Failed to refund escrow: " + error.message);
  }
}

module.exports = { createEscrow, releaseEscrow, refundEscrow, deployEscrowContract };
