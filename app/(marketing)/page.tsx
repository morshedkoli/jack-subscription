import { 
  HeroSection, 
  FeaturesSection, 
  ApiSection, 
  CtaSection 
} from "@/components/marketing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "dRecharge - Domain Subscription Checker",
  description: "Admin-managed domain expiry dashboard with public domain status check API.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ApiSection />
      <CtaSection />
    </>
  );
}
