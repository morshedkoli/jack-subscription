"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Plus,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isAfter, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DomainItem = {
  id: string;
  domain: string;
  expiresAt: string;
  notes?: string;
};

async function fetchDomains(): Promise<{ domains: DomainItem[] }> {
  const res = await fetch("/api/domains");
  if (!res.ok) throw new Error("Failed to fetch domains");
  return res.json();
}

export function DashboardOverview() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [domain, setDomain] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");
  const [checkDomain, setCheckDomain] = useState("");
  const [checkResult, setCheckResult] = useState<{
    status: string;
    subscribed: boolean;
    expired: boolean;
    expiresAt: string | null;
  } | null>(null);

  const handleRenewDomain = (item: DomainItem) => {
    setDomain(item.domain);
    setExpiresAt("");
    setNotes(item.notes || "");
    setIsRenewing(true);
    setIsOpen(true);
  };

  const handleAddNew = () => {
    setDomain("");
    setExpiresAt("");
    setNotes("");
    setIsRenewing(false);
    setIsOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsRenewing(false);
    setDomain("");
    setExpiresAt("");
    setNotes("");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["domains"],
    queryFn: fetchDomains,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, expiresAt, notes }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save domain");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success(isRenewing ? "Domain renewed successfully" : "Domain saved successfully");
      handleCloseDialog();
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    onError: (error: Error) => toast.error(error.message || "Failed to save domain"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/domains?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete domain");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Domain deleted successfully");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
    onError: () => toast.error("Failed to delete domain"),
  });

  const handlePublicCheck = async () => {
    if (!checkDomain.trim()) return;
    const res = await fetch(`/api/v1/check-domain?domain=${encodeURIComponent(checkDomain.trim())}`);
    if (!res.ok) {
      toast.error("Failed to check domain");
      return;
    }
    const result = await res.json();
    setCheckResult(result);
  };

  const domains = data?.domains ?? [];
  const now = new Date();
  const activeCount = domains.filter((d) => isAfter(new Date(d.expiresAt), now)).length;
  const expiredCount = domains.length - activeCount;
  const expiringCount = domains.filter((d) => {
    const exp = new Date(d.expiresAt);
    const daysLeft = differenceInDays(exp, now);
    return daysLeft > 0 && daysLeft <= 30;
  }).length;

  const formatStatus = (exp: string) => {
    const expDate = new Date(exp);
    const daysLeft = differenceInDays(expDate, now);

    if (daysLeft < 0) {
      return {
        label: "Expired",
        variant: "destructive" as const,
        className: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-500/20",
      };
    } else if (daysLeft <= 30) {
      return {
        label: `${daysLeft}d left`,
        variant: "secondary" as const,
        className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-500/20",
      };
    } else {
      return {
        label: "Active",
        variant: "default" as const,
        className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20",
      };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 18 },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Domain Subscriptions
          </h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Monitor and manage domain expiry dates from your centralized dashboard.
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          size="lg"
          variant="ghost"
          className="!bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 !text-white hover:!text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 font-semibold tracking-tight"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Domain
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {[
          {
            title: "Total Domains",
            value: domains.length,
            sub: "Registered",
            icon: Globe,
            gradient: "from-emerald-500/10 to-teal-500/10",
            iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
          },
          {
            title: "Active",
            value: activeCount,
            sub: "Currently subscribed",
            icon: CheckCircle,
            gradient: "from-green-500/10 to-emerald-500/10",
            iconBg: "bg-green-500/10 group-hover:bg-green-500/20",
            iconColor: "text-green-600 dark:text-green-400",
          },
          {
            title: "Expiring Soon",
            value: expiringCount,
            sub: "Within 30 days",
            icon: Activity,
            gradient: "from-amber-500/10 to-orange-500/10",
            iconBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
            iconColor: "text-amber-600 dark:text-amber-400",
          },
          {
            title: "Expired",
            value: expiredCount,
            sub: "Need renewal",
            icon: AlertCircle,
            gradient: "from-red-500/10 to-rose-500/10",
            iconBg: "bg-red-500/10 group-hover:bg-red-500/20",
            iconColor: "text-red-600 dark:text-red-400",
          },
        ].map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="relative overflow-hidden border-border/40 hover:border-border/80 hover:shadow-lg transition-all duration-300 group bg-card/80 backdrop-blur-sm">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.iconBg} transition-colors`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.sub}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Domain List */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/40 bg-gradient-to-r from-muted/40 to-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Domain Registry
                </CardTitle>
                <CardDescription className="mt-1 font-medium">
                  All registered domains with expiration tracking
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </>
              ) : domains.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Globe className="h-8 w-8 text-emerald-500/50" />
                  </div>
                  <p className="text-foreground text-lg font-semibold tracking-tight">No domains yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add your first domain to get started</p>
                </div>
              ) : (
                <AnimatePresence>
                  {domains.map((item, index) => {
                    const status = formatStatus(item.expiresAt);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.04 }}
                        className="group flex flex-col md:flex-row md:items-center gap-4 justify-between border border-border/40 rounded-xl p-4 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 bg-card/60 hover:bg-card"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                              <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="font-bold text-lg tracking-tight">{item.domain}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground ml-11">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">Expires {format(new Date(item.expiresAt), "MMM d, yyyy")}</span>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground ml-11 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${status.className} border px-3 py-1 font-semibold text-xs`}>
                            {status.label}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 border-emerald-500/30 font-semibold"
                            onClick={() => handleRenewDomain(item)}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                            Renew
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Public API Checker */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
          <CardHeader className="border-b border-border/40 bg-gradient-to-r from-muted/40 to-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Public API Test
            </CardTitle>
            <CardDescription className="font-mono text-xs mt-2 bg-muted/60 rounded-lg px-3 py-1.5 w-fit">
              GET /api/v1/check-domain?domain=example.com
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex gap-3">
              <Input
                value={checkDomain}
                onChange={(e) => setCheckDomain(e.target.value)}
                placeholder="example.com"
                className="h-11 bg-background/50 font-medium"
                onKeyDown={(e) => e.key === "Enter" && handlePublicCheck()}
              />
              <Button
                onClick={handlePublicCheck}
                size="lg"
                variant="ghost"
                className="!bg-gradient-to-r from-emerald-500 to-teal-600 !text-white hover:!text-white shadow-md shadow-emerald-500/20 font-semibold"
              >
                <Search className="h-4 w-4 mr-2" />
                Check
              </Button>
            </div>
            <AnimatePresence>
              {checkResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm rounded-xl border border-border/40 p-4 bg-muted/40 backdrop-blur-sm space-y-2.5 font-mono"
                >
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <strong className="text-foreground">{checkResult.status}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscribed:</span>
                    <strong className={checkResult.subscribed ? "text-emerald-600" : "text-red-600"}>
                      {String(checkResult.subscribed)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expired:</span>
                    <strong className={checkResult.expired ? "text-red-600" : "text-emerald-600"}>
                      {String(checkResult.expired)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires At:</span>
                    <strong className="text-foreground">{checkResult.expiresAt ?? "N/A"}</strong>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Update Dialog */}
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 font-bold tracking-tight">
              {isRenewing ? (
                <>
                  <RefreshCw className="h-6 w-6 text-emerald-600" />
                  Renew Domain
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 text-emerald-600" />
                  Add Domain
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isRenewing
                ? "Update the expiry date for this domain to renew the subscription."
                : "Register a new domain with its expiry date. If domain exists, it will be updated."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-sm font-semibold">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="h-11"
                disabled={isRenewing}
              />
              {isRenewing && (
                <p className="text-xs text-muted-foreground">Domain name cannot be changed during renewal</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="text-sm font-semibold">
                {isRenewing ? "New Expiry Date" : "Expiry Date"}
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="h-11"
              />
              {isRenewing && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Choose a new expiry date to extend the subscription</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!domain.trim()) {
                  toast.error("Please enter a domain");
                  return;
                }
                if (!expiresAt) {
                  toast.error("Please select an expiry date");
                  return;
                }
                createMutation.mutate();
              }}
              disabled={createMutation.isPending || !domain.trim() || !expiresAt}
              variant="ghost"
              className="!bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 !text-white hover:!text-white shadow-md"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isRenewing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew Domain
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Save Domain
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-bold tracking-tight">Delete Domain</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this domain? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
