// src/app/admin/layout.js
"use client";

import React from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Image from "next/image";

/**
 * AdminLayoutContent — menampilkan navbar, user info & logout hanya jika sudah login.
 * Pastikan file ini di-wrap dengan <AuthProvider> dan <ProtectedRoute> seperti export default di bawah.
 */
function AdminLayoutContent({ children }) {
  const { logout, user, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Berhasil Logout",
          text: "Anda telah keluar dari dashboard.",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          router.push("/admin/login");
        });
      }
    });
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const displayEmail = user?.email || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-24 h-24 relative">
                <Image
                  src="/logo.webp"
                  alt="MAXPRO Logo"
                  fill
                  sizes="32px"
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="text-sm text-gray-600">Memuat...</div>
              ) : user ? (
                <>
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-500">{displayEmail}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white p-2 rounded-lg shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 hover:scale-105"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                // jika belum login, tampilkan tombol ke halaman login (opsional)
                <button
                  onClick={() => router.push("/admin/login")}
                  className="text-sm text-gray-700 hover:underline px-3 py-1 rounded"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ProtectedRoute>
    </AuthProvider>
  );
}
