"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Code, Clock, Check, ArrowRight, Sparkles, BarChart3, Key, Globe } from "lucide-react";
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
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Domain subscription checker</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Domain Subscription{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Management
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Admin sets domain expiry dates from dashboard. Public API checks if
            domain is subscribed or expired.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg px-8 h-14"
              >
                Admin Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No user registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No API key required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Domain + expiry based</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clean domain lifecycle tracking with a premium admin UI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
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
const data = await response.json();
// {
//   domain: "example.com",
//   status: "subscribed",
//   subscribed: true,
//   expired: false,
//   expiresAt: "2026-12-31T00:00:00.000Z"
// }`;

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Public API,{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                zero setup
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Anyone can check a domain status. No API key and no account needed.
            </p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-primary to-purple-600">
                Open Admin Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-muted-foreground">check-domain.js</span>
              </div>
              <pre className="p-6 overflow-x-auto text-sm">
                <code className="text-muted-foreground">{codeExample}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-gradient-to-r from-primary to-purple-600 p-8 md:p-16 overflow-hidden"
        >
          <div className="relative text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to manage domains?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Log in as admin and control domain subscription expiry in one place.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8">
                Admin Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
