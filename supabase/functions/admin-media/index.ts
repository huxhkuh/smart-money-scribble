import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_PASSWORD = "123456";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const password = req.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    switch (action) {
      case "list": {
        const { data, error } = await supabase.storage.from("media").list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) throw error;
        const files = (data || [])
          .filter((f: any) => f.name !== ".emptyFolderPlaceholder")
          .map((f: any) => ({
            name: f.name,
            url: `${supabaseUrl}/storage/v1/object/public/media/${f.name}`,
            created_at: f.created_at || "",
          }));
        return new Response(JSON.stringify(files), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upload": {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        if (!file) throw new Error("No file provided");
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from("media").upload(fileName, file);
        if (error) throw error;
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/media/${fileName}`;
        return new Response(JSON.stringify({ name: fileName, url: publicUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete": {
        const body = await req.json();
        const { name } = body;
        if (!name) throw new Error("No file name provided");
        const { error } = await supabase.storage.from("media").remove([name]);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (e) {
    console.error("admin-media error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
