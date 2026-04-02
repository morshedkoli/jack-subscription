import { DashboardOverview } from "@/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | dRecharge",
  description: "Manage domain subscription expiry dates",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
