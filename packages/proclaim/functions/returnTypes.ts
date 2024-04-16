export type GetBankDetails = {
  market: string;
  accountNumber: bigint;
  ethAddress: string;
  contractAddress: string;
  piblicKey: string;
};

export type GetContractClaims = [
  string[],
  string[],
  bigint[],
  string[],
  string[],
];
