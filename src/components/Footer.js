/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";

export default function Footer() {
  const pathname = usePathname();
  const services = [
    "Sewa Proyektor",
    "Sewa TV LED",
    "Sewa Screen",
    "Sewa Speaker",
    "Sewa Sound System",
    "Paket Seminar",
  ];

  const serviceAreas = [
    {
      name: "Yogyakarta",
      url: "https://www.google.com/maps/place/Maxpro+Kalasan+%7C+Sewa+Proyektor/@-7.7842302,110.4409965,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a5b6e6979f43d:0x959d11077e6ffbe5!8m2!3d-7.7842302!4d110.4409965!16s%2Fg%2F11ks48_1gw",
    },
    {
      name: "Bantul",
      url: "https://www.google.com/maps/place/MAXPRO+Sewa+Proyektor+Fastfold+Speaker+Screen+Layar+Lebar+Shooting+Live+Streaming+Pengajian/@-7.8648241,110.3492521,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a578c7c8123eb:0x2c96a7032c23e492!8m2!3d-7.8648241!4d110.3492521!16s%2Fg%2F11sf34hsrv",
    },
    {
      name: "Gunung Kidul",
      url: "https://www.google.com/maps/place/MAXPRO+Sewa+Proyektor+Fastfold+Speaker+Screen+Layar+Lebar+Shooting+Live+Streaming+Pengajian/@-7.8648241,110.3492521,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a578c7c8123eb:0x2c96a7032c23e492!8m2!3d-7.8648241!4d110.3492521!16s%2Fg%2F11sf34hsrv",
    },
    {
      name: "Kulonprogo",
      url: "https://www.google.com/maps/place/MAXPRO+Sewa+Proyektor+Fastfold+Speaker+Screen+Layar+Lebar+Shooting+Live+Streaming+Pengajian/@-7.8648241,110.3492521,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a578c7c8123eb:0x2c96a7032c23e492!8m2!3d-7.8648241!4d110.3492521!16s%2Fg%2F11sf34hsrv",
    },
    {
      name: "Sleman",
      url: "https://www.google.com/maps/place/MAXPRO+CONCAT+%7C+Sewa+Proyektor+cabang+Condongcatur+Sleman/@-7.738307,110.399197,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a5978b74d1bb1:0x2a39158105c808d2!8m2!3d-7.738307!4d110.399197!16s%2Fg%2F11v3rnzr1d",
    },
    {
      name: "Gejayan",
      url: "https://www.google.com/maps/place/MAXPRO+Sewa+Proyektor+Gejayan,+Jl.+Flamboyan,+Karang+Gayam,+Caturtunggal,+Kec.+Depok,+Kabupaten+Sleman,+Daerah+Istimewa+Yogyakarta+55281/data=!4m2!3m1!1s0x2e7a57fe9442107b:0x490cd0634dd82cd1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESCjExLjEyNi4xMTAYACCs3wEqWiw5NDIyMzI5OSw5NDIxNjQxMyw5NDIxMjQ5Niw5NDIwNzUwNiw5NDIwODUwNiw5NDIxNzUyMyw5NDIxODY1Myw0NzA4NzExOCw0NzA4NDM5Myw5NDIxMzIwMEICSUQ%3D",
    },
  ];

  const firstSegment = pathname?.split("/")[1];
  if (firstSegment === "admin") return null;

  // --- Popover state & refs ---
  // openFrom: null | "footer" | "fab"
  const [openFrom, setOpenFrom] = useState(null);
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    left: 0,
    placeAbove: false,
  });
  const footerBtnRef = useRef(null);
  const fabBtnRef = useRef(null);

  // compute position similar to previous components
  const computePopoverPosition = (rect, width = 220, height = 92) => {
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove > height + 12 && spaceAbove > spaceBelow;
    let top = placeAbove ? rect.top - height - 8 : rect.bottom + 8;

    // align popover right edge with button right edge then clamp
    let left = rect.right - width;
    const minLeft = 8;
    const maxLeft = window.innerWidth - width - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    return { top, left, placeAbove };
  };

  const openPopover = (which) => {
    // which: "footer" or "fab"
    const btn = which === "footer" ? footerBtnRef.current : fabBtnRef.current;
    if (!btn) {
      const top = Math.max(80, window.innerHeight / 2 - 46);
      const left = Math.max(8, window.innerWidth / 2 - 110);
      setPopoverPos({ top, left, placeAbove: false });
    } else {
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    setOpenFrom(which);
  };

  const closePopover = () => setOpenFrom(null);

  // outside click / Esc
  useEffect(() => {
    function onDocClick(e) {
      if (!openFrom) return;
      const pop = document.getElementById("footer-contact-popover");
      if (pop && pop.contains(e.target)) return;
      const origin =
        openFrom === "footer" ? footerBtnRef.current : fabBtnRef.current;
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

  // recompute on scroll/resize
  useEffect(() => {
    if (!openFrom) return;
    function recompute() {
      const btn =
        openFrom === "footer" ? footerBtnRef.current : fabBtnRef.current;
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

  // Actions
  const phone = "6285712165658";
  const openWhatsApp = (context = "konsultasi") => {
    const text = `Halo, saya mau ${context}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
    <footer className="relative bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 pt-20 pb-12">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              {/* Logo */}
              <div className="mb-6">
                <Image
                  src="/logo.webp"
                  alt="Logo MAXPRO"
                  width={180}
                  height={72}
                  className="h-auto object-contain"
                />
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Solusi terpercaya untuk kebutuhan multimedia event Anda. Sejak
                2020, kami melayani dengan profesional dan berkualitas.
              </p>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Layanan Kami
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-red-500 to-pink-500"></div>
              </h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <a
                      href="#"
                      className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <div className="w-1 h-1 bg-red-500 rounded-full group-hover:w-2 transition-all duration-300"></div>
                      <span>{service}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Service Areas & Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Area Layanan
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h3>
              <ul className="space-y-3 mb-8">
                {serviceAreas.map((area, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    className="group"
                  >
                    <a
                      href={area.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span>{area.name}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-white mb-6 relative">
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Kontak Kami
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              </h3>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-xl hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">WhatsApp</p>
                    <p className="text-green-400 text-sm">+62 857-1216-5658</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-blue-400 text-sm">
                      maxproyogya@gmail.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-orange-500/20 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Jam Operasional</p>
                    <p className="text-orange-400 text-sm">24/7 Available</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Button (now opens popover) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                className="mt-6"
              >
                <motion.button
                  ref={footerBtnRef}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openPopover("footer")}
                  aria-haspopup="menu"
                  aria-expanded={openFrom === "footer"}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-3 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  <span>Konsultasi Gratis</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 bg-black/50 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                <p>
                  © 2024{" "}
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent font-semibold">
                    MAXPRO
                  </span>
                  . All rights reserved. | Rental Multimedia Terpercaya Sejak
                  2020
                </p>
              </div>

              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online 24/7</span>
                </motion.div>

                {/* Social media links */}
                <div className="flex items-center space-x-3">
                  <a
                    href="https://www.youtube.com/@maxprosewaproyektor"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube - Maxpro"
                    className="p-2 rounded-md hover:bg-white/5 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {/* YouTube SVG */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M23.498 6.186a2.997 2.997 0 0 0-2.108-2.118C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.39.568A2.997 2.997 0 0 0 .502 6.186C0 8.03 0 12 0 12s0 3.97.502 5.814a2.997 2.997 0 0 0 2.108 2.118C4.4 20.5 12 20.5 12 20.5s7.6 0 9.39-.568a2.997 2.997 0 0 0 2.108-2.118C24 15.97 24 12 24 12s0-3.97-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/maxpro.jogja"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram - Maxpro"
                    className="p-2 rounded-md hover:bg-white/5 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {/* Instagram SVG */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                    </svg>
                  </a>

                  <a
                    href="https://www.facebook.com/muvonproject"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook - Muvon Project"
                    className="p-2 rounded-md hover:bg-white/5 transition-colors duration-200 text-gray-300 hover:text-white"
                  >
                    {/* Facebook SVG (clear 'f' logo) */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M22 12.064C22 6.48 17.523 2 12 2S2 6.48 2 12.064C2 17.086 5.656 21.128 10.438 21.954v-6.96H7.898v-2.93h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.444 2.93h-2.33v6.96C18.344 21.128 22 17.086 22 12.064z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating WhatsApp Button (now button to open popover) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        viewport={{ once: true }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          ref={fabBtnRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => openPopover("fab")}
          aria-haspopup="menu"
          aria-expanded={openFrom === "fab"}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative"
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute -inset-2 rounded-full bg-green-500/30 animate-pulse opacity-75"></div>
        </motion.button>
      </motion.div>

      {/* POPOVER - fixed element */}
      {openFrom && (
        <motion.div
          id="footer-contact-popover"
          initial={{ opacity: 0, scale: 0.98, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 6 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            top: popoverPos.top,
            left: popoverPos.left,
            width: 220,
            zIndex: 80,
          }}
          className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
          role="menu"
        >
          <button
            onClick={() => {
              const context =
                openFrom === "footer"
                  ? "mau konsultasi gratis"
                  : "mau konsultasi via tombol cepat";
              openWhatsApp(context);
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
    </footer>
  );
}
