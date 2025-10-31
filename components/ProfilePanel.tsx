"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import ProfilePreviewCard from "@/components/ProfilePreviewCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserProfile } from "@/lib/api";

interface ProfilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfilePanel({ open, onOpenChange }: ProfilePanelProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: profile, status } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => getUserProfile(session!.user.id!),
    enabled: !!session?.user.id && open,
  });

  // Debug logging
  console.log("ProfilePanel Debug:", {
    open,
    session: session?.user?.id,
    status,
    profile: profile
      ? {
          name: profile.name,
          profilePhotos: profile.profilePhotos?.length,
          bio: profile.bio,
        }
      : null,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto p-0 md:max-w-sm">
        <DialogHeader className="sr-only">
          <DialogTitle>Your Profile</DialogTitle>
        </DialogHeader>

        {status === "pending" && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        )}

        {status === "success" && profile && (
          <div className="space-y-4">
            {/* Profile Preview Card */}
            <div className="h-[550px] max-w-sm">
              <ProfilePreviewCard currentUser={profile} showBio={false} className="rounded-none" />
            </div>

            {/* Bio Card */}
            <Card className="mb-6 gap-2 rounded-none p-4">
              <h3 className="font-semibold">About Me</h3>
              <p className="text-muted-foreground">{profile.bio || "No bio provided yet."}</p>
            </Card>

            {/* Edit Button */}
            <div className="px-4 pb-6">
              <Button
                className="w-full"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/profile");
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-muted-foreground">Failed to load profile. Please try again.</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
