"use client";
import { DashboardNav } from "./dashboard-nav";
import { Card } from "../components/ui/card";

export default function Sidebar() {
  return (
    <Card className="sticky top-[131px] col-span-1 flex h-[calc(100vh-147px)] flex-1 flex-col self-start bg-muted/50 px-3 py-6">
      <DashboardNav />
    </Card>
  );
}
