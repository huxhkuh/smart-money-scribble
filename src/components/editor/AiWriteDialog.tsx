import { useState } from "react";
import { adminApi } from "@/lib/adminApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Wand2, Expand, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AiWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentGenerated: (content: string) => void;
  existingContent?: string;
}

const actions = [
  { id: "write", label: "כתוב תוכן חדש", icon: Sparkles, description: "כתוב תוכן מאפס לפי הנחיה" },
  { id: "improve", label: "שפר טקסט קיים", icon: Wand2, description: "שפר ניסוח ודקדוק של תוכן קיים" },
  { id: "expand", label: "הרחב תוכן", icon: Expand, description: "הוסף פרטים ודוגמאות לתוכן קיים" },
  { id: "summarize", label: "סכם תוכן", icon: FileText, description: "צור תקציר של תוכן קיים" },
];

export default function AiWriteDialog({ open, onOpenChange, onContentGenerated, existingContent }: AiWriteDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedAction, setSelectedAction] = useState("write");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim() && selectedAction === "write") {
      toast({ title: "הזן הנחיה", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await adminApi.ai.stream({
        prompt: prompt || "שפר את הטקסט הבא",
        context: selectedAction !== "write" ? existingContent : undefined,
        action: selectedAction,
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setResult(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast({ title: "שגיאה ביצירת תוכן", description: e.message, variant: "destructive" });
    }

    setLoading(false);
  };

  const handleInsert = () => {
    if (result) {
      onContentGenerated(result);
      setResult("");
      setPrompt("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            כתיבה עם AI
          </DialogTitle>
          <DialogDescription>
            בחר פעולה וכתוב הנחיה ליצירת תוכן באמצעות בינה מלאכותית
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={selectedAction === action.id ? "default" : "outline"}
                className={`justify-start gap-2 h-auto py-3 ${selectedAction === action.id ? "gradient-primary" : ""}`}
                onClick={() => setSelectedAction(action.id)}
              >
                <action.icon className="h-4 w-4 shrink-0" />
                <div className="text-right">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label>
              {selectedAction === "write" ? "על מה לכתוב?" : "הנחיות נוספות (אופציונלי)"}
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selectedAction === "write"
                  ? "לדוגמה: כתוב מדריך על חיסכון במס הכנסה עם 5 טיפים מעשיים"
                  : "לדוגמה: הפוך את הטקסט ליותר מקצועי ופורמלי"
              }
              dir="rtl"
              rows={3}
            />
          </div>

          {/* Existing content preview for non-write actions */}
          {selectedAction !== "write" && existingContent && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">תוכן קיים שישמש כבסיס:</Label>
              <div className="bg-muted/50 rounded-lg p-3 text-sm max-h-24 overflow-y-auto text-muted-foreground">
                {existingContent.substring(0, 300)}{existingContent.length > 300 ? "..." : ""}
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full gradient-primary gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                יוצר תוכן...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                צור תוכן
              </>
            )}
          </Button>

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <Label>תוצאה:</Label>
              <div
                className="bg-muted/30 border rounded-lg p-4 prose prose-sm max-w-none max-h-60 overflow-y-auto"
                dir="rtl"
                dangerouslySetInnerHTML={{ __html: result }}
              />
              <div className="flex gap-2">
                <Button onClick={handleInsert} className="gradient-primary flex-1">
                  הוסף לפוסט
                </Button>
                <Button variant="outline" onClick={handleGenerate} disabled={loading}>
                  נסה שוב
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
