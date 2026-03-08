// Admin API helpers - all admin operations go through edge functions

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function getAdminPassword(): string {
  // Get from AdminAuth context stored in sessionStorage for edge function calls
  return sessionStorage.getItem("admin_password") || "";
}

export function setAdminPassword(password: string) {
  sessionStorage.setItem("admin_password", password);
}

async function adminFetch(url: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-admin-password": getAdminPassword(),
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res;
}

export const adminApi = {
  posts: {
    list: async () => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=list`);
      return res.json();
    },
    get: async (id: string) => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=get&id=${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=create`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=update&id=${id}`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=delete&id=${id}`, {
        method: "POST",
      });
      return res.json();
    },
    stats: async () => {
      const res = await adminFetch(`${FUNCTIONS_URL}/admin-posts?action=stats`);
      return res.json();
    },
  },
  ai: {
    stream: async (params: { prompt: string; context?: string; action: string }) => {
      const res = await adminFetch(`${FUNCTIONS_URL}/ai-write`, {
        method: "POST",
        body: JSON.stringify(params),
      });
      return res;
    },
  },
};
