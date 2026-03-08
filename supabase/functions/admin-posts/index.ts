import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ADMIN_PASSWORD = "123456";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify admin password
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
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get": {
        const id = url.searchParams.get("id");
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create": {
        const body = await req.json();
        const { tags, ...postData } = body;
        const { data, error } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();
        if (error) throw error;
        if (tags && tags.length > 0) {
          await syncPostTags(supabase, data.id, tags);
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update": {
        const id = url.searchParams.get("id");
        const body = await req.json();
        const { tags, ...postData } = body;
        const { data, error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        if (tags !== undefined) {
          await syncPostTags(supabase, id!, tags);
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get-tags": {
        const postId = url.searchParams.get("post_id");
        if (postId) {
          const { data, error } = await supabase
            .from("post_tags")
            .select("tag_id, tags(id, name, slug)")
            .eq("post_id", postId);
          if (error) throw error;
          const tagsList = data.map((pt: any) => pt.tags);
          return new Response(JSON.stringify(tagsList), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await supabase.from("tags").select("*").order("name");
        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete": {
        const id = url.searchParams.get("id");
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "stats": {
        const { data, error } = await supabase.from("posts").select("status");
        if (error) throw error;
        const total = data.length;
        const published = data.filter((p: any) => p.status === "published").length;
        const drafts = data.filter((p: any) => p.status === "draft").length;
        return new Response(JSON.stringify({ total, published, drafts }), {
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
    console.error("admin-posts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
