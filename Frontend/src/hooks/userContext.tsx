import { createContext, useContext, useState } from "react";

interface UserContextType {
  userId: string | null;
  role: string | null;
  userName: string | null;
  userEmail: string | null;
  setUser: (id: string, type: string, name: string, email: string) => void;
  clearUserData: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function for initial state retrieval
const getStoredUserData = () => ({
  userId: localStorage.getItem('userId'),
  role: localStorage.getItem('role'),
  userName: localStorage.getItem('userName'),
  userEmail: localStorage.getItem('userEmail'),
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const storedData = getStoredUserData();

  const [userId, setUserId] = useState<string | null>(storedData.userId);
  const [role, setrole] = useState<string | null>(storedData.role);
  const [userName, setUserName] = useState<string | null>(storedData.userName);
  const [userEmail, setUserEmail] = useState<string | null>(storedData.userEmail);
  const [unseenCount, setUnseenCount] = useState(0);
  const setUser = (id: string, type: string, name: string, email: string) => {
    setUserId(id);
    setrole(type);
    setUserName(name);
    setUserEmail(email);
    localStorage.setItem('userId', id);
    localStorage.setItem('role', type);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
  };

 const clearUserData = async () => {
    setUserId(null);
    setrole(null);
    setUserName(null);
    setUserEmail(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  // console.log(userId, role, userName, userEmail);

  return (
    <UserContext.Provider value={{ userId, role, userName, userEmail, setUser, clearUserData , unseenCount, setUnseenCount}}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}