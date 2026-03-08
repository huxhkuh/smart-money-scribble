import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "@/lib/adminApi";
import { Block } from "@/types/blocks";
import BlockEditor from "@/components/editor/BlockEditor";
import BlockRenderer from "@/components/editor/BlockRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Undo, Redo, Send, Sparkles } from "lucide-react";
import AiWriteDialog from "@/components/editor/AiWriteDialog";
import TagsInput from "@/components/editor/TagsInput";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = !id || id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [postType, setPostType] = useState<string>("guide");
  const [status, setStatus] = useState<string>("draft");
  const [coverImage, setCoverImage] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  // Undo/Redo
  const [history, setHistory] = useState<Block[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateBlocks = useCallback((newBlocks: Block[]) => {
    setBlocks(newBlocks);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    if (!isNew && id) {
      adminApi.posts.get(id).then((data) => {
        if (data) {
          setTitle(data.title);
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setPostType(data.post_type);
          setStatus(data.status);
          setCoverImage(data.cover_image || "");
          const content = Array.isArray(data.content) ? data.content as Block[] : [];
          setBlocks(content);
          setHistory([content]);
          setHistoryIndex(0);
        }
      }).catch((e) => {
        toast({ title: "שגיאה בטעינת הפוסט", description: e.message, variant: "destructive" });
      });
    }
  }, [id, isNew]);

  const generateSlug = (text: string) => {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\u0590-\u05FFa-zA-Z0-9-]/g, "")
      .substring(0, 80);
  };

  const handleSave = async (silent = false) => {
    setSaving(true);
    const postData = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      post_type: postType,
      status,
      cover_image: coverImage,
      content: blocks,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    try {
      if (isNew) {
        const data = await adminApi.posts.create(postData);
        if (!silent) toast({ title: "נשמר בהצלחה!" });
        navigate(`/admin/posts/${data.id}`, { replace: true });
      } else {
        await adminApi.posts.update(id!, postData);
        if (!silent) toast({ title: "נשמר בהצלחה!" });
      }
    } catch (e: any) {
      toast({ title: "שגיאה בשמירה", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    const postData = {
      title,
      slug: slug || generateSlug(title),
      excerpt,
      post_type: postType,
      status: "published",
      cover_image: coverImage,
      content: blocks,
      published_at: new Date().toISOString(),
    };
    try {
      if (isNew) {
        const data = await adminApi.posts.create(postData);
        toast({ title: "פורסם בהצלחה!" });
        navigate(`/admin/posts/${data.id}`, { replace: true });
      } else {
        await adminApi.posts.update(id!, postData);
        toast({ title: "פורסם בהצלחה!" });
      }
      setStatus("published");
    } catch (e: any) {
      toast({ title: "שגיאה בפרסום", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleAiContent = (content: string) => {
    // Parse AI content into text blocks
    const paragraphs = content.split(/\n\n+/).filter(Boolean);
    const newBlocks: Block[] = paragraphs.map((p) => ({
      id: crypto.randomUUID(),
      type: "text" as const,
      content: { html: p.startsWith("<") ? p : `<p>${p}</p>` },
    }));
    if (newBlocks.length > 0) {
      updateBlocks([...blocks, ...newBlocks]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl font-heading font-bold">{isNew ? "פוסט חדש" : "עריכת פוסט"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAiDialogOpen(true)} className="gap-1.5 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-950/30">
            <Sparkles className="h-4 w-4" />
            כתיבה עם AI
          </Button>
          <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSave()} disabled={saving}>
            <Save className="ml-1 h-4 w-4" />
            {saving ? "שומר..." : "שמור"}
          </Button>
          <Button size="sm" className="gradient-primary" onClick={handlePublish}>
            <Send className="ml-1 h-4 w-4" />
            פרסם
          </Button>
        </div>
      </div>

      {/* Meta fields */}
      <Card className="shadow-card">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 md:col-span-2">
            <Label>כותרת</Label>
            <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(generateSlug(e.target.value)); }} placeholder="כותרת הפוסט" dir="rtl" />
          </div>
          <div className="space-y-1">
            <Label>סוג תוכן</Label>
            <Select value={postType} onValueChange={setPostType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="guide">מדריך</SelectItem>
                <SelectItem value="column">טור</SelectItem>
                <SelectItem value="news">חדשות</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>סטטוס</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">טיוטה</SelectItem>
                <SelectItem value="published">פורסם</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label>תקציר</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="תקציר קצר..." dir="rtl" rows={2} />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" dir="ltr" />
          </div>
          <div className="space-y-1">
            <Label>תמונת כותרת URL</Label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." dir="ltr" />
          </div>
        </CardContent>
      </Card>

      {/* Editor / Preview tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">עריכה</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="ml-1 h-4 w-4" />
            תצוגה מקדימה
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <BlockEditor blocks={blocks} onChange={updateBlocks} />
        </TabsContent>
        <TabsContent value="preview">
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              {coverImage && <img src={coverImage} alt={title} className="w-full rounded-xl max-h-80 object-cover" />}
              <h1 className="text-3xl font-heading font-bold">{title || "ללא כותרת"}</h1>
              {excerpt && <p className="text-muted-foreground text-lg">{excerpt}</p>}
              <hr className="border-border" />
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AiWriteDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        onContentGenerated={handleAiContent}
        existingContent={blocks.map(b => b.content?.html || b.content?.text || "").filter(Boolean).join("\n")}
      />
    </div>
  );
}
