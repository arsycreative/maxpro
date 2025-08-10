// src/components/ProtectedRoute.js
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Shield } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ["/admin/login", "/admin/register"];

  useEffect(() => {
    if (isLoading) return;

    const isPublic = publicPaths.includes(pathname);

    // Jika tidak login dan mencoba akses route privat -> kirim ke login
    if (!isAuthenticated && !isPublic) {
      router.push("/admin/login");
    }

    // Jika sudah login tapi berada di halaman login/register -> kirim ke dashboard
    if (isAuthenticated && isPublic) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <div className="text-white">
            <h2 className="text-xl font-semibold mb-2">
              Memverifikasi akses...
            </h2>
            <p className="text-red-100">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  // Jika route publik (login/register) -> perbolehkan children tampil
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  // Jika tidak terautentikasi pada route privat -> tampilkan akses ditolak
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>
            <p className="text-red-100 mb-6">
              Anda harus login terlebih dahulu untuk mengakses halaman admin.
            </p>
            <button
              onClick={() => router.push("/admin/login")}
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Jika sudah terautentikasi -> render anak-anak
  return <>{children}</>;
}
