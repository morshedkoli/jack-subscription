"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForm() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Admin account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
          <CardDescription>This application is managed by a single admin account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 rounded-md border p-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>
                {session?.user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">{session?.user?.name || "Administrator"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}
