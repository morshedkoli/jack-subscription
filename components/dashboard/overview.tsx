"use client";

import { useState } from "react";
import { differenceInDays, format, isAfter } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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
        className: "bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-red-500/20",
      };
    } else if (daysLeft <= 30) {
      return {
        label: `${daysLeft}d left`,
        className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-amber-500/20",
      };
    } else {
      return {
        label: "Active",
        className: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20",
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Domain Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage domain expiry dates.
          </p>
        </div>
        <Button onClick={handleAddNew} className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total", value: domains.length },
          { label: "Active", value: activeCount },
          { label: "Expiring Soon", value: expiringCount },
          { label: "Expired", value: expiredCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-semibold">{stat.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Domain Registry</CardTitle>
            <CardDescription>All registered domains with expiration tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-md" />
                ))}
              </>
            ) : domains.length === 0 ? (
              <div className="rounded-md border p-8 text-center">
                <Globe className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No domains yet</p>
              </div>
            ) : (
              <AnimatePresence>
                {domains.map((item) => {
                  const status = formatStatus(item.expiresAt);
                  return (
                    <div key={item.id} className="rounded-md border p-3 sm:p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="break-all font-medium">{item.domain}</p>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            Expires {format(new Date(item.expiresAt), "MMM d, yyyy")}
                          </p>
                          {item.notes && <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${status.className} border`}>{status.label}</Badge>
                          <Button variant="outline" size="sm" onClick={() => handleRenewDomain(item)}>
                            <RefreshCw className="mr-1 h-3.5 w-3.5" />
                            Renew
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Public API Test</CardTitle>
            <CardDescription className="font-mono text-xs">
              GET /api/v1/check-domain?domain=example.com
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={checkDomain}
                onChange={(e) => setCheckDomain(e.target.value)}
                placeholder="example.com"
                onKeyDown={(e) => e.key === "Enter" && handlePublicCheck()}
              />
              <Button onClick={handlePublicCheck} variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Check
              </Button>
            </div>

            {checkResult && (
              <div className="rounded-md border p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <strong>{checkResult.status}</strong>
                </div>
                <div className="mt-1 flex justify-between gap-3">
                  <span className="text-muted-foreground">Subscribed</span>
                  <strong>{String(checkResult.subscribed)}</strong>
                </div>
                <div className="mt-1 flex justify-between gap-3">
                  <span className="text-muted-foreground">Expired</span>
                  <strong>{String(checkResult.expired)}</strong>
                </div>
                <div className="mt-1 flex justify-between gap-3">
                  <span className="text-muted-foreground">Expires At</span>
                  <strong className="break-all text-right">{checkResult.expiresAt ?? "N/A"}</strong>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isRenewing ? (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Renew Domain
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
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
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isRenewing}
              />
              {isRenewing && <p className="text-xs text-muted-foreground">Domain name cannot be changed during renewal</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">{isRenewing ? "New Expiry Date" : "Expiry Date"}</Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
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
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isRenewing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renew Domain
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Domain
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
