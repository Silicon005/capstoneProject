import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/profile', { withCredentials: true });

        if (response.status === 200) {
          setIsAuthenticated(true);
          switch (response.data.role) {
            case "STUDENT":
              navigate("/student");
              break;
            case "TEACHER":
              navigate("/teacher");
              break;
            case "ADMIN":
              navigate("/admin-dashboard");
              break;
            default:
              alert("Invalid user type");
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });

      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
