import { SettingsForm } from "@/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | dRecharge",
  description: "Manage your account settings",
};

export default function SettingsPage() {
  return <SettingsForm />;
}
