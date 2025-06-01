import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();
export const RoleContext = createContext();

export function AuthProvider({ children }) {
  // const user = use
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const value = { currentUser };
  const isStuff = currentUser?.email.includes("@healthcare.com");

  return (
    <RoleContext.Provider value={isStuff}>
        <AuthContext.Provider value={value}>
        {!loading && children}
        </AuthContext.Provider>
    </RoleContext.Provider>
  );
}