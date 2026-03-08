import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Block } from "@/types/blocks";
import BlockRenderer from "@/components/editor/BlockRenderer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentsSection from "@/components/comments/CommentsSection";

const typeLabels: Record<string, string> = {
  guide: "מדריך",
  column: "טור",
  news: "חדשות",
};

const typeColors: Record<string, string> = {
  guide: "bg-primary/10 text-primary border-primary/20",
  column: "bg-accent/10 text-accent-foreground border-accent/20",
  news: "bg-destructive/10 text-destructive border-destructive/20",
};

function estimateReadTime(blocks: Block[]): number {
  const text = blocks.map(b => b.content?.html || b.content?.text || "").join(" ");
  const words = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <p className="text-xl">הפוסט לא נמצא</p>
      <Link to="/" className="text-primary hover:underline">חזרה לדף הבית</Link>
    </div>
  );

  const blocks = Array.isArray(post.content) ? (post.content as unknown as Block[]) : [];
  const readTime = estimateReadTime(blocks);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="min-h-screen" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {post.cover_image ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-[50vh] min-h-[400px] object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end">
              <div className="max-w-4xl mx-auto w-full px-6 pb-10">
                <Badge className={`mb-4 ${typeColors[post.post_type] || ""}`}>
                  {typeLabels[post.post_type]}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-12 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <Link
                to={post.post_type === "guide" ? "/guides" : post.post_type === "column" ? "/columns" : "/"}
                className="inline-flex items-center gap-1.5 text-primary hover:underline mb-6 text-sm font-medium"
              >
                <ArrowRight className="h-4 w-4" />
                חזרה
              </Link>
              <Badge className={`mb-4 ${typeColors[post.post_type] || ""}`}>
                {typeLabels[post.post_type]}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Meta bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at || post.created_at).toLocaleDateString("he-IL", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} דק׳ קריאה
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            שיתוף
          </Button>
        </div>
      </div>

      {/* Back link for cover image variant */}
      {post.cover_image && (
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <Link
            to={post.post_type === "guide" ? "/guides" : post.post_type === "column" ? "/columns" : "/"}
            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-medium"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה
          </Link>
        </div>
      )}

      {/* Content blocks */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="max-w-4xl mx-auto px-6 pb-10">
        <div className="border-t border-border pt-8">
          <CommentsSection postId={post.id} />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="border-t border-border pt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">נהנית מהמדריך? שתף אותו עם חברים</p>
          <Button onClick={handleShare} variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            שיתוף המדריך
          </Button>
        </div>
      </div>
    </article>
  );
}
