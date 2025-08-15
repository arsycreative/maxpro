// src/components/ProtectedRoute.js
"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Shield } from "lucide-react";

/**
 * ProtectedRoute
 * - Melindungi semua route di bawah /admin kecuali /admin/login dan /admin/register
 * - Memastikan redirect yang bersih dan handling loading state
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";

  // daftar route publik (bisa dengan query / subpath)
  const publicPaths = ["/admin/login", "/admin/register"];

  // helper: apakah path termasuk publik (exact atau prefix)
  const isPublicPath = (path) => {
    if (!path) return false;
    return publicPaths.some(
      (p) => path === p || path.startsWith(p + "/") || path.startsWith(p + "?")
    );
  };

  useEffect(() => {
    // tunggu sampai auth ready
    if (isLoading) return;

    const path = pathname;
    const publicRoute = isPublicPath(path);

    // jika belum login dan mencoba akses route privat -> redirect ke login
    if (!isAuthenticated && !publicRoute) {
      // gunakan replace supaya tidak menumpuk history
      router.replace("/admin/login");
      return;
    }

    // jika sudah login tapi berada di halaman login/register -> redirect ke dashboard
    if (isAuthenticated && publicRoute) {
      router.replace("/admin");
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

  // Jika tidak terautentikasi pada route privat -> tampilkan akses ditolak (UI friendly)
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
              onClick={() => router.replace("/admin/login")}
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
