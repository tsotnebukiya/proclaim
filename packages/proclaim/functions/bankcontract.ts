import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from 'thirdweb';

type TransactionOptionsWithNonceAndGas<T extends object = object> =
  BaseTransactionOptions<T> & {
    gasPrice: bigint;
    nonce?: number;
  };

/**
 * Contract events
 */

/**
 * Represents the filters for the "ClaimAdded" event.
 */
export type ClaimAddedEventFilters = Partial<{
  claimIdentifier: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
  counterpartyAddress: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'counterpartyAddress';
    type: 'address';
  }>;
}>;

/**
 * Creates an event object for the ClaimAdded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { claimAddedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimAddedEvent({
 *  claimIdentifier: ...,
 *  counterpartyAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function claimAddedEvent(filters: ClaimAddedEventFilters = {}) {
  return prepareEvent({
    signature:
      'event ClaimAdded(bytes32 indexed claimIdentifier, address indexed counterpartyAddress)',
    filters,
  });
}

/**
 * Represents the filters for the "ClaimSettled" event.
 */
export type ClaimSettledEventFilters = Partial<{
  claimIdentifier: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
  counterpartyAddress: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'counterpartyAddress';
    type: 'address';
  }>;
}>;

/**
 * Creates an event object for the ClaimSettled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { claimSettledEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimSettledEvent({
 *  claimIdentifier: ...,
 *  counterpartyAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function claimSettledEvent(filters: ClaimSettledEventFilters = {}) {
  return prepareEvent({
    signature:
      'event ClaimSettled(bytes32 indexed claimIdentifier, address indexed counterpartyAddress)',
    filters,
  });
}

/**
 * Represents the filters for the "SettlementError" event.
 */
export type SettlementErrorEventFilters = Partial<{
  claimIdentifier: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
  counterpartyAddress: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'counterpartyAddress';
    type: 'address';
  }>;
}>;

/**
 * Creates an event object for the SettlementError event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { settlementErrorEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  settlementErrorEvent({
 *  claimIdentifier: ...,
 *  counterpartyAddress: ...,
 * })
 * ],
 * });
 * ```
 */
export function settlementErrorEvent(
  filters: SettlementErrorEventFilters = {}
) {
  return prepareEvent({
    signature:
      'event SettlementError(bytes32 indexed claimIdentifier, address indexed counterpartyAddress, string reason)',
    filters,
  });
}

/**
 * Contract read functions
 */

/**
 * Calls the "bankDepository" function on the contract.
 * @param options - The options for the bankDepository function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { bankDepository } from "TODO";
 *
 * const result = await bankDepository();
 *
 * ```
 */
export async function bankDepository(
  options: TransactionOptionsWithNonceAndGas
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x8df0c22a',
      [],
      [
        {
          internalType: 'contract IBankDepository',
          name: '',
          type: 'address',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "checkIfSettled" function.
 */
export type CheckIfSettledParams = {
  claimIdentifier: AbiParameterToPrimitiveType<{
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
};

/**
 * Calls the "checkIfSettled" function on the contract.
 * @param options - The options for the checkIfSettled function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { checkIfSettled } from "TODO";
 *
 * const result = await checkIfSettled({
 *  claimIdentifier: ...,
 * });
 *
 * ```
 */
export async function checkIfSettled(
  options: TransactionOptionsWithNonceAndGas<CheckIfSettledParams>
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x6abd1ade',
      [
        {
          internalType: 'bytes32',
          name: 'claimIdentifier',
          type: 'bytes32',
        },
      ],
      [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
    ],
    params: [options.claimIdentifier],
  });
}

/**
 * Represents the parameters for the "claimHashes" function.
 */
export type ClaimHashesParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: '';
    type: 'uint256';
  }>;
};

/**
 * Calls the "claimHashes" function on the contract.
 * @param options - The options for the claimHashes function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { claimHashes } from "TODO";
 *
 * const result = await claimHashes({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function claimHashes(
  options: TransactionOptionsWithNonceAndGas<ClaimHashesParams>
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x2639c060',
      [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Represents the parameters for the "claims" function.
 */
export type ClaimsParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: 'bytes32';
    name: '';
    type: 'bytes32';
  }>;
};

/**
 * Calls the "claims" function on the contract.
 * @param options - The options for the claims function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { claims } from "TODO";
 *
 * const result = await claims({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function claims(
  options: TransactionOptionsWithNonceAndGas<ClaimsParams>
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0xeff0f592',
      [
        {
          internalType: 'bytes32',
          name: '',
          type: 'bytes32',
        },
      ],
      [
        {
          internalType: 'string',
          name: 'encryptedClaimData',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'amountOwed',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'isSettled',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'counterpartyAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'tokenName',
          type: 'string',
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Represents the parameters for the "getClaim" function.
 */
