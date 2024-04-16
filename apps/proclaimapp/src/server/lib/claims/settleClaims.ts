import { db } from "@/server/db";
import {
  GetBankDetails,
  bankContract,
  depositoryContract,
  wallet,
} from "proclaim";
import {
  getUnsettledClaims,
  settleClaims as settleClaimsCall,
} from "proclaim/contractFunctions";
import { getAllBankDetails } from "proclaim/depositoryFunctions";

export const settleClaims = async () => {
  const banks = (await getAllBankDetails({
    contract: depositoryContract,
  })) as GetBankDetails[];
  const contracts = banks.map((el) => el.contractAddress);
  const allEventClaims = await Promise.all(
    contracts.map(async (contractAddress) => {
      return getUnsettledClaims({
        contract: bankContract(contractAddress),
      });
    }),
  );
  return allEventClaims;
};
