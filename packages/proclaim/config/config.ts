import {
  createThirdwebClient,
  defineChain,
  eth_getTransactionCount,
  getRpcClient,
  isHex,
  prepareTransaction,
} from 'thirdweb';
import { PrepareDirectDeployTransactionOptions } from 'thirdweb/contract';
import { AbiParameter, AbiStateMutability, concatHex } from 'viem';
import { privateKeyAccount } from 'thirdweb/wallets';
import { bytecode } from './bytecode';
import { eth_gasPrice } from 'thirdweb/rpc';
import { encodeAbiParameters, ensureBytecodePrefix } from 'thirdweb/utils';

export const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

export const proChain = defineChain({
  id: parseInt(process.env.PROCHAIN_ID!),
  rpc: process.env.PROCHAIN_RPC_URL,
  testnet: true,
});
const rpc = getRpcClient({ client, chain: proChain });

export const getGasPrice = async () => {
  return await eth_gasPrice(rpc);
};

export const request = getRpcClient({ client, chain: proChain });

export const wallet = privateKeyAccount({
  client,
  privateKey: process.env.PROCHAIN_PRIVATE_KEY!,
});

export const getLatestNonce = async () => {
  return await eth_getTransactionCount(rpc, {
    address: wallet.address,
    blockTag: 'pending',
  });
};

type DeployProps = {
  market: string;
  account: number;
  publicKey: string;
  teamName: string;
  gasPrice: bigint;
};

type AbiConstructor = {
  type: 'constructor';
  inputs: readonly AbiParameter[];
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * @see https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean | undefined;
  stateMutability: Extract<AbiStateMutability, 'payable' | 'nonpayable'>;
};

function prepareDirectDeployTransaction<
  const TConstructor extends AbiConstructor,
>(
  options: PrepareDirectDeployTransactionOptions<TConstructor>,
  gasPrice: bigint
) {
  const bytecode = ensureBytecodePrefix(options.bytecode);
  if (!isHex(bytecode)) {
    throw new Error(`Contract bytecode is invalid.\n\n${bytecode}`);
  }
  // prepare the tx
  return prepareTransaction({
    chain: options.chain,
    client: options.client,
    gasPrice: gasPrice,
    // the data is the bytecode and the constructor parameters
    data: concatHex([
      bytecode,
      encodeAbiParameters(
        options.constructorAbi.inputs,
        options.constructorParams
      ),
    ]),
  });
}

export const deployContract = ({
  account,
  market,
  publicKey,
  teamName,
  gasPrice,
}: DeployProps) => {
  return prepareDirectDeployTransaction(
    {
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
    },
    gasPrice
  );
};
