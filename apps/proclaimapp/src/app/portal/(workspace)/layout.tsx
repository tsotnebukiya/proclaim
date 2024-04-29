import Sidebar from "@/frontend/layout/sidebar";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-5 gap-6">
      <Sidebar />
      <div className="col-span-4">{children}</div>
    </div>
  );
}
