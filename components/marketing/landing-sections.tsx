"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Clock, Code, Globe, Key, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Admin Controlled",
    description: "Only admin manages domains and expiry dates.",
  },
  {
    icon: Code,
    title: "Simple Public API",
    description: "Check domain status by name using one endpoint.",
  },
  {
    icon: Clock,
    title: "Expiry Tracking",
    description: "Track and update expiry date for every domain.",
  },
  {
    icon: BarChart3,
    title: "Domain Dashboard",
    description: "See subscribed and expired domain counts instantly.",
  },
  {
    icon: Key,
    title: "No API Keys Required",
    description: "No keys, just pass `domain` query parameter.",
  },
  {
    icon: Globe,
    title: "Domain-first Model",
    description: "Subscription status is tied directly to domain.",
  },
];

export function HeroSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Domain subscription management
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Admin sets domain expiry dates from dashboard. Public API checks if
            domain is subscribed or expired.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button size="lg" className="h-11 px-6">
                Admin Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-14 sm:py-16">
      <div className="section-shell">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">
            Clean domain lifecycle tracking with a focused admin UI.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/70 shadow-none">
              <CardContent className="p-5">
                <feature.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ApiSection() {
  const codeExample = `const response = await fetch(
  'https://your-domain.com/api/v1/check-domain?domain=example.com'
);
const data = await response.json();`;

  return (
    <section className="py-14 sm:py-16">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Public API, zero setup</h2>
            <p className="mt-4 text-muted-foreground">
              Anyone can check a domain status. No API key and no account needed.
            </p>
            <Link href="/login" className="mt-6 inline-flex">
              <Button variant="outline">
                Open Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="border-b px-4 py-2 text-sm text-muted-foreground">check-domain.js</div>
            <pre className="overflow-x-auto p-4 text-xs sm:text-sm">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-14 sm:py-16">
      <div className="section-shell">
        <div className="rounded-lg border bg-card p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to manage domains?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Log in as admin and control domain subscription expiry in one place.
          </p>
          <Link href="/login" className="mt-6 inline-flex">
            <Button>Admin Login</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
