import PortalLayout from "@/frontend/layout/layout";

export default function Portal({ children }: { children: React.ReactNode }) {
  return <PortalLayout>{children}</PortalLayout>;
}
