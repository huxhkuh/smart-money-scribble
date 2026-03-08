import { useEffect, useState, useRef } from "react";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Copy, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      const data = await adminApi.media.list();
      setFiles(data || []);
    } catch (e: any) {
      toast({ title: "שגיאה בטעינת קבצים", description: e.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await adminApi.media.upload(file);
      toast({ title: "הקובץ הועלה בהצלחה" });
      fetchFiles();
    } catch (err: any) {
      toast({ title: "שגיאה בהעלאה", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const handleDelete = async (name: string) => {
    try {
      await adminApi.media.delete(name);
      toast({ title: "הקובץ נמחק" });
      fetchFiles();
    } catch (err: any) {
      toast({ title: "שגיאה במחיקה", description: err.message, variant: "destructive" });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "הקישור הועתק" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">ספריית מדיה</h2>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gradient-primary">
            <Upload className="ml-2 h-4 w-4" />
            {uploading ? "מעלה..." : "העלה תמונה"}
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Image className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>אין תמונות בספרייה</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <Card key={file.name} className="shadow-card overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => copyUrl(file.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(file.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground truncate">{file.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
