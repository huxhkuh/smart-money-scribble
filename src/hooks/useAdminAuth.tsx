import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = "123456";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const adminLogin = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdminAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}
