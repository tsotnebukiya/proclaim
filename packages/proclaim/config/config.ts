import { createThirdwebClient, defineChain, getRpcClient } from 'thirdweb';
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

export const request = getRpcClient({ client, chain: proChain });

export const wallet = privateKeyAccount({
  client,
  privateKey: process.env.PROCHAIN_PRIVATE_KEY!,
});

type DeployProps = {
  market: string;
  account: number;
  publicKey: string;
  teamName: string;
};

export const deployContract = ({
  account,
  market,
  publicKey,
  teamName,
}: DeployProps) => {
  return prepareDirectDeployTransaction({
    chain: proChain,
    client,
    bytecode: bytecode,
    constructorAbi: {
      type: 'constructor',
      name: '',
      inputs: [
        {
          type: 'address',
          name: 'depositoryContractAddress',
          internalType: 'address',
        },
        {
          type: 'string',
          name: 'market',
          internalType: 'string',
        },
        {
          type: 'uint256',
          name: 'accountNumber',
          internalType: 'uint256',
        },
        {
          type: 'string',
          name: 'publicKey',
          internalType: 'string',
        },
        {
          type: 'string',
          name: 'contractName',
          internalType: 'string',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    constructorParams: [
      process.env.PROCHAIN_DEPOSITORY_CONTRACT,
      market,
      account,
      publicKey,
      teamName,
    ],
  });
};
