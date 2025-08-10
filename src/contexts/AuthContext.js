"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // get initial session / user
  useEffect(() => {
    let mounted = true;
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("getSession error", err);
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    getSession();

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    setUser(data.user ?? null);
    return data;
  };

  const register = async (email, password) => {
    // Supabase by default sends confirmation email depending on settings.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // optional: you can pass redirectTo if using email confirmations
      // redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/auth/callback"
    });

    if (error) throw error;
    // data may contain user (if auto-confirm) or user=null and an email sent notice
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
