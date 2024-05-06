import Funding from "@/frontend/components/funding/funding";

import { api } from "@/trpc/server";

export default async function FundingPage({
  params,
}: {
  params: { ccy: string };
}) {
  const { ccy } = params;
  const fundingData = await api.funding.getGeneralData({ token: ccy });

  return <Funding ccy={ccy} fundingData={fundingData} />;
}
