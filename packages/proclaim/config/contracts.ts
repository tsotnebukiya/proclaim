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

export const tokenContract = (curency: 'USD' | 'EUR') => {
  const address =
    curency === 'EUR' ? process.env.EUR_CONTRACT! : process.env.USD_CONTRACT!;
  return getContract({
    client,
    chain: proChain,
    address,
    abi: [
      {
        type: 'constructor',
        name: '',
        inputs: [],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'event',
        name: 'Approval',
        inputs: [
          {
            type: 'address',
            name: 'owner',
            indexed: true,
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'spender',
            indexed: true,
            internalType: 'address',
          },
          {
            type: 'bool',
            name: 'isAllowed',
            indexed: false,
            internalType: 'bool',
          },
        ],
        outputs: [],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'Transfer',
        inputs: [
          {
            type: 'address',
            name: 'from',
            indexed: true,
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'to',
            indexed: true,
            internalType: 'address',
          },
          {
            type: 'uint256',
            name: 'value',
            indexed: false,
            internalType: 'uint256',
          },
        ],
        outputs: [],
        anonymous: false,
      },
      {
        type: 'function',
        name: 'approve',
        inputs: [
          {
            type: 'address',
            name: 'spender',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'balanceOf',
        inputs: [
          {
            type: 'address',
            name: 'account',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'decimals',
        inputs: [],
        outputs: [
          {
            type: 'uint8',
            name: '',
            internalType: 'uint8',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'disapprove',
        inputs: [
          {
            type: 'address',
            name: 'spender',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'isApproved',
        inputs: [
          {
            type: 'address',
            name: '_owner',
            internalType: 'address',
          },
          {
            type: 'address',
            name: '_spender',
            internalType: 'address',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'mint',
        inputs: [
          {
            type: 'address',
            name: 'recipient',
            internalType: 'address',
          },
          {
            type: 'uint256',
            name: 'amount',
            internalType: 'uint256',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'name',
        inputs: [],
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
        name: 'owner',
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
        name: 'symbol',
        inputs: [],
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
        name: 'totalSupply',
        inputs: [],
        outputs: [
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'transfer',
        inputs: [
          {
            type: 'address',
            name: 'recipient',
            internalType: 'address',
          },
          {
            type: 'uint256',
            name: 'amount',
            internalType: 'uint256',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'transferFrom',
        inputs: [
          {
            type: 'address',
            name: 'sender',
            internalType: 'address',
          },
          {
            type: 'address',
            name: 'recipient',
            internalType: 'address',
          },
          {
            type: 'uint256',
            name: 'amount',
            internalType: 'uint256',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'nonpayable',
      },
    ],
  });
};

export const bankContract = (contractAddress: string) => {
  return getContract({
    client,
    chain: proChain,
    address: contractAddress,
    abi: [
      {
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
      {
        type: 'event',
        name: 'ClaimAdded',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            indexed: true,
            internalType: 'address',
          },
        ],
        outputs: [],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'ClaimSettled',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            indexed: true,
            internalType: 'address',
          },
        ],
        outputs: [],
        anonymous: false,
      },
      {
        type: 'event',
        name: 'SettlementError',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            indexed: true,
            internalType: 'bytes32',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            indexed: true,
            internalType: 'address',
          },
          {
            type: 'string',
            name: 'reason',
            indexed: false,
            internalType: 'string',
          },
        ],
        outputs: [],
        anonymous: false,
      },
      {
        type: 'function',
        name: 'addClaim',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            internalType: 'bytes32',
          },
          {
            type: 'string',
            name: 'encryptedClaimData',
            internalType: 'string',
          },
          {
            type: 'uint256',
            name: 'amountOwed',
            internalType: 'uint256',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            internalType: 'address',
          },
          {
            type: 'string',
            name: 'tokenName',
            internalType: 'string',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'addClaims',
        inputs: [
          {
            type: 'bytes32[]',
            name: 'claimIdentifiers',
            internalType: 'bytes32[]',
          },
          {
            type: 'string[]',
            name: 'encryptedClaimDatas',
            internalType: 'string[]',
          },
          {
            type: 'uint256[]',
            name: 'amountsOwed',
            internalType: 'uint256[]',
          },
          {
            type: 'address[]',
            name: 'counterpartyAddresses',
            internalType: 'address[]',
          },
          {
            type: 'string[]',
            name: 'tokenNames',
            internalType: 'string[]',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'bankDepository',
        inputs: [],
        outputs: [
          {
            type: 'address',
            name: '',
            internalType: 'contract IBankDepository',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'checkIfSettled',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            internalType: 'bytes32',
          },
        ],
        outputs: [
          {
            type: 'bool',
            name: '',
            internalType: 'bool',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'claimHashes',
        inputs: [
          {
            type: 'uint256',
            name: '',
            internalType: 'uint256',
          },
        ],
        outputs: [
          {
            type: 'bytes32',
            name: '',
            internalType: 'bytes32',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'claims',
        inputs: [
          {
            type: 'bytes32',
            name: '',
            internalType: 'bytes32',
          },
        ],
        outputs: [
          {
            type: 'string',
            name: 'encryptedClaimData',
            internalType: 'string',
          },
          {
            type: 'uint256',
            name: 'amountOwed',
            internalType: 'uint256',
          },
          {
            type: 'bool',
            name: 'isSettled',
            internalType: 'bool',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            internalType: 'address',
          },
          {
            type: 'string',
            name: 'tokenName',
            internalType: 'string',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getClaim',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            internalType: 'bytes32',
          },
        ],
        outputs: [
          {
            type: 'string',
            name: 'encryptedClaimData',
            internalType: 'string',
          },
          {
            type: 'uint256',
            name: 'amountOwed',
            internalType: 'uint256',
          },
          {
            type: 'bool',
            name: 'isSettled',
            internalType: 'bool',
          },
          {
            type: 'address',
            name: 'counterpartyAddress',
            internalType: 'address',
          },
          {
            type: 'string',
            name: 'tokenName',
            internalType: 'string',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getClaims',
        inputs: [],
        outputs: [
          {
            type: 'bytes32[]',
            name: 'ids',
            internalType: 'bytes32[]',
          },
          {
            type: 'string[]',
            name: 'encryptedData',
            internalType: 'string[]',
          },
          {
            type: 'uint256[]',
            name: 'amounts',
            internalType: 'uint256[]',
          },
          {
            type: 'bool[]',
            name: 'settledStatus',
            internalType: 'bool[]',
          },
          {
            type: 'address[]',
            name: 'counterparties',
            internalType: 'address[]',
          },
          {
            type: 'string[]',
            name: 'tokenNames',
            internalType: 'string[]',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getSettledClaims',
        inputs: [],
        outputs: [
          {
            type: 'bytes32[]',
            name: 'ids',
            internalType: 'bytes32[]',
          },
          {
            type: 'string[]',
            name: 'encryptedData',
            internalType: 'string[]',
          },
          {
            type: 'uint256[]',
            name: 'amounts',
            internalType: 'uint256[]',
          },
          {
            type: 'address[]',
            name: 'counterparties',
            internalType: 'address[]',
          },
          {
            type: 'string[]',
            name: 'tokenNames',
            internalType: 'string[]',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'getUnsettledClaims',
        inputs: [],
        outputs: [
          {
            type: 'bytes32[]',
            name: 'ids',
            internalType: 'bytes32[]',
          },
          {
            type: 'string[]',
            name: 'encryptedData',
            internalType: 'string[]',
          },
          {
            type: 'uint256[]',
            name: 'amounts',
            internalType: 'uint256[]',
          },
          {
            type: 'address[]',
            name: 'counterparties',
            internalType: 'address[]',
          },
          {
            type: 'string[]',
            name: 'tokenNames',
            internalType: 'string[]',
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'name',
        inputs: [],
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
        name: 'owner',
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
        name: 'settleClaim',
        inputs: [
          {
            type: 'bytes32',
            name: 'claimIdentifier',
            internalType: 'bytes32',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
      {
        type: 'function',
        name: 'settleClaims',
        inputs: [
          {
            type: 'bytes32[]',
            name: 'claimIdentifiers',
            internalType: 'bytes32[]',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ],
  });
};
