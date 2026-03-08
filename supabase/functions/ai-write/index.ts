import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
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

  try {
    const { prompt, context, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    
    if (action === "write") {
      systemPrompt = `אתה כותב תוכן מקצועי בעברית. כתוב תוכן ברור, מעניין ומקצועי.
תמיד כתוב בעברית. אם מבקשים ממך לכתוב מאמר או פוסט, החזר את התוכן בפורמט HTML פשוט עם תגיות <p>, <strong>, <em>, <ul>, <li>, <h3>.
אל תשתמש בתגיות <html>, <body> או <head>. רק את התוכן עצמו.`;
    } else if (action === "improve") {
      systemPrompt = `אתה עורך תוכן מקצועי בעברית. שפר את הטקסט הנתון - הפוך אותו ליותר ברור, מקצועי ומעניין.
שמור על המשמעות המקורית אבל שפר את הניסוח, הדקדוק והזרימה.
החזר את התוכן בפורמט HTML פשוט עם תגיות <p>, <strong>, <em>, <ul>, <li>, <h3>.`;
    } else if (action === "summarize") {
      systemPrompt = `אתה מסכם תוכן מקצועי בעברית. צור תקציר קצר וממצה של התוכן הנתון.
החזר את התקציר כפסקה אחת או שתיים.`;
    } else if (action === "expand") {
      systemPrompt = `אתה כותב תוכן מקצועי בעברית. הרחב את הטקסט הנתון - הוסף פרטים, דוגמאות והסברים.
החזר את התוכן בפורמט HTML פשוט עם תגיות <p>, <strong>, <em>, <ul>, <li>, <h3>.`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: context ? `${prompt}\n\nתוכן קיים:\n${context}` : prompt },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד כמה שניות" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נדרש תשלום - הוסף קרדיטים" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-write error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
