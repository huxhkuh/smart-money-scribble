import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated, adminLogin } = useAdminAuth();
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      toast({ title: "ברוך הבא!" });
    } else {
      toast({ title: "סיסמה שגויה", variant: "destructive" });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-2">
            <Lock className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">כניסת מנהלים</CardTitle>
          <CardDescription>הזן סיסמה כדי לגשת ללוח הבקרה</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              required
              dir="ltr"
              autoFocus
            />
            <Button type="submit" className="w-full gradient-primary">
              כניסה
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
