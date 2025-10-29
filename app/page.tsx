"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="border-primary stroke-primary mx-auto mb-4 size-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen p-4">
      <div className="mx-auto max-w-4xl">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Welcome to Connect!</h1>
            <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Your Profile</h2>
              <p className="text-muted-foreground">Email: {session.user?.email}</p>
              <p className="text-muted-foreground">Name: {session.user?.name || "Not provided"}</p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">🚧 Under Construction</h3>
              <p className="text-muted-foreground text-sm">
                This is your dashboard. More features like profile editing, matching, and messaging
                will be added soon!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
