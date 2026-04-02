import { LoginForm } from "@/components/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | dRecharge",
  description: "Sign in to your dRecharge account",
};

export default function LoginPage() {
  return <LoginForm />;
}
