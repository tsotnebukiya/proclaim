import { createThirdwebClient, defineChain } from 'thirdweb';
import { prepareDirectDeployTransaction } from 'thirdweb/contract';
import { privateKeyAccount } from 'thirdweb/wallets';
import { bytecode } from './bytecode';

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

type DeployProps = {
  market: string;
  account: number;
  publicKey: string;
};

export const deployContract = ({ account, market, publicKey }: DeployProps) => {
  return prepareDirectDeployTransaction({
    chain: proChain,
    client,
    bytecode: bytecode,
    constructorAbi: {
      inputs: [
        {
          internalType: 'address',
          name: 'depositoryContractAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'market',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'accountNumber',
          type: 'uint256',
        },
        {
          internalType: 'string',
          name: 'publicKey',
          type: 'string',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    constructorParams: [
      process.env.PROCHAIN_DEPOSITORY_CONTRACT,
      market,
      account,
      publicKey,
    ],
  });
};
