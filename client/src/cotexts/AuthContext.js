import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../supabaseConfig";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const signIn = async (email, password, phone, role) => {
    console.log({ email: email, password: password, phone: phone });
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          phone: phone,
          role: role,
        },
      },
    });
    if (data) {
      setCurrentUser(data.user);
      sessionStorage.setItem("currentUser", JSON.stringify(data.user));
    } else {
      setCurrentUser(null);
    }
    return { data, error };
  };

  const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data) {
      console.log("logged in", data);
      setCurrentUser(data.user);
      sessionStorage.setItem("currentUser", JSON.stringify(data.user));
    } else {
      console.log(error);
      setCurrentUser(null);
    }
    return { data, error };
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error, lgged out", error);
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const updateCurrentUser = (e) => {
    setCurrentUser(e);
  };
  useEffect(() => {}, []);
  return (
    <AuthContext.Provider
      value={{ currentUser, signIn, signOutUser, loginUser, updateCurrentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
