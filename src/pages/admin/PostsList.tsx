import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, string> = { guide: "מדריך", column: "טור", news: "חדשות" };
const statusLabels: Record<string, string> = { draft: "טיוטה", published: "פורסם" };

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const data = await adminApi.posts.list();
      setPosts(data);
    } catch (e: any) {
      toast({ title: "שגיאה", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await adminApi.posts.delete(id);
      toast({ title: "הפוסט נמחק בהצלחה" });
      fetchPosts();
    } catch (e: any) {
      toast({ title: "שגיאה", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">כל הפוסטים</h2>
        <Button asChild className="gradient-primary">
          <Link to="/admin/posts/new">
            <PlusCircle className="ml-2 h-4 w-4" />
            פוסט חדש
          </Link>
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">טוען...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>אין פוסטים עדיין</p>
              <Button asChild className="mt-4 gradient-primary">
                <Link to="/admin/posts/new">צור פוסט ראשון</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>כותרת</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title || "ללא כותרת"}</TableCell>
                    <TableCell><Badge variant="secondary">{typeLabels[post.post_type] || post.post_type}</Badge></TableCell>
                    <TableCell><Badge variant={post.status === "published" ? "default" : "outline"}>{statusLabels[post.status] || post.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(post.created_at).toLocaleDateString("he-IL")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/posts/${post.id}`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
