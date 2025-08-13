"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
} from "lucide-react";
import { redirectToWhatsApp } from "@/app/utils/whatsapp";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

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
const PromoCards = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoData, setPromoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ambil data dari Supabase pada mount
  useEffect(() => {
    let isMounted = true;

    async function fetchPromos() {
      setLoading(true);
      try {
        // ambil semua kolom relevan. adjust select() kalau butuh kolom lain.
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("category", "Promo")
          .order("id", { ascending: true });

        if (error) throw error;

        if (!isMounted) return;

        // normalisasi data agar kompatibel dengan UI
        const normalized = (data || []).map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          // prefer integer field originalPrice, fallback to originalprice (string)
          originalprice:
            p.originalPrice ?? p.originalprice ?? p.originalPriceInt ?? null,
          // prefer integer 'price_int' or parse 'price' string; fallback to p.price
          price:
            p.price_int ??
            (() => {
              if (p.price == null) return null;
              if (typeof p.price === "number") return p.price;
              // if string like '350k' or '350' -> extract digits
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
          raw: p, // simpan raw jika perlu debugging
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

  // auto slide (hanya aktif jika ada data)
  useEffect(() => {
    if (!promoData || promoData.length === 0) return;
    const t = setInterval(
      () => setCurrentSlide((s) => (s + 1) % promoData.length),
      6000
    );
    return () => clearInterval(t);
  }, [promoData.length]);

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

  return (
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
          {/* Gambar */}
          <div className="relative rounded-md overflow-hidden w-full aspect-square max-h-60">
            {promo.image ? (
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                sizes="(max-width: 768px) 90vw, 320px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
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
            <div className="flex items-center justify-between gap-3">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {promo.suitable}
              </span>
              <button
                onClick={() => {
                  const text = `Halo, saya mau tanya tentang ${promo.title}`;
                  // redirectToWhatsApp helper Anda; fallback langsung ke wa.me
                  const waUrl = `https://wa.me/?text=${encodeURIComponent(
                    text
                  )}`;
                  window.open(waUrl, "_blank");
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-md text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Main Hero Component
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center translate-y-[-10px] justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url('/hero-background.webp')`,
        // y,
        // opacity,
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
          <div className="lg:pl-8">
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
