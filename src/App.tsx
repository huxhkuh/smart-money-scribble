import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Guides from "./pages/Guides";
import Columns from "./pages/Columns";
import Calculators from "./pages/Calculators";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import PostsList from "./pages/admin/PostsList";
import PostEditor from "./pages/admin/PostEditor";
import MediaLibrary from "./pages/admin/MediaLibrary";
import PostView from "./pages/PostView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/columns" element={<Columns />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/post/:slug" element={<PostView />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<PostsList />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostEditor />} />
              <Route path="media" element={<MediaLibrary />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
