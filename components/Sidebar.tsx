"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { MatchesTab } from "@/components/MatchesTab";
import { MessagesTab } from "@/components/MessagesTab";
import ProfilePanel from "@/components/ProfilePanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserProfile, signOutUser } from "@/lib/api";
import { getFirstName } from "@/lib/utils";

export function Sidebar() {
  const { data: session, status: sessionStatus } = useSession();
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);

  const { data: profile, status: profileStatus } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => getUserProfile(session!.user.id!),
    enabled: sessionStatus === "authenticated",
  });

  const signOutMutation = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      toast.success("Signed out successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error signing out: ${error.message}`);
    },
  });

  return (
    <div className="bg-background relative z-30 w-96 space-y-2 border-r py-4">
      <header className="flex items-center justify-between border-b px-4 pt-0 pb-4">
        {(sessionStatus === "loading" || profileStatus === "pending") && (
          <Skeleton className="h-12 w-24 rounded-full" />
        )}
        {sessionStatus === "authenticated" && profileStatus === "success" && (
          <Button
            variant="ghost"
            className="size-auto rounded-full p-1 pr-2.5"
            onClick={() => setProfilePanelOpen(true)}
          >
            <Avatar>
              <AvatarImage src={profile.profilePhotos[0]} alt="@shadcn" />
              <AvatarFallback>{getFirstName(profile.name).charAt(0)}</AvatarFallback>
            </Avatar>
            {getFirstName(profile.name)}
          </Button>
        )}
        <Button
          onClick={() => signOutMutation.mutate()}
          disabled={signOutMutation.isPending}
          variant="destructive"
        >
          {signOutMutation.isPending ? "Signing Out..." : "Sign Out"}
        </Button>
      </header>
      <Tabs defaultValue="matches" className="w-full px-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="matches" className="mt-4">
          <MatchesTab />
        </TabsContent>
        <TabsContent value="messages" className="mt-4">
          <MessagesTab />
        </TabsContent>
      </Tabs>

      <ProfilePanel open={profilePanelOpen} onOpenChange={setProfilePanelOpen} />
    </div>
  );
}
