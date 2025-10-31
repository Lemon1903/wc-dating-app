"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import ProfilePhotosInput from "@/components/ProfilePhotosInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile, updateUserProfile } from "@/lib/api";
import { uploadProfilePhotos } from "@/services/uploadService";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhotos, setProfilePhotos] = useState<(File | undefined)[]>([
    undefined,
    undefined,
    undefined,
  ]);

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => getUserProfile(session!.user.id!),
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio || "");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("Not authenticated");

      let photoUrls = profile?.profilePhotos || [];

      // Upload new photos if any
      const newPhotos = profilePhotos.filter((photo): photo is File => photo !== undefined);
      if (newPhotos.length > 0) {
        const uploadResponse = await uploadProfilePhotos(newPhotos);
        if (uploadResponse.error) {
          throw new Error(`Failed to upload photos: ${uploadResponse.error}`);
        }
        // Replace existing photos with new ones
        photoUrls = uploadResponse.data || [];
      }

      return updateUserProfile(session.user.id, {
        name,
        bio,
        profilePhotos: photoUrls,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Profile Photos</label>

            {/* Show existing photos */}
            {profile?.profilePhotos && profile.profilePhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-muted-foreground mb-2 text-sm">Current photos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {profile.profilePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Current photo ${index + 1}`}
                        className="aspect-square rounded-lg border object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  Upload new photos below to replace existing ones
                </p>
              </div>
            )}

            <ProfilePhotosInput value={profilePhotos} onChange={setProfilePhotos} />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={updateProfileMutation.isPending} className="flex-1">
              {updateProfileMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
