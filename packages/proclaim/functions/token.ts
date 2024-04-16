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

type TransactionOptionsWithNonce<T extends object = object> =
  BaseTransactionOptions<T> & {
    nonce?: number;
  };

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'owner';
    type: 'address';
  }>;
  spender: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'spender';
    type: 'address';
  }>;
}>;

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  spender: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalEventFilters = {}) {
  return prepareEvent({
    signature:
      'event Approval(address indexed owner, address indexed spender, bool isAllowed)',
    filters,
  });
}

/**
 * Represents the filters for the "Transfer" event.
 */
export type TransferEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'from';
    type: 'address';
  }>;
  to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: 'address';
    name: 'to';
    type: 'address';
  }>;
}>;

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferEvent({
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature:
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    filters,
  });
}

/**
 * Contract read functions
 */

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'account';
    type: 'address';
  }>;
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOf } from "TODO";
 *
 * const result = await balanceOf({
 *  account: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0x70a08231',
      [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
      ],
      [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
    ],
    params: [options.account],
  });
}

/**
 * Calls the "decimals" function on the contract.
 * @param options - The options for the decimals function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { decimals } from "TODO";
 *
 * const result = await decimals();
 *
 * ```
 */
export async function decimals(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0x313ce567',
      [],
      [
        {
          internalType: 'uint8',
          name: '',
          type: 'uint8',
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "isApproved" function.
 */
export type IsApprovedParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: '_owner';
    type: 'address';
  }>;
  spender: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: '_spender';
    type: 'address';
  }>;
};

/**
 * Calls the "isApproved" function on the contract.
 * @param options - The options for the isApproved function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isApproved } from "TODO";
 *
 * const result = await isApproved({
 *  owner: ...,
 *  spender: ...,
 * });
 *
 * ```
 */
export async function isApproved(
  options: BaseTransactionOptions<IsApprovedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      '0xa389783e',
      [
        {
          internalType: 'address',
          name: '_owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_spender',
          type: 'address',
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
    params: [options.owner, options.spender],
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
export async function owner(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
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
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { symbol } from "TODO";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0x95d89b41',
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
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { totalSupply } from "TODO";
 *
 * const result = await totalSupply();
 *
 * ```
 */
export async function totalSupply(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      '0x18160ddd',
      [],
      [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
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
 * Represents the parameters for the "approve" function.
 */
export type ApproveParams = {
  spender: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'spender';
    type: 'address';
  }>;
};

/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { approve } from "TODO";
 *
 * const transaction = approve({
 *  spender: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(options: TransactionOptionsWithNonce<ApproveParams>) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    method: [
      '0xdaea85c5',
      [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
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
    params: [options.spender],
  });
}

/**
 * Represents the parameters for the "disapprove" function.
 */
export type DisapproveParams = {
  spender: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'spender';
    type: 'address';
  }>;
};

/**
 * Calls the "disapprove" function on the contract.
 * @param options - The options for the "disapprove" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { disapprove } from "TODO";
 *
 * const transaction = disapprove({
 *  spender: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function disapprove(
  options: TransactionOptionsWithNonce<DisapproveParams>
) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    method: [
      '0x15770d99',
      [
        {
          internalType: 'address',
          name: 'spender',
          type: 'address',
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
    params: [options.spender],
  });
}

/**
 * Represents the parameters for the "mint" function.
 */
export type MintParams = {
  recipient: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'recipient';
    type: 'address';
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: 'amount';
    type: 'uint256';
  }>;
};

/**
 * Calls the "mint" function on the contract.
 * @param options - The options for the "mint" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { mint } from "TODO";
 *
 * const transaction = mint({
 *  recipient: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function mint(options: TransactionOptionsWithNonce<MintParams>) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    method: [
      '0x40c10f19',
      [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
      ],
      [],
    ],
    params: [options.recipient, options.amount],
  });
}

/**
 * Represents the parameters for the "transfer" function.
 */
export type TransferParams = {
  recipient: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'recipient';
    type: 'address';
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: 'amount';
    type: 'uint256';
  }>;
};

/**
 * Calls the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transfer } from "TODO";
 *
 * const transaction = transfer({
 *  recipient: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transfer(options: TransactionOptionsWithNonce<TransferParams>) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    method: [
      '0xa9059cbb',
      [
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
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
    params: [options.recipient, options.amount],
  });
}

/**
 * Represents the parameters for the "transferFrom" function.
 */
export type TransferFromParams = {
  sender: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'sender';
    type: 'address';
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: 'address';
    name: 'recipient';
    type: 'address';
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: 'uint256';
    name: 'amount';
    type: 'uint256';
  }>;
};

/**
 * Calls the "transferFrom" function on the contract.
 * @param options - The options for the "transferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { transferFrom } from "TODO";
 *
 * const transaction = transferFrom({
 *  sender: ...,
 *  recipient: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transferFrom(
  options: TransactionOptionsWithNonce<TransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    nonce: options.nonce,
    method: [
      '0x23b872dd',
      [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'recipient',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
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
    params: [options.sender, options.recipient, options.amount],
  });
}
