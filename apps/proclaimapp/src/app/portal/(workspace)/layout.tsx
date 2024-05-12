import Sidebar from "@/frontend/layout/sidebar";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-6 gap-6">
      <Sidebar />
      <div className="col-span-5 flex flex-col">{children}</div>
    </div>
  );
}
