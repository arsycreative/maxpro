/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { redirectToWhatsApp } from "@/app/utils/whatsapp";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Katalog", href: "/catalog" },
    { name: "Galeri", href: "/gallery" },
    { name: "Kontak", href: "/contact" },
  ];

  const toggleMenu = () => setIsOpen((v) => !v);

  const firstSegment = pathname?.split("/")[1];
  if (firstSegment === "admin") return null;

  // --- Popover state & refs ---
  // openFrom: null | "desktop" | "mobile"
  const [openFrom, setOpenFrom] = useState(null);
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    left: 0,
    placeAbove: false,
  });

  const desktopBtnRef = useRef(null);
  const mobileBtnRef = useRef(null);

  function computePopoverPosition(rect, width = 220, height = 92) {
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove > height + 12 && spaceAbove > spaceBelow;
    let top = placeAbove ? rect.top - height - 8 : rect.bottom + 8;

    // align popover right edge with button right edge
    let left = rect.right - width;
    const minLeft = 8;
    const maxLeft = window.innerWidth - width - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    return { top, left, placeAbove };
  }

  const openPopover = (which) => {
    const btn =
      which === "desktop" ? desktopBtnRef.current : mobileBtnRef.current;
    if (!btn) {
      // fallback center
      setPopoverPos({
        top: Math.max(80, window.innerHeight / 2 - 46),
        left: Math.max(8, window.innerWidth / 2 - 110),
        placeAbove: false,
      });
    } else {
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    setOpenFrom(which);
  };

  const closePopover = () => setOpenFrom(null);

  // outside click & Esc handling
  useEffect(() => {
    function onDocClick(e) {
      if (!openFrom) return;
      const pop = document.getElementById("navbar-whatsapp-popover");
      if (pop && pop.contains(e.target)) return;
      const origin =
        openFrom === "desktop" ? desktopBtnRef.current : mobileBtnRef.current;
      if (origin && origin.contains(e.target)) return;
      setOpenFrom(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenFrom(null);
    }
    if (openFrom) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keyup", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keyup", onKey);
    };
  }, [openFrom]);

  // recompute on resize/scroll when open
  useEffect(() => {
    if (!openFrom) return;
    function recompute() {
      const btn =
        openFrom === "desktop" ? desktopBtnRef.current : mobileBtnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [openFrom]);

  // actions
  const phone = "6285712165658";
  const openWhatsApp = (message = "Halo, saya mau tanya tentang produk") => {
    // use existing helper
    redirectToWhatsApp(message);
    closePopover();
  };
  const openPortal = () => {
    window.open(
      "https://whatsform.com/10Gv8D",
      "_blank",
      "noopener,noreferrer"
    );
    closePopover();
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-lg border-b border-red-500/20 shadow-lg shadow-red-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative h-15 lg:h-20">
                <Image
                  src="/logo.webp"
                  alt="Logo MAXPRO"
                  width={200}
                  height={80}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm lg:text-base font-medium transition-all duration-300 group ${
                    pathname === item.href
                      ? "text-red-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-red-600 transform transition-transform duration-300 ${
                      pathname === item.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </motion.div>
            ))}

            {/* WhatsApp Button (opens popover) */}
            <motion.button
              ref={desktopBtnRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                // toggle behavior: close if same open
                if (openFrom === "desktop") closePopover();
                else openPopover("desktop");
              }}
              className="btn-whatsapp px-4 lg:px-6 py-2 lg:py-3 rounded-full text-white font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transform transition-all duration-300"
            >
              <PhoneIcon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">WhatsApp</span>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6 text-white" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-red-500/20"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-4 border-t border-gray-700"
              >
                <button
                  ref={mobileBtnRef}
                  onClick={() => {
                    // open popover from mobile and close menu so popover is visible
                    openPopover("mobile");
                    toggleMenu();
                  }}
                  className="btn-whatsapp w-full px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center space-x-2 shadow-lg"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span>WhatsApp Sekarang</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPOVER - fixed element so it won't be clipped */}
      <AnimatePresence>
        {openFrom && (
          <motion.div
            id="navbar-whatsapp-popover"
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              top: popoverPos.top,
              left: popoverPos.left,
              width: 220,
              zIndex: 90,
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
            role="menu"
          >
            <button
              onClick={() => {
                const msg =
                  openFrom === "mobile"
                    ? "Halo, saya mau tanya lewat tombol cepat"
                    : "Halo, saya mau tanya tentang produk";
                openWhatsApp(msg);
              }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
              role="menuitem"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              <span className="text-sm text-gray-700">WhatsApp</span>
            </button>

            <button
              onClick={() => openPortal()}
              className="w-full text-left px-4 py-3 flex items-center gap-3 border-t border-gray-100 hover:bg-gray-50"
              role="menuitem"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14L21 3m0 0v7m0-7h-7M3 21h18"
                />
              </svg>
              <span className="text-sm text-gray-700">Portal Penyewaan</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
