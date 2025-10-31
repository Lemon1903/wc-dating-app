import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log("Setting up Supabase storage bucket for profile photos...");

    // Create the profile-photos bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error("Error listing buckets:", listError);
      return;
    }

    const bucketExists = buckets.some((bucket) => bucket.name === "profile-photos");

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket("profile-photos", {
        public: true, // Make bucket public for easy access to profile photos
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        fileSizeLimit: 5242880, // 5MB limit per file
      });

      if (error) {
        console.error("Error creating bucket:", error);
        return;
      }

      console.log("✅ Created profile-photos bucket");
    } else {
      console.log("✅ profile-photos bucket already exists");
    }

    // Set up RLS policies for the bucket
    console.log("Setting up storage policies...");

    // Allow authenticated users to upload their own profile photos
    const { error: uploadPolicyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "profile-photos",
      policy_name: "Users can upload their own profile photos",
      definition: `
        bucket_id = (select id from storage.buckets where name = 'profile-photos')
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
      `,
      operation: "INSERT",
    });

    if (uploadPolicyError && !uploadPolicyError.message.includes("already exists")) {
      console.error("Error creating upload policy:", uploadPolicyError);
    } else {
      console.log("✅ Upload policy configured");
    }

    // Allow public read access to profile photos
    const { error: readPolicyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "profile-photos",
      policy_name: "Public read access to profile photos",
      definition: `
        bucket_id = (select id from storage.buckets where name = 'profile-photos')
      `,
      operation: "SELECT",
    });

    if (readPolicyError && !readPolicyError.message.includes("already exists")) {
      console.error("Error creating read policy:", readPolicyError);
    } else {
      console.log("✅ Read policy configured");
    }

    console.log("🎉 Storage setup complete!");
  } catch (error) {
    console.error("Unexpected error:", error);
    process.exit(1);
  }
}

setupStorage();
