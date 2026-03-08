import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data as Comment[]);
  };

  useEffect(() => {
    fetchComments();

    // Realtime subscription
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
        (payload) => {
          setComments((prev) => [...prev, payload.new as Comment]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast({ title: "נא למלא שם ותגובה", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_name: name.trim(),
      content: content.trim(),
    });
    if (error) {
      toast({ title: "שגיאה בשליחה", description: error.message, variant: "destructive" });
    } else {
      setContent("");
      toast({ title: "התגובה נשלחה!" });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-heading font-bold">
          תגובות ({comments.length})
        </h3>
      </div>

      {/* Comment form */}
      <Card className="shadow-card">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="השם שלך"
              dir="rtl"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="כתוב תגובה..."
              dir="rtl"
              rows={3}
            />
            <Button type="submit" disabled={submitting} className="gap-1.5">
              <Send className="h-4 w-4" />
              {submitting ? "שולח..." : "שלח תגובה"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">
          אין תגובות עדיין. היה הראשון להגיב!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <Card key={comment.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-sm text-foreground">{comment.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("he-IL", {
                      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
