import { supabase } from "@/lib/supabase";
import { ResponseResult } from "@/types";

export async function uploadProfilePhotos(
  files: (File | undefined)[],
): Promise<ResponseResult<string[]>> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!file) continue;

    // Generate unique filename (e.g. 1627384950123-abc123xyz.png)
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    // Upload file to Supabase storage
    const { error } = await supabase.storage.from("profile-photos").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Error uploading file:", error);
      return { error: error.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  return { data: uploadedUrls };
}
