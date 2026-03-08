import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Block } from "@/types/blocks";
import BlockRenderer from "@/components/editor/BlockRenderer";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";

const typeLabels: Record<string, string> = {
  guide: "מדריך",
  column: "טור",
  news: "חדשות",
};

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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">הפוסט לא נמצא</div>;

  const blocks = Array.isArray(post.content) ? (post.content as unknown as Block[]) : [];

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link to={post.post_type === "guide" ? "/guides" : post.post_type === "column" ? "/columns" : "/"} className="inline-flex items-center gap-1 text-primary hover:underline mb-4 text-sm">
        <ArrowRight className="h-4 w-4" />
        חזרה
      </Link>
      <Badge className="mb-4">{typeLabels[post.post_type]}</Badge>
      {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full rounded-xl max-h-96 object-cover mb-6" />}
      <h1 className="text-4xl font-heading font-bold mb-3">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Calendar className="h-4 w-4" />
        {new Date(post.published_at || post.created_at).toLocaleDateString("he-IL")}
      </div>
      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}
