import ContractsList from "@/frontend/components/contracts/contracts-list";
import PrismLoader from "@/frontend/lib/prism-loader";
import { api } from "@/trpc/server";

export default async function Contracts() {
  const res = await api.contract.getContracts();
  return (
    <>
      <ContractsList items={res} />
    </>
  );
}
