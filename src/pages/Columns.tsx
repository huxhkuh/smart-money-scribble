import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar } from "lucide-react";

export default function Columns() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("post_type", "column")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching columns:", error);
        }
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4">
          <Newspaper className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-heading font-bold mb-3">טורים</h1>
        <p className="text-lg text-muted-foreground">טורי דעה וניתוח כלכלי</p>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">טוען...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">אין טורים עדיין</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link to={`/post/${post.slug}`} key={post.id}>
              <Card className="shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 h-full">
                {post.cover_image && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">טור</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  {post.excerpt && <CardDescription>{post.excerpt}</CardDescription>}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
