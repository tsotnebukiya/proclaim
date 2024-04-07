import { getContract } from 'thirdweb';
import { client, proChain } from './config';

export const depositoryContract = getContract({
  client,
  chain: proChain,
  address: process.env.PROCHAIN_DEPOSITORY_CONTRACT!,
  abi: [
    {
      type: 'constructor',
      inputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'event',
      name: 'BankRegistered',
      inputs: [
        {
          type: 'string',
          name: 'key',
          indexed: true,
          internalType: 'string',
        },
        {
          type: 'address',
          name: 'ethAddress',
          indexed: false,
          internalType: 'address',
        },
        {
          type: 'address',
          name: 'contractAddress',
          indexed: false,
          internalType: 'address',
        },
        {
          type: 'bytes',
          name: 'publicKey',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'function',
      name: 'admin',
      inputs: [],
      outputs: [
        {
          type: 'address',
          name: '',
          internalType: 'address',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allKeys',
      inputs: [
        {
          type: 'uint256',
          name: '',
          internalType: 'uint256',
        },
      ],
      outputs: [
        {
          type: 'string',
          name: '',
          internalType: 'string',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'bankRegistry',
      inputs: [
        {
          type: 'string',
          name: '',
          internalType: 'string',
        },
      ],
      outputs: [
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
          type: 'address',
          name: 'ethAddress',
          internalType: 'address',
        },
        {
          type: 'address',
          name: 'contractAddress',
          internalType: 'address',
        },
        {
          type: 'bytes',
          name: 'publicKey',
          internalType: 'bytes',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getAllBankDetails',
      inputs: [],
      outputs: [
        {
          type: 'tuple[]',
          name: '',
          components: [
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
              type: 'address',
              name: 'ethAddress',
              internalType: 'address',
            },
            {
              type: 'address',
              name: 'contractAddress',
              internalType: 'address',
            },
            {
              type: 'bytes',
              name: 'publicKey',
              internalType: 'bytes',
            },
          ],
          internalType: 'struct BankDepository.BankDetails[]',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getBankDetails',
      inputs: [
        {
          type: 'string',
          name: 'market',
          internalType: 'string',
        },
        {
          type: 'uint256',
          name: '_accountNumber',
          internalType: 'uint256',
        },
      ],
      outputs: [
        {
          type: 'tuple',
          name: '',
          components: [
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
              type: 'address',
              name: 'ethAddress',
              internalType: 'address',
            },
            {
              type: 'address',
              name: 'contractAddress',
              internalType: 'address',
            },
            {
              type: 'bytes',
              name: 'publicKey',
              internalType: 'bytes',
            },
          ],
          internalType: 'struct BankDepository.BankDetails',
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'registerBank',
      inputs: [
        {
          type: 'string',
          name: 'market',
          internalType: 'string',
        },
        {
          type: 'uint256',
          name: '_accountNumber',
          internalType: 'uint256',
        },
        {
          type: 'address',
          name: '_ethAddress',
          internalType: 'address',
        },
        {
          type: 'address',
          name: '_contractAddress',
          internalType: 'address',
        },
        {
          type: 'bytes',
          name: '_publicKey',
          internalType: 'bytes',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ],
});
