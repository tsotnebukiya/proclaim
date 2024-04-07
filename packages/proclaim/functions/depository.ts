import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from 'thirdweb';

/**
 * Contract events
 */

/**
 * Represents the filters for the "BankRegistered" event.
 */
export type BankRegisteredEventFilters = Partial<{
  key: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'string';
    name: 'key';
    type: 'string';
  }>;
}>;

/**
 * Creates an event object for the BankRegistered event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { bankRegisteredEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  bankRegisteredEvent({
 *  key: ...,
 * })
 * ],
 * });
 * ```
 */
export function bankRegisteredEvent(filters: BankRegisteredEventFilters = {}) {
  return prepareEvent({
    signature:
      'event BankRegistered(string indexed key, address ethAddress, address contractAddress, string publicKey)',
    filters,
  });
}

/**
 * Contract read functions
 */

/**
 * Calls the "admin" function on the contract.
 * @param options - The options for the admin function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { admin } from "TODO";
 *
 * const result = await admin();
 *
 * ```
 */
export async function admin(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0xf851a440',
      [],
      [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "allKeys" function.
 */
export type AllKeysParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: '';
    type: 'uint256';
  }>;
};

/**
 * Calls the "allKeys" function on the contract.
 * @param options - The options for the allKeys function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { allKeys } from "TODO";
 *
 * const result = await allKeys({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function allKeys(options: BaseTransactionOptions<AllKeysParams>) {
  return readContract({
    contract: options.contract,
    method: [
      '0x3909ba41',
      [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Represents the parameters for the "bankRegistry" function.
 */
export type BankRegistryParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: '';
    type: 'string';
  }>;
};

/**
 * Calls the "bankRegistry" function on the contract.
 * @param options - The options for the bankRegistry function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { bankRegistry } from "TODO";
 *
 * const result = await bankRegistry({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function bankRegistry(
  options: BaseTransactionOptions<BankRegistryParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0xd42b0133',
      [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      [
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
          internalType: 'address',
          name: 'ethAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'contractAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'publicKey',
          type: 'string',
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Calls the "getAllBankDetails" function on the contract.
 * @param options - The options for the getAllBankDetails function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getAllBankDetails } from "TODO";
 *
 * const result = await getAllBankDetails();
 *
 * ```
 */
export async function getAllBankDetails(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0xf54f0e56',
      [],
      [
        {
          components: [
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
              internalType: 'address',
              name: 'ethAddress',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'contractAddress',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'publicKey',
              type: 'string',
            },
          ],
          internalType: 'struct BankDepository.BankDetails[]',
          name: '',
          type: 'tuple[]',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "getBankDetails" function.
 */
export type GetBankDetailsParams = {
  market: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: 'market';
    type: 'string';
  }>;
  accountNumber: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: '_accountNumber';
    type: 'uint256';
  }>;
};

/**
 * Calls the "getBankDetails" function on the contract.
 * @param options - The options for the getBankDetails function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getBankDetails } from "TODO";
 *
 * const result = await getBankDetails({
 *  market: ...,
 *  accountNumber: ...,
 * });
 *
 * ```
 */

export async function getBankDetails(
  options: BaseTransactionOptions<GetBankDetailsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0x66acf573',
      [
        {
          internalType: 'string',
          name: 'market',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: '_accountNumber',
          type: 'uint256',
        },
      ],
      [
        {
          components: [
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
              internalType: 'address',
              name: 'ethAddress',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'contractAddress',
              type: 'address',
            },
            {
              internalType: 'string',
              name: 'publicKey',
              type: 'string',
            },
          ],
          internalType: 'struct BankDepository.BankDetails',
          name: '',
          type: 'tuple',
        },
      ],
    ],
    params: [options.market, options.accountNumber],
  });
}

/**
 * Represents the parameters for the "getTokenAddress" function.
 */
export type GetTokenAddressParams = {
  tokenName: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: 'tokenName';
    type: 'string';
  }>;
};

/**
 * Calls the "getTokenAddress" function on the contract.
 * @param options - The options for the getTokenAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getTokenAddress } from "TODO";
 *
 * const result = await getTokenAddress({
 *  tokenName: ...,
 * });
 *
 * ```
 */
export async function getTokenAddress(
  options: BaseTransactionOptions<GetTokenAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0xc4091236',
      [
        {
          internalType: 'string',
          name: 'tokenName',
          type: 'string',
        },
      ],
      [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    ],
    params: [options.tokenName],
  });
}

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { name } from "TODO";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0x06fdde03',
      [],
      [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "tokenAddresses" function.
 */
export type TokenAddressesParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: '';
    type: 'string';
  }>;
};

/**
 * Calls the "tokenAddresses" function on the contract.
 * @param options - The options for the tokenAddresses function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { tokenAddresses } from "TODO";
 *
 * const result = await tokenAddresses({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function tokenAddresses(
  options: BaseTransactionOptions<TokenAddressesParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0x935b13f6',
      [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Contract write functions
 */

/**
 * Represents the parameters for the "registerBank" function.
 */
export type RegisterBankParams = {
  market: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: 'market';
    type: 'string';
  }>;
  accountNumber: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: '_accountNumber';
    type: 'uint256';
  }>;
  ethAddress: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: '_ethAddress';
    type: 'address';
  }>;
  contractAddress: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: '_contractAddress';
    type: 'address';
  }>;
  publicKey: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: '_publicKey';
    type: 'string';
  }>;
};

/**
 * Calls the "registerBank" function on the contract.
 * @param options - The options for the "registerBank" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { registerBank } from "TODO";
 *
 * const transaction = registerBank({
 *  market: ...,
 *  accountNumber: ...,
 *  ethAddress: ...,
 *  contractAddress: ...,
 *  publicKey: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function registerBank(
  options: BaseTransactionOptions<RegisterBankParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      '0xeddedcb7',
      [
        {
          internalType: 'string',
          name: 'market',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: '_accountNumber',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '_ethAddress',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_contractAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: '_publicKey',
          type: 'string',
        },
      ],
      [],
    ],
    params: [
      options.market,
      options.accountNumber,
      options.ethAddress,
      options.contractAddress,
      options.publicKey,
    ],
  });
}