export type GetClaimParams = {
  claimIdentifier: AbiParameterToPrimitiveType<{
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
};

/**
 * Calls the "getClaim" function on the contract.
 * @param options - The options for the getClaim function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getClaim } from "TODO";
 *
 * const result = await getClaim({
 *  claimIdentifier: ...,
 * });
 *
 * ```
 */
export async function getClaim(
  options: TransactionOptionsWithNonceAndGas<GetClaimParams>
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0xc9100bcb',
      [
        {
          internalType: 'bytes32',
          name: 'claimIdentifier',
          type: 'bytes32',
        },
      ],
      [
        {
          internalType: 'string',
          name: 'encryptedClaimData',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'amountOwed',
          type: 'uint256',
        },
        {
          internalType: 'bool',
          name: 'isSettled',
          type: 'bool',
        },
        {
          internalType: 'address',
          name: 'counterpartyAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'tokenName',
          type: 'string',
        },
      ],
    ],
    params: [options.claimIdentifier],
  });
}

/**
 * Calls the "getClaims" function on the contract.
 * @param options - The options for the getClaims function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getClaims } from "TODO";
 *
 * const result = await getClaims();
 *
 * ```
 */
export async function getClaims(options: TransactionOptionsWithNonceAndGas) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0xc52822f8',
      [],
      [
        {
          internalType: 'bytes32[]',
          name: 'ids',
          type: 'bytes32[]',
        },
        {
          internalType: 'string[]',
          name: 'encryptedData',
          type: 'string[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'bool[]',
          name: 'settledStatus',
          type: 'bool[]',
        },
        {
          internalType: 'address[]',
          name: 'counterparties',
          type: 'address[]',
        },
        {
          internalType: 'string[]',
          name: 'tokenNames',
          type: 'string[]',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "getSettledClaims" function on the contract.
 * @param options - The options for the getSettledClaims function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getSettledClaims } from "TODO";
 *
 * const result = await getSettledClaims();
 *
 * ```
 */
export async function getSettledClaims(
  options: TransactionOptionsWithNonceAndGas
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x0ed847a5',
      [],
      [
        {
          internalType: 'bytes32[]',
          name: 'ids',
          type: 'bytes32[]',
        },
        {
          internalType: 'string[]',
          name: 'encryptedData',
          type: 'string[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'address[]',
          name: 'counterparties',
          type: 'address[]',
        },
        {
          internalType: 'string[]',
          name: 'tokenNames',
          type: 'string[]',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "getUnsettledClaims" function on the contract.
 * @param options - The options for the getUnsettledClaims function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getUnsettledClaims } from "TODO";
 *
 * const result = await getUnsettledClaims();
 *
 * ```
 */
export async function getUnsettledClaims(
  options: TransactionOptionsWithNonceAndGas
) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x7b145e53',
      [],
      [
        {
          internalType: 'bytes32[]',
          name: 'ids',
          type: 'bytes32[]',
        },
        {
          internalType: 'string[]',
          name: 'encryptedData',
          type: 'string[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amounts',
          type: 'uint256[]',
        },
        {
          internalType: 'address[]',
          name: 'counterparties',
          type: 'address[]',
        },
        {
          internalType: 'string[]',
          name: 'tokenNames',
          type: 'string[]',
        },
      ],
    ],
    params: [],
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
export async function name(options: TransactionOptionsWithNonceAndGas) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
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
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(options: TransactionOptionsWithNonceAndGas) {
  return readContract({
    contract: options.contract,
    gasPrice: options.gasPrice,
    method: [
      '0x8da5cb5b',
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
 * Contract write functions
 */

/**
 * Represents the parameters for the "addClaim" function.
 */
export type AddClaimParams = {
  claimIdentifier: AbiParameterToPrimitiveType<{
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
  encryptedClaimData: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: 'encryptedClaimData';
    type: 'string';
  }>;
  amountOwed: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: 'amountOwed';
    type: 'uint256';
  }>;
  counterpartyAddress: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'counterpartyAddress';
    type: 'address';
  }>;
  tokenName: AbiParameterToPrimitiveType<{
    internalType: 'string';
    name: 'tokenName';
    type: 'string';
  }>;
};

/**
 * Calls the "addClaim" function on the contract.
 * @param options - The options for the "addClaim" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addClaim } from "TODO";
 *
 * const transaction = addClaim({
 *  claimIdentifier: ...,
 *  encryptedClaimData: ...,
 *  amountOwed: ...,
 *  counterpartyAddress: ...,
 *  tokenName: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addClaim(
  options: TransactionOptionsWithNonceAndGas<AddClaimParams>
) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    gasPrice: options.gasPrice,
    method: [
      '0xbdc2c6e1',
      [
        {
          internalType: 'bytes32',
          name: 'claimIdentifier',
          type: 'bytes32',
        },
        {
          internalType: 'string',
          name: 'encryptedClaimData',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: 'amountOwed',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: 'counterpartyAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'tokenName',
          type: 'string',
        },
      ],
      [],
    ],
    params: [
      options.claimIdentifier,
      options.encryptedClaimData,
      options.amountOwed,
      options.counterpartyAddress,
      options.tokenName,
    ],
  });
}

/**
 * Represents the parameters for the "addClaims" function.
 */
export type AddClaimsParams = {
  claimIdentifiers: AbiParameterToPrimitiveType<{
    internalType: 'bytes32[]';
    name: 'claimIdentifiers';
    type: 'bytes32[]';
  }>;
  encryptedClaimDatas: AbiParameterToPrimitiveType<{
    internalType: 'string[]';
    name: 'encryptedClaimDatas';
    type: 'string[]';
  }>;
  amountsOwed: AbiParameterToPrimitiveType<{
    internalType: 'uint256[]';
    name: 'amountsOwed';
    type: 'uint256[]';
  }>;
  counterpartyAddresses: AbiParameterToPrimitiveType<{
    internalType: 'address[]';
    name: 'counterpartyAddresses';
    type: 'address[]';
  }>;
  tokenNames: AbiParameterToPrimitiveType<{
    internalType: 'string[]';
    name: 'tokenNames';
    type: 'string[]';
  }>;
};

/**
 * Calls the "addClaims" function on the contract.
 * @param options - The options for the "addClaims" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addClaims } from "TODO";
 *
 * const transaction = addClaims({
 *  claimIdentifiers: ...,
 *  encryptedClaimDatas: ...,
 *  amountsOwed: ...,
 *  counterpartyAddresses: ...,
 *  tokenNames: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addClaims(
  options: TransactionOptionsWithNonceAndGas<AddClaimsParams>
) {
  return prepareContractCall({
    contract: options.contract,
    gasPrice: options.gasPrice,
    nonce: options.nonce,
    method: [
      '0x210d5e55',
      [
        {
          internalType: 'bytes32[]',
          name: 'claimIdentifiers',
          type: 'bytes32[]',
        },
        {
          internalType: 'string[]',
          name: 'encryptedClaimDatas',
          type: 'string[]',
        },
        {
          internalType: 'uint256[]',
          name: 'amountsOwed',
          type: 'uint256[]',
        },
        {
          internalType: 'address[]',
          name: 'counterpartyAddresses',
          type: 'address[]',
        },
        {
          internalType: 'string[]',
          name: 'tokenNames',
          type: 'string[]',
        },
      ],
      [],
    ],
    params: [
      options.claimIdentifiers,
      options.encryptedClaimDatas,
      options.amountsOwed,
      options.counterpartyAddresses,
      options.tokenNames,
    ],
  });
}

/**
 * Represents the parameters for the "settleClaim" function.
 */
export type SettleClaimParams = {
  claimIdentifier: AbiParameterToPrimitiveType<{
    internalType: 'bytes32';
    name: 'claimIdentifier';
    type: 'bytes32';
  }>;
};

/**
 * Calls the "settleClaim" function on the contract.
 * @param options - The options for the "settleClaim" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { settleClaim } from "TODO";
 *
 * const transaction = settleClaim({
 *  claimIdentifier: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function settleClaim(
  options: TransactionOptionsWithNonceAndGas<SettleClaimParams>
) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    gasPrice: options.gasPrice,
    method: [
      '0xbdf80435',
      [
        {
          internalType: 'bytes32',
          name: 'claimIdentifier',
          type: 'bytes32',
        },
      ],
      [],
    ],
    params: [options.claimIdentifier],
  });
}

/**
 * Represents the parameters for the "settleClaims" function.
 */
export type SettleClaimsParams = {
  claimIdentifiers: AbiParameterToPrimitiveType<{
    internalType: 'bytes32[]';
    name: 'claimIdentifiers';
    type: 'bytes32[]';
  }>;
};

/**
 * Calls the "settleClaims" function on the contract.
 * @param options - The options for the "settleClaims" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { settleClaims } from "TODO";
 *
 * const transaction = settleClaims({
 *  claimIdentifiers: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```e
 */
export function settleClaims(
  options: TransactionOptionsWithNonceAndGas<SettleClaimsParams>
) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    gasPrice: options.gasPrice,
    method: [
      '0xd7f8fb9f',
      [
        {
          internalType: 'bytes32[]',
          name: 'claimIdentifiers',
          type: 'bytes32[]',
        },
      ],
      [],
    ],
    params: [options.claimIdentifiers],
  });
}
