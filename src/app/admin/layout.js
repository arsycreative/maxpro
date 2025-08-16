// src/app/admin/layout.js
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, User, Home, ImageIcon } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Image from "next/image";

/**
 * AdminLayoutContent — logo kiri, navigasi tengah, user actions kanan.
 * Navigasi hanya ditampilkan jika user sudah login.
 * Warna utama: gradasi merah tua untuk state aktif.
 */
function AdminLayoutContent({ children }) {
  const { logout, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#7f1d1d",
      cancelButtonColor: "#374151",
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

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: Home },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Berita", href: "/admin/news", icon: ImageIcon },
  ];

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/admin") return pathname === "/admin";
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      pathname.startsWith(href)
    );
  };

  // Tampilkan nav hanya jika ada user (login)
  const showNav = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Top Navigation Bar (only when logged in) */}
      {showNav && (
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Container with three areas: left / center / right */}
            <div className="flex items-center h-16 gap-4">
              {/* Left: Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/admin" className="flex items-center">
                  <div className="w-10 h-10 relative">
                    <Image
                      src="/logo.webp"
                      alt="MAXPRO Logo"
                      fill
                      sizes="40px"
                      className="object-contain rounded-md"
                    />
                  </div>
                  <span className="ml-3 font-semibold text-gray-800 hidden sm:inline">
                    MAXPRO
                  </span>
                </Link>
              </div>

              {/* Center: Navigation */}
              <div className="flex-1 flex justify-center">
                <div className="hidden md:flex items-center space-x-2 overflow-x-auto">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                          active
                            ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow"
                            : "text-gray-700 hover:bg-red-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            active ? "text-white" : "text-gray-500"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile compact nav (centered) */}
                <div className="md:hidden flex items-center space-x-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href + "-mobile"}
                        href={item.href}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-xs whitespace-nowrap ${
                          active
                            ? "bg-gradient-to-r from-red-900 to-red-700 text-white"
                            : "text-gray-700 hover:bg-red-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            active ? "text-white" : "text-gray-500"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Right: User Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {isLoading ? (
                  <div className="text-sm text-gray-600">Memuat...</div>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
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
                      className="ml-2 inline-flex items-center justify-center p-2 rounded-md bg-gradient-to-r from-red-900 to-red-700 text-white shadow hover:from-red-800 hover:to-red-600 transition"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content (adjust padding depending on whether nav is shown) */}
      <main className={`${showNav ? "pt-20" : "pt-0"} min-h-screen`}>
        {children}
      </main>
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
