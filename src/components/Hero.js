"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  ChevronDown,
  Play,
  Check,
  MessageCircle,
  ExternalLink,
  X,
  ZoomIn,
} from "lucide-react";
import { redirectToWhatsApp } from "@/app/utils/whatsapp";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const slideVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.98 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -30, scale: 0.98 },
};

// Modal backdrop variants
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal content variants
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    y: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 400,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

const formatPrice = (val) => {
  // jika mendapat angka -> tambahkan "k"
  if (typeof val === "number") return `${val}k`;
  // jika string dan sudah ada 'k' atau non-digit, coba ekstrak angka
  if (typeof val === "string") {
    if (val.trim().endsWith("k")) return val.trim();
    // ambil digit dari string (mis. '350' atau '350k' atau '350.0')
    const digits = val.replace(/[^\d]/g, "");
    if (digits === "") return val;
    return `${parseInt(digits, 10)}k`;
  }
  return val;
};

// PromoCards (Next Image + proporsional)
function PromoCards() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoData, setPromoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // id dari kartu yang sedang membuka popover kontak (null = tidak ada)
  const [openContactForId, setOpenContactForId] = useState(null);

  // apakah popover harus muncul ke atas (true) atau ke bawah (false)
  const [popoverUp, setPopoverUp] = useState(false);

  // wrapper ref untuk tombol + popover
  const contactRef = useRef(null);

  // image preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewAlt, setPreviewAlt] = useState("");

  // DOM ready (untuk createPortal aman di SSR)
  const [domReady, setDomReady] = useState(false);
  useEffect(() => setDomReady(true), []);

  // ambil data dari Supabase pada mount
  useEffect(() => {
    let isMounted = true;

    async function fetchPromos() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", "Promo")
          .order("id", { ascending: true });

        if (error) throw error;
        if (!isMounted) return;

        const normalized = (data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          originalprice:
            p.originalPrice ?? p.originalprice ?? p.originalPriceInt ?? null,
          price:
            p.price_int ??
            (() => {
              if (p.price == null) return null;
              if (typeof p.price === "number") return p.price;
              const digits = ("" + p.price).replace(/[^\d]/g, "");
              return digits ? parseInt(digits, 10) : p.price;
            })(),
          features: Array.isArray(p.features)
            ? p.features
            : p.features
            ? [p.features]
            : [],
          suitable: p.suitable ?? p.suitable_for ?? null,
          image: p.image ?? null,
          raw: p,
        }));

        setPromoData(normalized);
      } catch (err) {
        console.error("Failed to fetch promo products:", err);
        setPromoData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPromos();
    return () => {
      isMounted = false;
    };
  }, []);

  // auto slide
  useEffect(() => {
    if (!promoData || promoData.length === 0) return;
    const t = setInterval(
      () => setCurrentSlide((s) => (s + 1) % promoData.length),
      6000
    );
    return () => clearInterval(t);
  }, [promoData.length]);

  // klik di luar popover -> tutup
  useEffect(() => {
    function handleDocClick(e) {
      if (!contactRef.current) return;
      if (!contactRef.current.contains(e.target)) {
        setOpenContactForId(null);
      }
    }
    if (openContactForId !== null) {
      document.addEventListener("mousedown", handleDocClick);
    }
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [openContactForId]);

  // keyboard handler untuk preview (Esc)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (previewOpen) setPreviewOpen(false);
        if (openContactForId !== null) setOpenContactForId(null);
      }
    }
    if (previewOpen || openContactForId !== null) {
      document.addEventListener("keyup", onKey);
    }
    return () => document.removeEventListener("keyup", onKey);
  }, [previewOpen, openContactForId]);

  // lock scroll saat preview terbuka
  useEffect(() => {
    if (previewOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
      };
    }
  }, [previewOpen]);

  // ---------- POPPER-LIKE LOGIC: Hitung apakah perlu buka popover ke atas ----------
  const computeShouldOpenUp = () => {
    if (!contactRef.current) return false;
    const rect = contactRef.current.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // perkiraan tinggi popover (ubah kalau popovermu lebih tinggi)
    const estimatedPopoverHeight = 140;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // buka ke atas jika ruang bawah < popoverHeight dan ruang atas lebih lapang
    return spaceBelow < estimatedPopoverHeight && spaceAbove > spaceBelow;
  };

  // Jika popover terbuka, rekalkulasi saat resize/scroll
  useEffect(() => {
    if (openContactForId === null) return;

    const recompute = () => {
      setPopoverUp(computeShouldOpenUp());
    };

    // recompute segera setelah open, dan juga saat resize / scroll (capture)
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);

    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [openContactForId]);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center text-sm text-gray-500">
          Loading promos...
        </div>
      </div>
    );
  }

  if (!promoData.length) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center text-sm text-gray-500">
          No promo products found.
        </div>
      </div>
    );
  }

  const promo = promoData[currentSlide];

  // buka wa dengan pesan (buka di tab baru)
  const openWhatsApp = (message) => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setOpenContactForId(null);
  };

  // buka portal penyewaan
  const openPortal = (portalUrl = "https://whatsform.com/10Gv8D") => {
    window.open(portalUrl, "_blank", "noopener,noreferrer");
    setOpenContactForId(null);
  };

  // buka preview gambar (hanya gambar)
  const openImagePreview = (src, alt = "") => {
    if (!src) return;
    setPreviewSrc(src);
    setPreviewAlt(alt);
    setPreviewOpen(true);
  };

  // tutup preview
  const closeImagePreview = () => {
    setPreviewOpen(false);
    // Delay clearing src to allow exit animation
    setTimeout(() => {
      setPreviewSrc(null);
      setPreviewAlt("");
    }, 200);
  };

  return (
    <>
      <motion.div className="relative w-full max-w-md mx-auto bg-white p-3 rounded-lg shadow-sm border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            {/* Gambar dengan hover effect dan zoom indicator */}
            <div className="relative rounded-md overflow-hidden w-full aspect-square max-h-80 group cursor-zoom-in">
              <div
                className="relative w-full h-full"
                onClick={() => openImagePreview(promo.image, promo.title)}
              >
                {promo.image ? (
                  <>
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 320px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay untuk hover effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <ZoomIn className="w-6 h-6 text-gray-800" />
                        </div>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-2 py-0.5 rounded-full text-[11px] font-semibold">
                PROMO
              </div>
            </div>

            {/* Konten */}
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-0.5">
                {promo.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{promo.description}</p>

              {/* Harga */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[11px] text-gray-400 line-through">
                    {formatPrice(promo.originalprice)}
                  </div>
                  <div className="text-xl font-extrabold text-gray-900 leading-none">
                    {formatPrice(promo.price)}
                  </div>
                </div>
              </div>

              {/* Fitur */}
              <ul className="space-y-1 text-xs text-gray-600 mb-2">
                {promo.features && promo.features.length ? (
                  promo.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-1" />
                      <span>{f}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-400">No features listed</li>
                )}
              </ul>

              {/* CTA */}
              <div className="flex items-center justify-between gap-3 relative">
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {promo.suitable}
                </span>

                {/* Wrapper CTA (relative agar popover absoluted di dalamnya) */}
                <div className="relative" ref={contactRef}>
                  <button
                    onClick={() => {
                      // hitung dulu apakah perlu tampil ke atas
                      const shouldOpenUp = computeShouldOpenUp();
                      setPopoverUp(shouldOpenUp);

                      setOpenContactForId((prev) =>
                        prev === promo.id ? null : promo.id
                      );
                    }}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-md text-sm transition-colors duration-200"
                    aria-haspopup="menu"
                    aria-expanded={openContactForId === promo.id}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Hubungi</span>
                  </button>

                  {/* Popover opsi */}
                  <AnimatePresence>
                    {openContactForId === promo.id && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: popoverUp ? 6 : -6,
                          scale: 0.98,
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          y: popoverUp ? 6 : -6,
                          scale: 0.98,
                        }}
                        transition={{ duration: 0.12 }}
                        className={`absolute right-0 w-48 text-black bg-white rounded-lg shadow-lg border border-gray-100 z-20 ${
                          popoverUp ? "bottom-full mb-2" : "top-full mt-2"
                        }`}
                        role="menu"
                      >
                        <button
                          onClick={() =>
                            openWhatsApp(
                              `Halo, saya mau tanya tentang ${promo.title}`
                            )
                          }
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors duration-150"
                          role="menuitem"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">WhatsApp</span>
                        </button>

                        <button
                          onClick={() =>
                            openPortal("https://whatsform.com/10Gv8D")
                          }
                          className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 border-t border-gray-100 transition-colors duration-150"
                          role="menuitem"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Portal Penyewaan</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* FIXED IMAGE PREVIEW MODAL */}
      {domReady &&
        createPortal(
          <AnimatePresence>
            {previewOpen && previewSrc && (
              <motion.div
                key="promo-image-preview"
                className="fixed inset-0 z-[999999] flex items-center justify-center p-4 pt-20 sm:pt-24 pb-8"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={backdropVariants}
                transition={{ duration: 0.3 }}
              >
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/90"
                  onClick={closeImagePreview}
                />

                {/* Modal Content */}
                <motion.div
                  className="relative z-10 w-full max-w-4xl h-auto max-h-[calc(100vh-160px)] mx-auto"
                  variants={modalVariants}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <motion.button
                    onClick={closeImagePreview}
                    className="fixed top-4 right-4 z-[1000000] bg-white hover:bg-gray-100 rounded-full p-3 shadow-2xl transition-all duration-200"
                    aria-label="Close image preview"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-6 h-6 text-gray-800" />
                  </motion.button>

                  {/* Image Container */}
                  <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[75vh] bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={previewSrc}
                      alt={previewAlt}
                      fill
                      sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 1000px"
                      className="object-contain"
                      priority
                      quality={95}
                    />

                    {previewAlt && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4"
                      >
                        <p className="text-white font-semibold text-lg sm:text-xl drop-shadow-lg">
                          {previewAlt}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

// Main Hero Component
const Hero = () => {
  const router = useRouter();

  const scrollToNext = () => {
    router.push("/catalog");
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center translate-y-[-10px] justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('/hero-background.webp')`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Darker Overlay for Improved Contrast */}
      <motion.div
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      ></motion.div>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20">
        {/* Floating Elements */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        ></motion.div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full px-6 py-3 backdrop-blur-sm"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-2 h-2 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              ></motion.div>
              <span className="text-red-400 font-semibold drop-shadow-lg">
                Sejak 2020 • Terpercaya
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight drop-shadow-2xl"
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              >
                <motion.span
                  className="bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Sewa Alat
                </motion.span>
                <br />
                <motion.span
                  className="text-white"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  Event
                </motion.span>
                <motion.span
                  className="inline-block ml-4 text-4xl drop-shadow-md"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🎯
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* description */}
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.p
                className="text-xl lg:text-2xl text-gray-200 leading-relaxed drop-shadow-md"
                variants={fadeInUp}
              >
                <span className="text-red-500 font-bold">
                  Tempat Sewa Multimedia Terbaik
                </span>
                , Proyektor, Screen, TV LED{" "}
                <span className="font-bold">100% Professional!</span>
              </motion.p>
              <motion.p
                className="text-gray-300 text-lg leading-relaxed drop-shadow-sm"
                variants={fadeInUp}
              >
                Solusi lengkap rental multimedia untuk berbagai event di area{" "}
                <span className="font-semibold">
                  Jogja, Bantul, Sleman, Gunung Kidul, Kulonprogo
                </span>{" "}
                dengan layanan terpercaya sejak 2020.
              </motion.p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { number: "1000+", label: "Happy Customers" },
                { number: "100%", label: "On Time Delivery" },
                { number: "2020", label: "Since" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-4xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent drop-shadow-md"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-gray-300 font-medium drop-shadow-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center space-x-3 shadow-2xl group"
                variants={slideInFromLeft}
                onClick={() =>
                  redirectToWhatsApp("Halo, saya mau tanya tentang produk")
                }
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-6 h-6" />
                </motion.div>
                <span className="drop-shadow-sm">Konsultasi Gratis</span>
              </motion.button>

              <motion.button
                onClick={scrollToNext}
                className="bg-transparent border-2 border-red-500 hover:bg-red-500/10 px-8 py-4 rounded-2xl text-white font-bold flex items-center justify-center space-x-3 group hover:border-red-400 drop-shadow-sm"
                variants={slideInFromRight}
                whileHover={{
                  scale: 1.05,
                  borderColor: "#ef4444",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
                <span>Lihat Produk</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Promo Cards */}
          <div className="lg:pl-8 lg:mb-0 mb-8">
            <PromoCards />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex flex-col items-center space-y-2 text-gray-400 group-hover:text-white transition-colors duration-300">
          <span className="text-sm font-medium drop-shadow-sm">
            Scroll untuk melihat lebih
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-6 h-6 drop-shadow-md" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
