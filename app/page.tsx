"use client";

import { Sidebar } from "@/components/Sidebar";
import { SwipeArea } from "@/components/SwipeArea";

export default function DashboardPage() {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <SwipeArea />
      </div>
    </div>
  );
}
