import { createThirdwebClient, defineChain } from 'thirdweb';
import { privateKeyAccount } from 'thirdweb/wallets';

export const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export const proChain = defineChain({
  id: parseInt(process.env.PROCHAIN_ID!),
  rpc: process.env.PROCHAIN_RPC_URL,
  testnet: true,
});

export const wallet = privateKeyAccount({
  client,
  privateKey: process.env.PROCHAIN_PRIVATE_KEY!,
});
