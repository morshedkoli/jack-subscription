"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SettingsForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Admin account information
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>
              This application is managed by a single admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{session?.user?.name || "Administrator"}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  <p className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary">
                    <Shield className="h-3 w-3" />
                    Admin role
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    toast.success("Update ADMIN_EMAIL and ADMIN_PASSWORD in .env");
                    setIsLoading(false);
                  }, 500);
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "How to change admin credentials"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
