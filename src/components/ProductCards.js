// src/components/ProductCards.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function ProductCards() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  // Popover state: id of product that opened popover (null = none).
  const [openContactForId, setOpenContactForId] = useState(null);
  // popover position in viewport (fixed)
  const [popoverPos, setPopoverPos] = useState({
    top: 0,
    left: 0,
    placeAbove: true,
  });

  // refs to CTA buttons (cards and modal). keys: productId (number) or `modal-${id}`
  const buttonRefs = useRef({});

  // fetch products (same as before)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .neq("category", "Promo")
        .limit(6);

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // helper icons
  const CheckIcon = () => (
    <svg
      className="w-4 h-4 text-slate-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
    </svg>
  );

  // ---------- POPOVER POSITIONING ----------
  // compute position using bounding rect of the clicked button
  function computePopoverPosition(rect) {
    const popoverW = 240; // desired popover width
    const popoverH = 96; // estimated height
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceAbove > popoverH + 12 && spaceAbove > spaceBelow;
    let top = placeAbove ? rect.top - popoverH - 8 : rect.bottom + 8;

    // align right edge of popover with right edge of button
    let left = rect.right - popoverW;
    const minLeft = 8;
    const maxLeft = window.innerWidth - popoverW - 8;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    return { top, left, placeAbove };
  }

  // Open popover for productId; refKey is the key in buttonRefs (productId or `modal-${id}`)
  const openPopover = (productId, refKey) => {
    const btn = buttonRefs.current[refKey];
    if (!btn) {
      // fallback: center of viewport
      const top = Math.max(80, window.innerHeight / 2 - 48);
      const left = Math.max(8, window.innerWidth / 2 - 120);
      setPopoverPos({ top, left, placeAbove: false });
    } else {
      const rect = btn.getBoundingClientRect();
      setPopoverPos(computePopoverPosition(rect));
    }
    setOpenContactForId(productId);
  };

  // Close popover
  const closePopover = () => setOpenContactForId(null);

  // Outside click & Escape handling
  useEffect(() => {
    function handleDocClick(e) {
      if (!openContactForId) return;
      const pop = document.getElementById("product-popover");
      // if clicked inside popover, ignore
      if (pop && pop.contains(e.target)) return;
      // if clicked the originating button, ignore (let toggle logic manage)
      const originBtn =
        buttonRefs.current[openContactForId] ||
        buttonRefs.current[`modal-${openContactForId}`];
      if (originBtn && originBtn.contains(e.target)) return;
      setOpenContactForId(null);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpenContactForId(null);
    }

    if (openContactForId !== null) {
      document.addEventListener("mousedown", handleDocClick);
      document.addEventListener("keyup", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keyup", handleEscape);
    };
  }, [openContactForId]);

  // recompute popover pos on resize / scroll if open
  useEffect(() => {
    if (openContactForId == null) return;
    function recompute() {
      const btn =
        buttonRefs.current[openContactForId] ||
        buttonRefs.current[`modal-${openContactForId}`];
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
  }, [openContactForId]);

  // --------- ACTIONS ----------
  const openWhatsApp = (title, closeModal = false) => {
    const phone = "6285712165658";
    const text = `Halo, saya mau tanya tentang ${title}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpenContactForId(null);
    if (closeModal) setModalImage(null);
  };
  const openPortal = (closeModal = false) => {
    window.open(
      "https://whatsform.com/10Gv8D",
      "_blank",
      "noopener,noreferrer"
    );
    setOpenContactForId(null);
    if (closeModal) setModalImage(null);
  };

  // ---------- Skeleton (same) ----------
  const SkeletonCard = () => (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/60 animate-pulse">
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-gray-200 h-8 w-24 rounded-full"></div>
      </div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gray-200 rounded-bl-2xl"></div>
      <div className="relative h-56 bg-gray-200"></div>
      <div className="p-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-16 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-[1.1]">
            Koleksi Produk
            <br />
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Premium Terlengkap
            </span>
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Koleksi peralatan multimedia premium dengan standar kualitas
            internasional
          </p>

          <div className="flex items-center justify-center mt-8 space-x-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-red-300"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-red-300"></div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : products.map((product, idx) => (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 ease-out ${
                    hoveredCard === product.id
                      ? "transform -translate-y-2 shadow-2xl shadow-slate-500/20"
                      : "shadow-lg shadow-slate-200/60"
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <div className="bg-white/95 backdrop-blur-sm border border-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                      {product.badge || "Premium Choice"}
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-2xl"></div>

                  {/* Image */}
                  <div
                    className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 cursor-pointer"
                    onClick={() => setModalImage(product)}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-all duration-700 ${
                        hoveredCard === product.id
                          ? "scale-110 rotate-1"
                          : "scale-105"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent transition-opacity duration-500 ${
                        hoveredCard === product.id ? "opacity-70" : "opacity-40"
                      }`}
                    ></div>

                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        hoveredCard === product.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <svg
                          className="w-6 h-6 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 leading-tight">
                      {product.title}
                    </h3>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-slate-400 text-lg line-through font-light">
                          {product.originalPrice}
                        </span>
                        <div className="px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                          Hemat{" "}
                          {Math.round(
                            (1 -
                              parseInt(product.price) /
                                parseInt(product.originalPrice)) *
                              100
                          )}
                          %
                        </div>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-sm text-slate-500 font-light">
                          Mulai dari
                        </span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                          {product.price}
                        </span>
                        <span className="text-slate-500 font-light">/hari</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-6 leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {product.features?.slice(0, 4).map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-center space-x-3 text-slate-600 text-sm"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center">
                            <CheckIcon />
                          </div>
                          <span className="font-light">{feat}</span>
                        </li>
                      )) || (
                        <li className="flex items-center space-x-3 text-slate-600 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 bg-slate-50 rounded-full flex items-center justify-center">
                            <CheckIcon />
                          </div>
                          <span className="font-light">Kualitas premium</span>
                        </li>
                      )}
                    </ul>

                    {/* CTA button: now opens popover with two choices */}
                    <button
                      ref={(el) => (buttonRefs.current[product.id] = el)}
                      className={`w-full group/btn relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-4 rounded-2xl transition-all duration-300 ${
                        hoveredCard === product.id
                          ? "shadow-xl shadow-green-500/25 scale-[1.02]"
                          : "shadow-lg"
                      }`}
                      onClick={() => openPopover(product.id, product.id)}
                      aria-haspopup="menu"
                      aria-expanded={openContactForId === product.id}
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-3">
                        <WhatsAppIcon />
                        <span>Konsultasi Sekarang</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-500/5 to-transparent rounded-tr-3xl"></div>
                </div>
              ))}
        </div>

        {/* No products message */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Belum Ada Produk
            </h3>
            <p className="text-gray-600">
              Produk sedang dalam tahap persiapan. Silakan cek kembali nanti.
            </p>
          </div>
        )}

        {/* Modal Image Preview */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto no-scrollbar"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalImage(null)}
                className="sticky top-2 left-full z-10 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg -ml-6 mb-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200">
                  <Image
                    src={modalImage.image}
                    alt={modalImage.title}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                        {modalImage.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-base line-through font-light">
                          {modalImage.originalPrice}
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                          {modalImage.price}/hari
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-100 whitespace-nowrap">
                      {modalImage.badge || "Premium Choice"}
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {modalImage.description}
                  </p>

                  {modalImage.features && modalImage.features.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-base font-semibold text-slate-900 mb-3">
                        Fitur & Kelengkapan:
                      </h4>
                      <div className="grid grid-cols-1 gap-2 max-h-24 overflow-y-auto">
                        {modalImage.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2 text-slate-600 text-sm"
                          >
                            <div className="flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* modal CTA -> opens popover too (use key `modal-{id}`) */}
                  <button
                    ref={(el) =>
                      (buttonRefs.current[`modal-${modalImage.id}`] = el)
                    }
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                    onClick={() =>
                      openPopover(modalImage.id, `modal-${modalImage.id}`)
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                    </svg>
                    <span>Konsultasi via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* bottom decoration */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center space-x-4 text-slate-400">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-red-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-light uppercase tracking-wider">
                Premium Quality Guaranteed
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-red-300"></div>
          </div>
        </div>

        {/* POPOVER - rendered fixed so it won't be clipped by cards */}
        {openContactForId && (
          <motion.div
            id="product-popover"
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "fixed",
              top: popoverPos.top,
              left: popoverPos.left,
              width: 240,
              zIndex: 60,
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
            role="menu"
          >
            <button
              onClick={() => {
                // find product title
                const prod =
                  products.find((p) => p.id === openContactForId) ||
                  modalImage ||
                  {};
                openWhatsApp(prod.title || "produk");
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
              onClick={() => {
                // if popover opened from modal (modalImage present), close modal after redirect
                const openedFromModal = Boolean(
                  buttonRefs.current[`modal-${openContactForId}`]
                );
                openPortal(openedFromModal);
              }}
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
      </div>
    </section>
  );
}
