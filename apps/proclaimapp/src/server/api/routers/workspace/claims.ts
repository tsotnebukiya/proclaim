import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { getCachedCPClaims } from "@/server/lib/claims/contractClaims";
import { createClaim, createMany } from "@/server/lib/claims/createClaims";
import { processSpecifiContractEvents } from "@/server/lib/claims/processEvents";
import { getCachedContracts } from "@/server/lib/contracts/fetch-contracts";
import {
  ReceivedClaimSchema,
  dummyClaimSchema,
  newClaimSchema,
} from "@/server/lib/schemas";
import {
  claimStatus,
  dummyDecrypt,
  invertDecryptedData,
} from "@/server/lib/utils";
import { TRPCError } from "@trpc/server";
import { kv } from "@vercel/kv";
import moment from "moment-timezone";
import { bankContract, wallet } from "proclaim";
import { addClaims, settleClaims } from "proclaim/contractFunctions";
import { sendTransaction } from "thirdweb";
import { z } from "zod";

export const claimRouter = createTRPCRouter({
  getClaims: publicProcedure
    .input(z.object({ workspace: z.string() }))
    .query(async ({ input }) => {
      const { workspace } = input;
      const claimsResp = db.claim.findMany({
        where: {
          team: {
            slug: workspace,
          },
        },
        orderBy: {
          payDate: "desc",
        },
      });
      const contractsResp = getCachedContracts();
      const [claims, contracts] = await Promise.all([
        claimsResp,
        contractsResp,
      ]);
      const formattedClaims = claims.map((claim) => {
        const {
          id,
          tradeReference: traderef,
          currency: ccy,
          settled,
          type,
          payDate: paydate,
          amount,
          counterparty,
          market,
          corporateAction: label,
          corporateActionID,
        } = claim;
        let eventType: string;
        console.log(label);
        if (label === "Redemption") {
          eventType = type === "Payable" ? "MCAL" : "REDM";
        } else {
          eventType = type === "Receivable" ? "INTR" : "DVCA";
        }
        const status = claimStatus(paydate, settled);
        const cp =
          contracts.find(
            (contract) =>
              `${counterparty}${market}` ===
              `${contract.account}${contract.market}`,
          )?.name || "N/A";
        return {
          id,
          traderef,
          ccy: ccy.substring(0, 3),
          status,
          label,
          paydate,
          amount,
          cp,
          type,
          corporateActionID,
          eventType,
        };
      });
      return formattedClaims;
    }),
  getClaim: publicProcedure
    .input(z.object({ tradeRef: z.string(), workspace: z.string() }))
    .query(async ({ input }) => {
      const { tradeRef, workspace } = input;
      const claimPromise = db.claim.findUniqueOrThrow({
        where: {
          tradeReference: tradeRef,
          team: {
            slug: workspace,
          },
        },
        include: {
          creator: true,
          settler: true,
          settlementError: true,
        },
      });
      const contractsPromise = getCachedContracts();
      const [claim, contracts] = await Promise.all([
        claimPromise,
        contractsPromise,
      ]);
      const {
        actualSettlementDate: asd,
        contractualSettlementDate: csd,
        payDate: pd,
        settled,
        settler,
        settledBy,
        settledDate,
        createdDate,
        createdBy,
        creator,
        market,
        owner: account,
        counterparty: cpAcc,
        type,
        quantity,
        corporateAction,
        corporateActionID: eventID,
        eventRate,
        amount,
        currency: ccy,
        matched,
        hash: claimHash,
        transaction: txHash,
        settlementError,
        uploaded,
      } = claim;
      const cpName =
        contracts.find(
          (contract) =>
            `${cpAcc}${market}` === `${contract.account}${contract.market}`,
        )?.name || "N/A";
      const status = claimStatus(pd, settled);
      let eventType;
      if (corporateAction === "Redemption") {
        eventType = type === "Payable" ? "MCAL" : "REDM";
      } else {
        eventType = type === "Receivable" ? "INTR" : "DVCA";
      }
      return {
        claimInfo: {
          tradeRef,
          csd,
          asd,
          pd,
          market,
          account,
          cpName,
          cpAcc,
          type,
          quantity,
          eventType,
          eventID,
          eventRate,
          amount,
          uploaded,
          ccy: ccy.substring(0, 3),
        },
        settlementInfo: {
          status,
          matched,
          claimHash,
          txHash,
          settledDate,
          settled,
          uploaded,
        },
        auditTrail: {
          audit: {
            createdDate,
            createdBy,
            creatorName: creator?.name,
            creatorId: creator?.id,
            settled,
            settledBy,
            settledDate,
            settlerName: settler?.name,
            settlerId: settler?.id,
          },
          errors: settlementError,
        },
      };
    }),
  attachHash: publicProcedure
    .input(
      z.object({
        tradeRef: z.string(),
        workspace: z.string(),
        hash: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { tradeRef, workspace, hash } = input;
      const claim = await db.claim.findUniqueOrThrow({
        where: {
          type: "Payable",
          tradeReference: tradeRef,
          team: {
            slug: workspace,
          },
        },
        include: {
          creator: true,
          settler: true,
          settlementError: true,
        },
      });

      const { settled, matched, owner, market } = claim;
      if (settled || matched) {
        throw new TRPCError({
          message: "Claim already matched",
          code: "BAD_REQUEST",
        });
      }
      const cpClaims = await getCachedCPClaims(
        workspace,
        market,
        Number(owner),
        true,
      );
      const cpClaim = cpClaims.find((el) => el.hash === hash);
      if (!cpClaim) {
        throw new TRPCError({
          message: "No CP claim found",
          code: "BAD_REQUEST",
        });
      }
      await db.claim.update({
        where: {
          tradeReference: tradeRef,
        },
        data: {
          matched: true,
          hash: cpClaim.hash,
          amount: cpClaim.amount,
        },
      });
      return true;
    }),
  settleClaim: protectedProcedure
    .input(
      z.object({
        tradeRef: z.string(),
        workspace: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { tradeRef, workspace } = input;
      const { session } = ctx;
      const claimResp = db.claim.findUniqueOrThrow({
        where: {
          tradeReference: tradeRef,
          type: "Payable",
          team: {
            slug: workspace,
          },
        },
        include: {
          creator: true,
          settler: true,
          settlementError: true,
        },
      });
      const contractsResp = getCachedContracts();
      const [claim, contracts] = await Promise.all([claimResp, contractsResp]);
      const { settled, matched, counterparty, owner, market, hash } = claim;
      if (settled) {
        throw new TRPCError({
          message: "Claim already settled",
          code: "BAD_REQUEST",
        });
      }
      const cpContract = contracts.find(
        (contract) =>
          `${counterparty}${market}` ===
          `${contract.account}${contract.market}`,
      );
      if (!cpContract) {
        throw new TRPCError({
          message: "Counterparty not registered",
          code: "BAD_REQUEST",
        });
      }
      let usedHash: string | null | undefined = hash;
      if (!hash) {
        const cpClaims = await getCachedCPClaims(
          workspace,
          market,
          Number(owner),
          true,
        );
        const cpClaim = cpClaims.find((el) => {
          return (
            invertDecryptedData(el.decryptedString) ===
            dummyDecrypt(claim.encryptedClaimData)
          );
        });
        usedHash = cpClaim?.hash;
        if (usedHash) {
          await db.claim.update({
            where: {
              tradeReference: tradeRef,
            },
            data: {
              hash: usedHash,
              matched: true,
            },
          });
        }
      }
      if (!usedHash) {
        throw new TRPCError({
          message: "No matching claim found",
          code: "BAD_REQUEST",
        });
      }

      let latestNonce = (await kv.get<number>("latestNonce")) as number;
      const transaction = settleClaims({
        claimIdentifiers: [usedHash] as `0x${string}`[],
        contract: bankContract(cpContract.contractAddress),
        nonce: latestNonce + 1,
      });
      await sendTransaction({
        transaction,
        account: wallet,
      });
      latestNonce++;
      await kv.set<number>(`latestNonce`, latestNonce);
      const response = await processSpecifiContractEvents({
        claimHash: usedHash,
        claimId: claim.id,
        contractAddress: cpContract.contractAddress,
        tradeRef,
        userId: session.user.id,
        receivable: false,
      });
      let returnValue = "";
      if (response === "settled") {
        returnValue = "Claim Settled";
      } else if (response === "pending") {
        returnValue = "Settlement Pending";
      } else if (response === "error") {
        returnValue = "Settlement Error";
      }
      return returnValue;
    }),
  updateStatus: protectedProcedure
    .input(
      z.object({
        tradeRef: z.string(),
        workspace: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { tradeRef, workspace } = input;
      const { session } = ctx;
      const claimResp = db.claim.findUniqueOrThrow({
        where: {
          tradeReference: tradeRef,
          team: {
            slug: workspace,
          },
        },
        include: {
          team: true,
        },
      });
      const contractsResp = getCachedContracts();
      const [claim, contracts] = await Promise.all([claimResp, contractsResp]);
      const { settled, matched, counterparty, owner, market, hash, type } =
        claim;
      if (settled) {
        throw new TRPCError({
          message: "Claim already settled",
          code: "BAD_REQUEST",
        });
      }
      const cpContract = contracts.find(
        (contract) =>
          `${counterparty}${market}` ===
          `${contract.account}${contract.market}`,
      );
      if (!cpContract) {
        throw new TRPCError({
          message: "Counterparty not registered",
          code: "BAD_REQUEST",
        });
      }
      await processSpecifiContractEvents({
        claimHash: hash!,
        claimId: claim.id,
        contractAddress:
          type === "Receivable"
            ? claim.team.contractAddress
            : cpContract.contractAddress,
        tradeRef,
        userId: session.user.id,
        receivable: type === "Receivable",
      });
      return "Status Updated";
    }),
  uploadClaim: protectedProcedure
    .input(
      z.object({
        tradeRef: z.string(),
        workspace: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { tradeRef, workspace } = input;
      const claimResp = db.claim.findUniqueOrThrow({
        where: {
          tradeReference: tradeRef,
          type: "Receivable",
          team: {
            slug: workspace,
          },
        },
        include: {
          creator: true,
          settler: true,
          settlementError: true,
          team: true,
        },
      });
      const contractsResp = getCachedContracts();
      const [claim, contracts] = await Promise.all([claimResp, contractsResp]);
      const {
        settled,
        counterparty,
        owner,
        market,
        encryptedClaimData,
        hash,
        uploaded,
        currency,
      } = claim;

      if (settled) {
        throw new TRPCError({
          message: "Claim already settled",
          code: "BAD_REQUEST",
        });
      }
      if (uploaded) {
        throw new TRPCError({
          message: "Claim already uploaded",
          code: "BAD_REQUEST",
        });
      }
      const cp = contracts.find(
        (contract) =>
          `${counterparty}${market}` ===
          `${contract.account}${contract.market}`,
      );
      if (!cp) {
        throw new TRPCError({
          message: "CP not registered",
          code: "BAD_REQUEST",
        });
      }
      let latestNonce = (await kv.get<number>("latestNonce")) as number;
      const transaction = addClaims({
        amountsOwed: [BigInt(claim.amount)],
        claimIdentifiers: [hash] as `0x${string}`[],
        counterpartyAddresses: [cp.deployerAddress],
        encryptedClaimDatas: [encryptedClaimData],
        tokenNames: [currency],
        contract: bankContract(claim.team.contractAddress),
        nonce: latestNonce + 1,
      });
      await sendTransaction({
        transaction,
        account: wallet,
      });
      latestNonce++;
      await kv.set<number>(`latestNonce`, latestNonce);
      await db.claim.update({
        where: {
          tradeReference: tradeRef,
        },
        data: {
          uploaded: true,
        },
      });
      return "Claim Uploaded";
    }),
  createClaim: protectedProcedure
    .input(z.object({ claim: newClaimSchema, workspace: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { claim, workspace } = input;
      const { session } = ctx;
      const createdClaim = await createClaim({
        data: claim,
        workspace,
        userId: session.user.id,
      });
      return createdClaim.id;
    }),
  createMany: protectedProcedure
    .input(
      z.object({ claims: z.array(ReceivedClaimSchema), workspace: z.string() }),
    )
    .mutation(async ({ input, ctx }) => {
      const { claims, workspace } = input;
      const { session } = ctx;
      const createdClaims = await createMany({
        data: claims,
        workspace,
        userId: session.user.id,
      });
      return createdClaims;
    }),
});
